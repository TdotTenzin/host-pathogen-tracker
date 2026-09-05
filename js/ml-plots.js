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

  // Auto-run once data is available
  if (TOOLKIT_DATA && (TOOLKIT_DATA.ml_pca || TOOLKIT_DATA.pca_data)) {
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
