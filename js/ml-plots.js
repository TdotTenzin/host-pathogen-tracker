/* ---------------------------------------------------------------------------
   ML Analysis Visualizations
   Renders PCA / UMAP scatter plots of pathogen effector features, a
   classifier-comparison bar chart, and the Random Forest feature importances.

   Uses the live API when available, and falls back to pre-computed data
   baked into fallback.json so the section works offline.
   --------------------------------------------------------------------------- */

var ML_PCA_CANVAS = null;
var ML_UMAP_CANVAS = null;
var _umapLiveFailed = false;

function _destroyChart(canvas) {
  if (canvas && typeof Chart !== "undefined") {
    var existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }
}

function initMlPlots() {
  ML_PCA_CANVAS = document.getElementById("ml-pca-chart");
  ML_UMAP_CANVAS = document.getElementById("ml-umap-chart");
  var btn = document.getElementById("ml-run-btn");
  if (btn) btn.addEventListener("click", function() { runMlAnalysis(); });

  // Auto-run once data is available, honoring an active imported source.
  if (typeof _pathogenSource === "object" && _pathogenSource && _pathogenSource.kind === "imported") {
    renderMlImported(_pathogenSource);
  } else if (TOOLKIT_DATA && (TOOLKIT_DATA.ml_pca || TOOLKIT_DATA.pca_data)) {
    renderMlFromFallback();
  }
}

function _fetchJSON(url) {
  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    return Promise.reject(new Error("file:// mode uses embedded data"));
  }
  return fetch(url).then(function(r) { if (!r.ok) throw new Error(url + " status " + r.status); return r.json(); });
}

function runMlAnalysis() {
  if (typeof _pathogenSource === "object" && _pathogenSource && _pathogenSource.kind === "imported") {
    renderMlImported(_pathogenSource);
    return;
  }
  var btn = document.getElementById("ml-run-btn");
  if (btn) { btn.disabled = true; btn.textContent = "Analyzing…"; }

  _fetchJSON("/api/ml/pathogen-pca")
    .then(function(pca) {
      renderPcaScatter(pca);
      return _fetchJSON("/api/ml/compare-classifiers");
    })
    .then(renderClassifierComparison)
    .then(function() {
      return _fetchJSON("/api/ml/umap");
    })
    .then(renderUmapScatter)
    .catch(function() {
      // If live data is unavailable, fall back to baked-in data
      if (btn) { btn.disabled = false; btn.textContent = "Run Analysis"; }
      _umapLiveFailed = true;
      renderMlFromFallback();
    })
    .then(function() {
      if (btn) { btn.disabled = false; btn.textContent = "Run Analysis"; }
    });
}

function renderMlFromFallback() {
  var pca = (TOOLKIT_DATA.ml_pca || TOOLKIT_DATA.pca_data);
  if (pca) renderPcaScatter(pca);
  var cmp = TOOLKIT_DATA.classifier_comparison;
  if (cmp) renderClassifierComparison(cmp);

  // There is no precomputed UMAP embedding in the fallback data — it is
  // computed live by the API. If the live API can never be reached (file://)
  // or it just failed, explain the empty state instead of leaving it blank.
  var showUmapMessage = (typeof window !== "undefined" && window.location.protocol === "file:") || _umapLiveFailed;
  if (showUmapMessage) {
    var umapEl = document.getElementById("ml-umap-chart") || ML_UMAP_CANVAS;
    if (umapEl && Chart && !Chart.getChart(umapEl)) {
      var container = umapEl.closest(".chart-container");
      if (container) {
        container.innerHTML =
          "<p class='network-empty'>The UMAP embedding is computed live and is unavailable offline. " +
          "The PCA plot above shows the same " + (TOOLKIT_DATA.ml_pca && TOOLKIT_DATA.ml_pca.samples ?
            TOOLKIT_DATA.ml_pca.samples.length : "") + "-pathogen dataset.</p>";
      }
    }
  }
}

function _setChartEmpty(canvas, msg) {
  if (!canvas) return;
  var container = canvas.closest(".chart-container");
  if (container && typeof Chart !== "undefined" && !Chart.getChart(canvas)) {
    container.innerHTML = "<p class='network-empty'>" + msg + "</p>";
  }
}

function _effectorFeatureMatrix(src) {
  if (typeof window.buildMyEffectorFeatures !== "function") return null;
  return window.buildMyEffectorFeatures({ pathogens: src.pathogens || [], effectors: src.effectors || [] });
}

/* Re-render the ML section when the pathogen source (curated vs imported)
   changes. Imported datasets get a client-side PCA of their own effector
   features; UMAP comes from the live API when reachable; classifier
   comparison is curated-training-only and explained as such. */
function refreshMlSection() {
  var imported = (typeof _pathogenSource === "object" && _pathogenSource && _pathogenSource.kind === "imported");
  if (!imported) { renderMlFromFallback(); return; }
  renderMlImported(_pathogenSource);
}

function renderMlImported(src) {
  var ft = _effectorFeatureMatrix(src);
  var preds = src.ml_predictions || [];
  var correct = 0;
  preds.forEach(function (p) { if (p.predicted === p.actual) correct++; });

  var status = document.getElementById("ml-status");
  var statusMsg = preds.length
    ? "Prediction accuracy on imported dataset: " + correct + "/" + preds.length + " correct (" + Math.round(100 * correct / preds.length) + "%)"
    : "Imported dataset active — run ML strategy prediction in the My Data panel.";
  if (status) status.innerHTML = statusMsg;

  renderMlImportedPca(src, ft);
  renderMlImportedUmap(src, ft);
  renderMlImportedClassifier(preds, correct);
}

function renderMlImportedPca(src, ft) {
  if (!ML_PCA_CANVAS || typeof Chart === "undefined") return;
  _destroyChart(ML_PCA_CANVAS);
  if (!ft || !ft.rows || ft.rows.length < 2) {
    _setChartEmpty(ML_PCA_CANVAS, "Not enough imported pathogens with effector features to run PCA.");
    return;
  }
  var pca = (typeof Stats !== "undefined") ? Stats.pca(ft.rows, 2) : null;
  if (!pca) {
    _setChartEmpty(ML_PCA_CANVAS, "PCA failed on the imported dataset.");
    return;
  }
  var stratByPathogen = {};
  (src.pathogens || []).forEach(function (p) { stratByPathogen[p.name] = p.strategy || "unknown"; });
  var samples = ft.names.map(function (name, i) {
    var strat = stratByPathogen[name] || "unknown";
    return { name: name, x: pca.scores[i][0], y: pca.scores[i][1], strategy: strat };
  });
  renderPcaScatter({ samples: samples, explained_variance_ratio: pca.explained || [] });
}

function renderMlImportedUmap(src, ft) {
  if (!ML_UMAP_CANVAS || typeof Chart === "undefined") return;
  _destroyChart(ML_UMAP_CANVAS);
  if (!ft || !ft.rows || ft.rows.length < 2) {
    _setChartEmpty(ML_UMAP_CANVAS, "Not enough imported data for UMAP.");
    return;
  }
  if (typeof window === "undefined" || window.location.protocol === "file:") {
    _setChartEmpty(ML_UMAP_CANVAS, "UMAP is computed server-side and is unavailable offline. The PCA plot above uses the same imported dataset.");
    return;
  }
  fetch("/api/mydata/umap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columns: ft.columns, rows: ft.rows, labels: ft.names })
  })
    .then(function (r) { if (!r.ok) throw new Error("/api/mydata/umap status " + r.status); return r.json(); })
    .then(function (data) {
      var stratByPathogen = {};
      (src.pathogens || []).forEach(function (p) { stratByPathogen[p.name] = p.strategy || "unknown"; });
      (data.samples || []).forEach(function (s) {
        s.name = s.condition || "";
        var strat = stratByPathogen[s.condition] || "unknown";
        if (stratByPathogen[s.condition]) s.condition = strat;
      });
      renderUmapScatter(data);
    })
    .catch(function () {
      _setChartEmpty(ML_UMAP_CANVAS, "Live API unavailable — UMAP could not be computed for the imported dataset.");
    });
}

function renderMlImportedClassifier(preds, correct) {
  var canvas = document.getElementById("ml-classifier-chart");
  if (!canvas || typeof Chart === "undefined") return;
  _destroyChart(canvas);
  var box = canvas.closest(".chart-container");
  if (!box) return;
  if (preds.length) {
    box.innerHTML = "<p class='network-empty'>Classifier cross-validation reflects the curated training set, so it is not recomputed for imported data. For this import, prediction results were <strong>" + correct + "/" + preds.length + "</strong> correct (" + Math.round(100 * correct / preds.length) + "%).</p>";
  } else {
    box.innerHTML = "<p class='network-empty'>Classifier comparison is trained on the curated dataset. Use <strong>Run ML</strong> in the My Data panel to get evasion-strategy predictions on your import.</p>";
  }
}

function renderPcaScatter(data) {
  if (!ML_PCA_CANVAS || typeof Chart === "undefined") return;
  _destroyChart(ML_PCA_CANVAS);
  if (!data || !data.samples || !data.samples.length) {
    ML_PCA_CANVAS.closest(".chart-container").innerHTML = "<p class='network-empty'>No PCA data available.</p>";
    return;
  }

  var stratSet = {};
  data.samples.forEach(function(s) { stratSet[s.strategy] = true; });
  var strategies = Object.keys(stratSet);

  var datasets = strategies.map(function(strategy) {
    return {
      label: STRATEGY_LABELS[strategy] || strategy,
      data: data.samples
        .filter(function(s) { return s.strategy === strategy; })
        .map(function(s) { return { x: s.PC1, y: s.PC2, name: s.pathogen, strategy: strategy }; }),
      backgroundColor: (STRATEGY_COLORS[strategy] || "#6366f1") + "CC",
      borderColor: STRATEGY_COLORS[strategy] || "#6366f1",
      pointRadius: 5,
      pointHoverRadius: 7
    };
  });

  var ev = data.explained_variance_ratio || [];
  var subtitle = ev.length >= 2
    ? "PC1 (" + (ev[0] * 100).toFixed(0) + "% variance) × PC2 (" + (ev[1] * 100).toFixed(0) + "%)"
    : "PCA projection of pathogen features";

  new Chart(ML_PCA_CANVAS, {
    type: "scatter",
    data: { datasets: datasets },
    options: _scatterOptions(subtitle, "PC1", "PC2")
  });
}

function renderUmapScatter(data) {
  if (!ML_UMAP_CANVAS || typeof Chart === "undefined") return;
  _destroyChart(ML_UMAP_CANVAS);
  if (!data || !data.samples || !data.samples.length) return;

  if (data.error) {
    ML_UMAP_CANVAS.closest(".chart-container").innerHTML = "<p class='network-empty'>" +
      _escapeHtml(data.error.replace(/\.$/, "") ) + ".</p>";
    return;
  }

  var stratSet = {};
  data.samples.forEach(function(s) {
    // map condition labels to strategy-ish groups when possible
    var key = s.condition || "sample";
    stratSet[key] = true;
  });
  var groups = Object.keys(stratSet);

  var datasets = groups.map(function(group) {
    return {
      label: group,
      data: data.samples
        .filter(function(s) { return (s.condition || "sample") === group; })
        .map(function(s) { return { x: s.UMAP1, y: s.UMAP2 }; }),
      backgroundColor: STRATEGY_COLORS[group] || "#10b981" + "CC",
      borderColor: STRATEGY_COLORS[group] || "#10b981",
      pointRadius: 5,
      pointHoverRadius: 7
    };
  });

  new Chart(ML_UMAP_CANVAS, {
    type: "scatter",
    data: { datasets: datasets },
    options: _scatterOptions("UMAP embedding (n_neighbors=5, min_dist=0.3)", "UMAP1", "UMAP2")
  });
}

function _scatterOptions(subtitle, xLabel, yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: subtitle,
        font: { size: 12 },
        color: "#64748b"
      },
      legend: { position: "bottom", labels: { padding: 12, font: { size: 11 }, usePointStyle: true, pointStyle: "circle" } },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            var p = ctx.raw;
            var name = p.name || p.pathogen || "";
            return " " + name + " [" + (p.strategy || ctx.dataset.label) + "]";
          }
        }
      }
    },
    scales: {
      x: { title: { display: true, text: xLabel }, grid: { color: "rgba(148,163,184,0.12)" } },
      y: { title: { display: true, text: yLabel }, grid: { color: "rgba(148,163,184,0.12)" } }
    }
  };
}

function renderClassifierComparison(data) {
  var canvas = document.getElementById("ml-classifier-chart");
  if (!canvas || typeof Chart === "undefined") return;
  _destroyChart(canvas);
  if (!data || !data.length) return;

  var labels = data.map(function(d) { return d.model; });
  var accs = data.map(function(d) { return d.mean_accuracy * 100; });
  var errs = data.map(function(d) { return d.std_accuracy * 100; });
  var colors = data.map(function(d) {
    return d.model === "Random Forest" ? "#3b82f6" : "#94a3b8";
  });

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: accs,
        backgroundColor: colors.map(function(c) { return c + "CC"; }),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var idx = ctx.dataIndex;
              return " Accuracy: " + ctx.raw.toFixed(1) + "% ± " + (errs[idx] || 0).toFixed(1) + "%";
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true, max: 100, title: { display: true, text: "Cross-validated accuracy (%)" } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

/* Hook into init */
var _origInitToolkit_ml = initToolkit;
initToolkit = function() {
  if (_origInitToolkit_ml) _origInitToolkit_ml();
  initMlPlots();
};
