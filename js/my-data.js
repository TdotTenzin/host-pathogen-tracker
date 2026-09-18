/* ---------------------------------------------------------------------------
   My Data — import your own data and run the site's analysis tools on it.

   Two modes:
     - hostpathogen : pathogen/effector tables -> network, hub proteins, stage
                      mapping, pathway enrichment, ML strategy prediction, and
                      effector-feature PCA.
     - numeric      : tabular numeric data -> descriptive stats, correlation,
                      PCA, k-means clustering, OLS regression, histograms.

   Presets bundle the built-in curated dataset and a sample expression table so
   users can load them like an import. Imports work fully offline (file://);
   ML strategy prediction and UMAP additionally use the live API when present.
   --------------------------------------------------------------------------- */

(function () {
  "use strict";

  var STATE_KEY = "hphub_mydata";
  var MyData = {
    state: null,
    activeTab: "overview"
  };

  /* ------------------------------------------------------------------ init */
  function initMyData() {
    var fileInput = document.getElementById("mydata-file");
    if (fileInput) fileInput.addEventListener("change", onMyFilePicked);

    var saved = null;
    try { saved = localStorage.getItem(STATE_KEY); } catch (e) { saved = null; }
    if (saved) {
      try {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.mode && parsed.mode === "hostpathogen") {
          MyData.state = parsed;
        } else if (parsed && parsed.mode && parsed.mode === "numeric") {
          MyData.state = parsed;
        }
      } catch (e) { /* ignore corrupt saves */ }
    }
    if (MyData.state) {
      renderMyData();
      if (MyData.state.mode === "hostpathogen") {
        MyDataApplyImported(MyData.state);
      }
    }
  }

  function MyDataApplyImported(dataset) {
    if (typeof applyImportedPathogens === "function") {
      applyImportedPathogens(dataset.pathogens, dataset.effectors, {
        label: dataset.label || "Imported data",
        ml_predictions: dataset.ml_predictions || null,
        kind: dataset.preset === "curated" ? "curated" : "imported"
      });
    }
  }

  /* ------------------------------------------------------------- state set */
  function setMyDataState(dataset) {
    MyData.state = dataset;
    MyData.activeTab = "overview";
    try { localStorage.setItem(STATE_KEY, JSON.stringify(dataset)); } catch (e) { /* storage may be unavailable */ }
    renderMyData();
    if (dataset.mode === "hostpathogen") MyDataApplyImported(dataset);
  }

  function clearMyData() {
    MyData.state = null;
    MyData.activeTab = "overview";
    try { localStorage.removeItem(STATE_KEY); } catch (e) { /* ignore */ }
    var panel = document.getElementById("mydata-panel");
    if (panel) panel.style.display = "none";
    var tabs = document.getElementById("mydata-tabs");
    if (tabs) tabs.innerHTML = "";
    var content = document.getElementById("mydata-content");
    if (content) content.innerHTML = "";
    var status = document.getElementById("mydata-status");
    if (status) status.innerHTML = "<em>Data cleared. Load a preset or import a file to begin.</em>";
    var fileInput = document.getElementById("mydata-file");
    if (fileInput) fileInput.value = "";
    if (typeof resetCuratedPathogens === "function") resetCuratedPathogens();
  }

  /* ------------------------------------------------------------- presets */
  function loadDataPreset(name) {
    var dataset = null;
    if (name === "curated") dataset = CSVUtils.buildPresetCurated();
    else dataset = CSVUtils.buildPresetNumeric();
    if (!dataset) return;
    showMyStatus("Loaded preset: <strong>" + _escapeHtml(dataset.label) + "</strong>");
    setMyDataState(dataset);
  }

  /* ------------------------------------------------------ import methods */
  function onMyImportMethod() {
    var method = _myImportMethod();
    var fileInput = document.getElementById("mydata-file");
    var textarea = document.getElementById("mydata-text");
    var label = document.getElementById("mydata-text-label");
    var showText = method !== "file";
    if (fileInput) {
      fileInput.style.display = method === "file" ? "block" : "none";
      if (method === "file") fileInput.value = "";
    }
    if (textarea) {
      textarea.style.display = showText ? "block" : "none";
      textarea.value = "";
    }
    if (label) {
      label.style.display = showText ? "block" : "none";
      if (method === "json") label.textContent = "Paste JSON ({ pathogens, effectors } or { columns, rows }):";
      else label.textContent = "Paste CSV or TSV (first row = column headers):";
    }
  }

  function _myImportMethod() {
    var radios = document.querySelectorAll('input[name="mydata-method"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked && radios[i].value === "json") return "json";
      if (radios[i].checked && radios[i].value === "paste") return "paste";
    }
    return "file";
  }

  var _pickedFileText = null;

  function onMyFilePicked(evt) {
    var file = evt.target && evt.target.files && evt.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      _pickedFileText = String(e.target.result || "");
      showMyStatus("File <strong>" + _escapeHtml(file.name) + "</strong> loaded (" +
        _pickedFileText.length + " chars). Click <strong>Import</strong> to analyze.");
    };
    reader.onerror = function () { showMyStatus('<div class="error">Could not read the file.</div>'); };
    reader.readAsText(file);
  }

  function importFromActiveMethod() {
    var method = _myImportMethod();
    var text = "";
    if (method === "file") {
      text = _pickedFileText || "";
      if (!text) {
        showMyStatus('<div class="error">Choose a file first.</div>');
        return;
      }
    } else {
      var textarea = document.getElementById("mydata-text");
      text = textarea ? textarea.value : "";
    }
    if (!text || !text.trim()) {
      showMyStatus('<div class="error">Nothing to import — paste or upload your data first.</div>');
      return;
    }

    var dataset;
    if (method === "json") {
      dataset = normalizeImportedObject(parseMaybeJSON(text));
    } else {
      dataset = datasetFromTable(text);
    }

    if (!dataset) {
      showMyStatus('<div class="error">Could not recognize the data. Expected a host-pathogen table (columns like <code>pathogen</code>, <code>effector</code>, <code>host_target</code>), a pathogen-profiles table (columns like <code>pathogen</code>, <code>strategy</code>, <code>gram_stain</code>, <code>description</code>), or a numeric table. Templates are links above.</div>');
      return;
    }

    var summary = dataset.mode === "hostpathogen"
      ? dataset.pathogens.length + " pathogens · " + dataset.effectors.length + " effectors"
      : dataset.rows.length + " rows × " + dataset.columns.length + " columns";
    showMyStatus("Imported successfully: <strong>" + _escapeHtml(dataset.label || "user data") + "</strong> &nbsp;(" + summary + ")");
    _pickedFileText = null;
    setMyDataState(dataset);
  }

  function parseMaybeJSON(text) {
    try { return JSON.parse(text); } catch (e) { return null; }
  }

  /* Accept JSON in several shapes and turn it into a state dataset. */
  function normalizeImportedObject(obj) {
    if (!obj || typeof obj !== "object") return null;
    if (Array.isArray(obj)) {
      // list of effector records
      var table = { columns: ["pathogen", "effector", "type", "host_target", "mechanism"], rows: obj.map(function (r) {
        return [r.pathogen || "", r.effector || "", r.type || "", r.host_target || "", r.mechanism || ""];
      }) };
      return hostpathogenFromJsonRows(table);
    }
    if (obj.columns && obj.rows) {
      return {
        mode: "numeric",
        label: obj.label || "Imported numeric data",
        columns: obj.columns,
        rows: obj.rows
      };
    }
    if ((obj.effectors && Array.isArray(obj.effectors)) || (obj.pathogens && Array.isArray(obj.pathogens))) {
      var effs = obj.effectors || [];
      return {
        mode: "hostpathogen",
        label: obj.label || "Imported host-pathogen data",
        pathogens: obj.pathogens || [],
        effectors: effs,
        ml_predictions: obj.ml_predictions || null,
        host_proteins: obj.host_proteins || CSVUtils.hostTargetsFromEffectors(effs)
      };
    }
    return null;
  }

  function hostpathogenFromJsonRows(table) {
    var norm = CSVUtils.normalizeHostPathogen(table.columns, table.rows);
    return {
      mode: "hostpathogen",
      label: "Imported host-pathogen data",
      pathogens: norm.pathogens,
      effectors: norm.effectors,
      host_proteins: norm.host_proteins
    };
  }

  function datasetFromTable(text) {
    var table = CSVUtils.parseTable(text);
    if (!table.columns.length) return null;
    var mode = CSVUtils.detectMode(table.columns, table.rows);
    if (mode === "hostpathogen") {
      var norm = CSVUtils.normalizeHostPathogen(table.columns, table.rows);
      if (!norm.pathogens.length) return null;
      return {
        mode: "hostpathogen",
        label: "Imported host-pathogen data",
        pathogens: norm.pathogens,
        effectors: norm.effectors,
        host_proteins: norm.host_proteins
      };
    }
    if (mode === "numeric") {
      return { mode: "numeric", label: "Imported numeric data", columns: table.columns, rows: table.rows };
    }
    return null;
  }

  /* ------------------------------------------------------------- helpers */
  function showMyStatus(html) {
    var el = document.getElementById("mydata-status");
    if (el) el.innerHTML = html;
  }

  function _pathogensOf(state) { return state.pathogens || []; }
  function _effectorsOf(state) { return state.effectors || []; }

  function _htmlTable(headers, rows) {
    if (!rows || !rows.length) return "<em>No rows to display.</em>";
    var html = "<table><thead><tr>";
    headers.forEach(function (h) { html += "<th>" + _escapeHtml(h) + "</th>"; });
    html += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      html += "<tr>";
      r.forEach(function (c) { html += "<td>" + (c === null || c === undefined ? "—" : _escapeHtml(String(c))) + "</td>"; });
      html += "</tr>";
    });
    html += "</tbody></table>";
    return html;
  }

  function _destroyChart(canvas) {
    if (canvas && typeof Chart !== "undefined") {
      var existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }
  }

  function _badge(text, cls) {
    return '<span class="badge ' + (cls || "badge-gray") + '">' + _escapeHtml(text) + "</span>";
  }

  /* ---------------------------------------------------------------- tabs */
  var TABS_MODE = {
    hostpathogen: [
      { id: "overview", label: "Overview" },
      { id: "effectors", label: "Effectors" },
      { id: "network", label: "Network" },
      { id: "hubs", label: "Hubs" },
      { id: "stages", label: "Stage Map" },
      { id: "enrichment", label: "Enrichment" },
      { id: "strategy", label: "Strategy (ML)" },
      { id: "pca", label: "Effector PCA" }
    ],
    numeric: [
      { id: "overview", label: "Overview" },
      { id: "stats", label: "Statistics" },
      { id: "corr", label: "Correlation" },
      { id: "pca", label: "PCA" },
      { id: "clusters", label: "Clusters" },
      { id: "regression", label: "Regression" },
      { id: "histograms", label: "Histograms" }
    ]
  };

  function renderMyData() {
    var state = MyData.state;
    if (!state) return;
    var panel = document.getElementById("mydata-panel");
    if (panel) panel.style.display = "block";

    var title = document.getElementById("mydata-dataset-title");
    if (title) {
      title.textContent = (state.label || "My data") + " — " + (state.mode === "hostpathogen" ? "host-pathogen" : "numeric");
    }

    var tabs = TABS_MODE[state.mode] || TABS_MODE.numeric;
    var tabEl = document.getElementById("mydata-tabs");
    if (tabEl) {
      tabEl.innerHTML = tabs.map(function (t) {
        return '<button class="mydata-tab' + (t.id === MyData.activeTab ? " active" : "") + '" data-tab="' + t.id + '" onclick="setMyTab(this)" type="button">' + _escapeHtml(t.label) + "</button>";
      }).join("");
    }
    renderMyTab();
  }

  function setMyTab(btnOrId) {
    var id = typeof btnOrId === "string" ? btnOrId : (btnOrId && btnOrId.getAttribute("data-tab")) || "overview";
    MyData.activeTab = id;
    renderMyTab();
    var tabs = document.getElementById("mydata-tabs");
    if (!tabs) return;
    var buttons = tabs.querySelectorAll(".mydata-tab");
    if (buttons.forEach) buttons.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === id);
    });
  }

  function renderMyTab() {
    var state = MyData.state;
    if (!state) return;
    var id = MyData.activeTab;
    if (state.mode === "hostpathogen") {
      if (id === "overview") renderMyOverview();
      else if (id === "effectors") renderMyEffectors();
      else if (id === "network") renderMyNetwork();
      else if (id === "hubs") renderMyHubs();
      else if (id === "stages") renderMyStages();
      else if (id === "enrichment") renderMyEnrichment();
      else if (id === "strategy") renderMyStrategy();
      else if (id === "pca") renderEffectorPca();
      else {
        if (id === "stats" || id === "corr" || id === "clusters" || id === "regression" || id === "histograms") renderNumericTab(id);
        else renderMyOverview();
      }
    } else {
      renderNumericTab(id);
    }
  }

  /* ----------------------------------------------- MODE A: overview */
  function renderMyOverview() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    if (state.mode === "hostpathogen") {
      var eff = _effectorsOf(state);
      var targets = CSVUtils.hostTargetsFromEffectors(eff);
      var top = {};
      eff.forEach(function (e) { top[e.pathogen_name] = (top[e.pathogen_name] || 0) + 1; });
      var sorted = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; }).slice(0, 8)
        .map(function (p) { return [p, top[p]]; });

      var stats = [
        ["Pathogens", _pathogensOf(state).length],
        ["Effectors", eff.length],
        ["Distinct host targets", targets.length],
        ["Host proteins (curated match)", curatedMatchCount(targets)]
      ];
      el.innerHTML =
        '<div class="mydata-kpis">' + stats.map(function (s) {
          return '<div class="mydata-kpi"><div class="mydata-kpi-value">' + s[1] + '</div><div class="mydata-kpi-label">' + _escapeHtml(s[0]) + "</div></div>";
        }).join("") + "</div>"
        + '<h3 class="chart-heading">Top pathogens by effector count</h3>'
        + _htmlTable(["Pathogen", "Effectors"], sorted)
        + '<p class="chart-caption">Open the other tabs to run the network, hub, stage, enrichment, ML, and PCA tools on this dataset.</p>';
    } else {
      var numCols = numericColumns(state);
      el.innerHTML =
        '<div class="mydata-kpis">' + [
          ["Columns", state.columns.length],
          ["Rows", state.rows.length],
          ["Numeric columns", numCols.length],
          ["Cells missing", missingCells(state)]
        ].map(function (s) {
          return '<div class="mydata-kpi"><div class="mydata-kpi-value">' + s[1] + '</div><div class="mydata-kpi-label">' + _escapeHtml(s[0]) + "</div></div>";
        }).join("") + "</div>"
        + '<h3 class="chart-heading">Preview (first 10 rows)</h3>'
        + _htmlTable(state.columns, state.rows.slice(0, 10))
        + '<p class="chart-caption">Run statistics, correlation, PCA, clustering, regression, and histograms on this table.</p>';
    }
  }

  function curatedMatchCount(targets) {
    var known = {};
    (TOOLKIT_DATA.host_proteins || []).forEach(function (h) { known[h.name] = true; });
    return targets.filter(function (t) {
      var n = typeof t === "string" ? t : (t && t.name);
      return known[n];
    }).length;
  }

  /* --------------------------------------------- MODE A: effectors */
  function renderMyEffectors() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    var eff = _effectorsOf(state);
    if (!eff.length) { el.innerHTML = "<em>No effectors in this dataset.</em>"; return; }

    var pathogens = _pathogensOf(state);
    var selectOptions = pathogens.map(function (p) {
      return '<option value="' + _escapeHtml(p.name) + '">' + _escapeHtml(p.name) + '</option>';
    }).join("");
    var addSearch = function (pathogen) {
      var filt = pathogen ? eff.filter(function (e) { return e.pathogen_name === pathogen; }) : eff;
      var q = document.getElementById("my-eff-search");
      if (q && q.value) {
        var needle = q.value.toLowerCase();
        filt = filt.filter(function (e) {
          return (e.effector_name || "").toLowerCase().indexOf(needle) !== -1
            || (e.type || "").toLowerCase().indexOf(needle) !== -1
            || (e.host_target || "").toLowerCase().indexOf(needle) !== -1
            || (e.mechanism || "").toLowerCase().indexOf(needle) !== -1;
        });
      }
      var out = document.getElementById("my-eff-table");
      if (out) out.innerHTML = _htmlTable(["Effector", "Type", "Host Target", "Mechanism"], filt.map(function (e) {
        return [e.effector_name, e.type, e.host_target, e.mechanism];
      }));
    };

    el.innerHTML =
      '<div class="mydata-tool-row">'
      + '<select id="my-eff-pathogen" class="tool-select" onchange="filterMyEffectors()"><option value="">All pathogens</option>' + selectOptions + "</select>"
      + '<input id="my-eff-search" class="tool-input" type="text" placeholder="Filter effectors…" oninput="filterMyEffectors()">'
      + "</div>"
      + '<div id="my-eff-table" class="tool-result"></div>';
    filterMyEffectors();
  }

  function filterMyEffectors() {
    var state = MyData.state;
    if (!state || state.mode !== "hostpathogen") return;
    var sel = document.getElementById("my-eff-pathogen");
    var q = document.getElementById("my-eff-search");
    var filt = _effectorsOf(state);
    if (sel && sel.value) filt = filt.filter(function (e) { return e.pathogen_name === sel.value; });
    if (q && q.value) {
      var needle = q.value.toLowerCase();
      filt = filt.filter(function (e) {
        return (e.effector_name || "").toLowerCase().indexOf(needle) !== -1
          || (e.type || "").toLowerCase().indexOf(needle) !== -1
          || (e.host_target || "").toLowerCase().indexOf(needle) !== -1
          || (e.mechanism || "").toLowerCase().indexOf(needle) !== -1;
      });
    }
    var out = document.getElementById("my-eff-table");
    if (out) out.innerHTML = _htmlTable(["Effector", "Type", "Host Target", "Mechanism"], filt.map(function (e) {
      return [e.effector_name, e.type, e.host_target, e.mechanism];
    }));
  }

  /* --------------------------------------------- MODE A: network */
  function renderMyNetwork() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    var pathogens = _pathogensOf(state);
    if (!pathogens.length) { el.innerHTML = "<em>No pathogens in this dataset.</em>"; return; }

    var options = pathogens.map(function (p, i) {
      return '<option value="' + i + '">' + _escapeHtml(p.name) + ' (' + (p.n_effectors || "?") + ' effectors)</option>';
    }).join("");

    el.innerHTML =
      '<div class="mydata-tool-row">'
      + '<label class="tool-select-label" for="my-network-select">Pathogen</label>'
      + '<select id="my-network-select" class="tool-select" onchange="loadMyNetwork()">' + options + "</select>"
      + "</div>"
      + '<div class="chart-container interactome-graph-container"><div id="my-network-graph" class="interactome-graph"></div></div>'
      + '<p class="chart-caption">Force-directed view of the selected pathogen’s effectors targeting host proteins in your dataset. Hover to highlight, drag to rearrange.</p>';
    loadMyNetwork();
  }

  function loadMyNetwork() {
    var state = MyData.state;
    var container = document.getElementById("my-network-graph");
    if (!container) return;
    var sel = document.getElementById("my-network-select");
    var idx = sel ? parseInt(sel.value, 10) : 0;
    var pathogens = _pathogensOf(state);
    var name = pathogens[idx] ? pathogens[idx].name : (pathogens[0] && pathogens[0].name) || "";
    if (!name) { container.innerHTML = "<p class='network-empty'>No data.</p>"; return; }

    var data = buildMyNetwork(name);
    container.innerHTML = "";
    if (!data.nodes.length) { container.innerHTML = "<p class='network-empty'>No effector–host interactions for this pathogen.</p>"; return; }
    if (typeof d3 === "undefined") { container.innerHTML = "<p class='network-empty'>Network visualization requires D3.js.</p>"; return; }
    if (typeof drawNetwork === "function") {
      drawNetwork(container, data, name);
    } else {
      container.innerHTML = "<p class='network-empty'>Network renderer not loaded.</p>";
    }
  }

  /* Mirror network.js's graph builder, reading imported effectors. */
  function buildMyNetwork(pathogenName) {
    var effs = _effectorsOf(MyData.state).filter(function (e) { return e.pathogen_name === pathogenName; });
    var nodes = [], edges = [], nodeById = {};
    function addNode(id, label, type, opts) {
      if (nodeById[id]) return nodeById[id];
      var n = { id: id, label: label, type: type, degree: 0 };
      if (opts) Object.keys(opts).forEach(function (k) { n[k] = opts[k]; });
      nodeById[id] = n; nodes.push(n); return n;
    }
    effs.forEach(function (e) {
      var eid = "E:" + e.effector_name;
      addNode(eid, e.effector_name, "effector", { type: e.type || "", mechanism: e.mechanism || "" });
      CSVUtils.splitTargets(e.host_target).forEach(function (t) {
        if (/membrane|surfaces?|cells?|immune|apoptosis|signal|iron|glycans|DNA|ROS|claudins|adhesion/i.test(t)) return;
        var hid = "H:" + t;
        addNode(hid, t, "host");
        edges.push({ source: eid, target: hid });
        nodeById[eid].degree += 1;
        nodeById[hid].degree += 1;
      });
    });
    return { nodes: nodes, edges: edges, pathogens: effs.length ? [pathogenName] : [] };
  }

  /* ------------------------------------------------ MODE A: hubs */
  function renderMyHubs() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    var tally = {};
    _effectorsOf(state).forEach(function (e) {
      CSVUtils.splitTargets(e.host_target).forEach(function (t) { tally[t] = (tally[t] || 0) + 1; });
    });
    var hubs = Object.keys(tally).map(function (t) {
      return { host: t, degree: tally[t] };
    }).sort(function (a, b) { return b.degree - a.degree; });

    el.innerHTML =
      '<h3 class="chart-heading">Most-targeted host proteins</h3>'
      + '<div class="chart-container chart-container-sm mb-12"><canvas id="my-hubs-chart"></canvas></div>'
      + _htmlTable(["#", "Host target", "Effectors targeting"], hubs.slice(0, 25).map(function (h, i) {
        return [i + 1, h.host, h.degree];
      }))
      + '<button class="tool-btn tool-btn-sm mt-12" onclick="downloadMyHubs()">Download hubs CSV</button>';
    renderMyHubsChart(hubs);
  }

  function renderMyHubsChart(hubs) {
    var canvas = document.getElementById("my-hubs-chart");
    if (!canvas || typeof Chart === "undefined") return;
    _destroyChart(canvas);
    var top = hubs.slice(0, 6);
    new Chart(canvas, {
      type: "bar",
      data: { labels: top.map(function (h) { return h.host; }), datasets: [{ data: top.map(function (h) { return h.degree; }), backgroundColor: "#8b5cf6", borderRadius: 4 }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  function downloadMyHubs() {
    var state = MyData.state;
    if (!state || state.mode !== "hostpathogen") return;
    var tally = {};
    state.effectors.forEach(function (e) {
      CSVUtils.splitTargets(e.host_target).forEach(function (t) { tally[t] = (tally[t] || 0) + 1; });
    });
    var rows = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; })
      .map(function (t) { return [t, tally[t]]; });
    downloadMyCSV(["host_protein", "n_effectors"], rows, "my_data_hubs.csv");
  }

  /* --------------------------------------------- MODE A: stages */
  function renderMyStages() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    var markerStages = buildMarkerStageMap();
    if (!Object.keys(markerStages).length) {
      el.innerHTML = "<em>Stage profiles are not available yet — try again after the page finishes loading.</em>";
      return;
    }

    var pathogens = _pathogensOf(state);
    var rows = [];
    pathogens.forEach(function (p) {
      var targets = {};
      state.effectors.forEach(function (e) {
        if (e.pathogen_name === p.name) {
          CSVUtils.splitTargets(e.host_target).forEach(function (t) { targets[t] = true; });
        }
      });
      var hitsByStage = {};
      var names = Object.keys(targets);
      names.forEach(function (t) {
        var ms = markerStages[t];
        if (ms) hitsByStage[ms.stage] = (hitsByStage[ms.stage] || 0) + 1;
      });
      var stages = Object.keys(hitsByStage).sort(function (a, b) {
        return hitsByStage[b] - hitsByStage[a] || stageOrder(a) - stageOrder(b);
      });
      var best = stages[0];
      rows.push({
        pathogen: p.name,
        n_targets: names.length,
        best: best || "—",
        details: stages.length ? stages.map(function (s) { return s + " (" + hitsByStage[s] + ")"; }).join(", ") : "no marker overlap"
      });
    });

    el.innerHTML =
      '<h3 class="chart-heading">Maturation stages touched by each pathogen</h3>'
      + "<p class=\"text-muted\">Stages are inferred by matching each pathogen’s host targets against the curated phagosome-maturation stage marker profiles.</p>"
      + _htmlTable(["Pathogen", "Host targets", "Best-matching stage", "Matches per stage"], rows.map(function (r) {
        return [r.pathogen, r.n_targets, r.best, r.details];
      }))
      + '<p class="chart-caption">A pathogen is predicted to act where its targeted host proteins are the earliest stage markers — e.g., Rab5/EEA1 targets map to the Early phagosome.</p>';
  }

  function buildMarkerStageMap() {
    var map = {};
    (TOOLKIT_DATA.stage_markers || []).forEach(function (sm) {
      if (sm.presence === 1 && sm.host_protein_name) {
        map[sm.host_protein_name] = { stage: sm.stage_name };
      }
    });
    return map;
  }

  function stageOrder(stage) {
    var stages = TOOLKIT_DATA.maturation_stages || [];
    for (var i = 0; i < stages.length; i++) if (stages[i].name === stage) return stages[i].stage_order;
    return 99;
  }

  /* ------------------------------------------ MODE A: enrichment */
  function renderMyEnrichment() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    var db = buildPathwayDb();
    var genes = [];
    _effectorsOf(state).forEach(function (e) {
      CSVUtils.splitTargets(e.host_target).forEach(function (t) { genes.push(t); });
    });
    var results = Stats.enrichment(genes, db);
    if (!results.length) {
      el.innerHTML = "<em>No over-represented pathways — none of the targeted host proteins match the curated pathway database.</em>";
      return;
    }
    el.innerHTML =
      '<h3 class="chart-heading">Pathway enrichment of targeted host proteins</h3>'
      + "<p class=\"text-muted\">Hypergeometric over-representation test (Fisher’s exact) with Bonferroni correction against the curated host-protein pathway database.</p>"
      + _htmlTable(["Pathway", "Overlap", "p-value", "p-adj", "Members hit"], results.slice(0, 20).map(function (r) {
        return [r.pathway, r.ratio, r.p_value.toFixed(4), r.p_adjusted.toFixed(4), r.members_hit.join(", ")];
      }));
  }

  function buildPathwayDb() {
    var db = {};
    (TOOLKIT_DATA.host_proteins || []).forEach(function (h) {
      var pw = h.pathway || h.full_pathway;
      if (!pw || typeof pw !== "string") return;
      if (!db[pw]) db[pw] = [];
      if (db[pw].indexOf(h.name) === -1) db[pw].push(h.name);
    });
    return db;
  }

  /* ------------------------------------------------ MODE A: ML strategy */
  function renderMyStrategy() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    var eff = _effectorsOf(state);
    if (!eff.length) { el.innerHTML = "<em>No effectors to predict on.</em>"; return; }

    el.innerHTML =
      '<h3 class="chart-heading">Immune-evasion strategy prediction</h3>'
      + "<p class=\"text-muted\">The Random Forest trained on the curated dataset predicts a strategy for each pathogen in your data, from its effector repertoire.</p>"
      + '<div id="my-strategy-result" class="tool-result"><em>Loading…</em></div>'
      + '<div id="my-strategy-importance"></div>';

    var payload = eff.map(function (e) {
      return { pathogen: e.pathogen_name, effector: e.effector_name, type: e.type, host_target: e.host_target };
    });

    fetch("/api/mydata/predict-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ effectors: payload })
    })
      .then(function (r) { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .then(function (data) {
        var box = document.getElementById("my-strategy-result");
        if (box) {
          box.innerHTML = _htmlTable(["Pathogen", "Predicted strategy", "Confidence", "Effectors"], data.predictions.map(function (p) {
            return [p.pathogen, p.predicted_strategy.replace(/_/g, " "), (p.confidence * 100).toFixed(0) + "%", p.n_effectors];
          }));
        }
        var imp = document.getElementById("my-strategy-importance");
        if (imp && data.feature_importances) {
          imp.innerHTML = '<h4 class="mydata-subtitle">Model feature importances</h4>'
            + _htmlTable(["Feature", "Importance"], data.feature_importances.slice(0, 8).map(function (f) {
              return [f.feature, f.importance];
            }));
        }
      })
      .catch(function () {
        var box = document.getElementById("my-strategy-result");
        if (box) box.innerHTML = renderOfflineNotice("ML strategy prediction needs the live API");
      });
  }

  function renderOfflineNotice(what) {
    return "<p class='network-empty'>" + _escapeHtml(what) + " is computed server-side and is unavailable offline" +
      (typeof window !== "undefined" && window.location.protocol === "file:" ? " (this page was opened from file://)" : " (the API did not respond)") +
      ". The client-side tools (effectors, network, hubs, stage map, enrichment, PCA) still work without a server.</p>";
  }

  /* ------------------------------------------------ MODE A/B: PCA */
  function renderEffectorPca() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    if (state.mode !== "hostpathogen") return;

    var features = buildEffectorFeatures(state);
    if (!features || !features.rows.length) {
      el.innerHTML = "<em>Not enough data to compute effector features.</em>";
      return;
    }
    var matrix = features.rows.map(function (r) { return r.slice(); }); // keep numeric array
    var pca = Stats.pca(matrix, 2);
    if (!pca) { el.innerHTML = "<em>PCA failed — need at least 2 rows with 2 numeric features.</em>"; return; }

    var stratByPathogen = {};
    state.pathogens.forEach(function (p) { stratByPathogen[p.name] = p.strategy || "unknown"; });

    var colors = {};
    var samples = features.names.map(function (name, i) {
      var strat = stratByPathogen[name] || "unknown";
      if (!colors[strat]) colors[strat] = strat;
      return { name: name, x: pca.scores[i][0], y: pca.scores[i][1], strategy: strat };
    });

    el.innerHTML =
      '<h3 class="chart-heading">PCA of effector-repertoire features</h3>'
      + "<p class=\"text-muted\">Eleven features are derived from each pathogen’s effectors (counts, secretion systems, toxin types, resolved pathways), standardized, then reduced to PC1/PC2.</p>"
      + '<div class="chart-container chart-container-md mb-12"><canvas id="my-eff-pca-chart"></canvas></div>'
      + '<div id="my-eff-pca-table"></div>';
    renderEffectorPcaChart(pca, samples);
    var tbl = document.getElementById("my-eff-pca-table");
    if (tbl) tbl.innerHTML = _htmlTable(["Pathogen", "Strategy", "PC1", "PC2", "Explained variance (PC1/PC2)"], samples.map(function (s, i) {
      return [s.name, s.strategy, s.x.toFixed(3), s.y.toFixed(3), (pca.explained[0] * 100).toFixed(0) + "% / " + (pca.explained[1] * 100).toFixed(0) + "%"];
    }));
  }

  function renderEffectorPcaChart(pca, samples) {
    var canvas = document.getElementById("my-eff-pca-chart");
    if (!canvas || typeof Chart === "undefined") return;
    _destroyChart(canvas);
    var groups = {};
    samples.forEach(function (s) { groups[s.strategy] = groups[s.strategy] || []; groups[s.strategy].push(s); });
    var datasets = Object.keys(groups).map(function (strategy) {
      return {
        label: STRATEGY_LABELS[strategy] || strategy,
        data: groups[strategy].map(function (s) { return { x: s.x, y: s.y, name: s.name, strategy: strategy }; }),
        backgroundColor: (STRATEGY_COLORS[strategy] || "#6366f1") + "CC",
        borderColor: STRATEGY_COLORS[strategy] || "#6366f1",
        pointRadius: 5, pointHoverRadius: 7
      };
    });
    new Chart(canvas, {
      type: "scatter",
      data: { datasets: datasets },
      options: _scatterOptions(
        "PC1 (" + (pca.explained[0] * 100).toFixed(0) + "% variance) × PC2 (" + (pca.explained[1] * 100).toFixed(0) + "%)",
        "PC1", "PC2")
    });
  }

  function buildEffectorFeatures(state) {
    var eff = state.effectors || [];
    var byPath = {};
    eff.forEach(function (e) { (byPath[e.pathogen_name] = byPath[e.pathogen_name] || []).push(e); });
    var hostMap = {};
    (TOOLKIT_DATA.host_proteins || []).forEach(function (h) { hostMap[h.name] = h; });

    var names = Object.keys(byPath).sort();
    var rows = names.map(function (p) {
      var list = byPath[p];
      var types = list.map(function (e) { return (e.type || "").toLowerCase(); });
      var targets = {};
      list.forEach(function (e) { CSVUtils.splitTargets(e.host_target).forEach(function (t) { targets[t] = true; }); });
      var tNames = Object.keys(targets);
      var pathways = {}, localizations = {};
      tNames.forEach(function (t) {
        var h = hostMap[t];
        if (h) { if (h.pathway) pathways[h.pathway] = true; if (h.localization) localizations[h.localization] = true; }
      });
      var row = {
        n_effectors: list.length,
        n_targets: tNames.length,
        n_t3ss: types.filter(function (t) { return t.indexOf("t3ss") !== -1; }).length,
        n_t4ss: types.filter(function (t) { return t.indexOf("t4ss") !== -1; }).length,
        n_t6ss: types.filter(function (t) { return t.indexOf("t6ss") !== -1; }).length,
        n_toxins: types.filter(function (t) { return /toxin|ab toxin|pore-forming|cholesterol-dependent/.test(t); }).length,
        n_surface: types.filter(function (t) { return /surface protein|outer membrane|porin/.test(t); }).length,
        n_invasins: types.filter(function (t) { return /invasin|adhesin|autotransporter/.test(t); }).length,
        n_pathways: Object.keys(pathways).length,
        n_localizations: Object.keys(localizations).length
      };
      return row;
    });

    var featureNames = ["n_effectors", "n_targets", "n_t3ss", "n_t4ss", "n_t6ss", "n_toxins", "n_surface", "n_invasins", "n_pathways", "n_localizations"];
    var numeric = featureNames.map(function (f) {
      var vals = rows.map(function (r) { return r[f]; });
      if (vals.length > 1 && Stats.std(vals, 0) > 0) return f; else return null;
    }).filter(function (f) { return f; });
    if (numeric.length < 2) return null;

    return {
      names: names,
      columns: numeric,
      rows: rows.map(function (r) { return numeric.map(function (f) { return r[f]; }); })
    };
  }

  /* ----------------------------------------------- MODE B: numeric */
  function numericColumns(state) {
    var sample = state.rows.slice(0, 50);
    var cols = [];
    for (var c = 0; c < state.columns.length; c++) {
      var num = 0, total = 0;
      for (var r = 0; r < sample.length; r++) {
        if (state.rows[r][c] === "") continue;
        total++;
        if (!isNaN(parseFloat(state.rows[r][c]))) num++;
      }
      if (total >= 2 && num / total >= 0.8) cols.push(c);
    }
    return cols.map(function (i) { return state.columns[i]; });
  }

  function categoricalColumns(state) {
    var num = {};
    numericColumns(state).forEach(function (c) { num[c] = true; });
    return state.columns.filter(function (c) { return !num[c]; });
  }

  function rowNumeric(state, r, cols) {
    return cols.map(function (c) { return parseFloat(state.rows[r][c]) || 0; });
  }

  function missingCells(state) {
    var n = 0;
    for (var r = 0; r < state.rows.length; r++) {
      for (var c = 0; c < state.columns.length; c++) if (state.rows[r][c] === "") n++;
    }
    return n;
  }

  function renderNumericTab(id) {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    if (!el) return;
    if (id === "overview") return renderMyOverview();
    if (id === "stats") return renderNumericStats();
    if (id === "corr") return renderNumericCorrelation();
    if (id === "pca") return renderNumericPca();
    if (id === "clusters") return renderNumericClusters();
    if (id === "regression") return renderNumericRegression();
    if (id === "histograms") return renderNumericHistograms();
    renderMyOverview();
  }

  function renderNumericStats() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    var cols = numericColumns(state);
    var forDisplay = cols.length ? cols : state.columns;
    var rows = forDisplay.map(function (c) {
      var values = state.rows.map(function (r) { return Stats.toNum(r[state.columns.indexOf(c)]); });
      var d = Stats.describe(values);
      return [c, d.count, d.missing, fmt(d.mean), fmt(d.median), fmt(d.std), fmt(d.min), fmt(d.max)];
    });
    el.innerHTML =
      '<h3 class="chart-heading">Descriptive statistics</h3>'
      + _htmlTable(["Column", "n", "Missing", "Mean", "Median", "Std", "Min", "Max"], rows)
      + '<button class="tool-btn tool-btn-sm mt-12" onclick="downloadMyStats()">Download stats CSV</button>';
  }

  function fmt(v) { return v === null || v === undefined || isNaN(v) ? "—" : Number(v).toFixed(3); }

  function downloadMyStats() {
    var state = MyData.state;
    if (!state || state.mode !== "numeric") return;
    var cols = numericColumns(state).length ? numericColumns(state) : state.columns;
    var header = ["Column", "n", "Missing", "Mean", "Median", "Std", "Min", "Max"];
    var rows = cols.map(function (c) {
      var d = Stats.describe(state.rows.map(function (r) { return Stats.toNum(r[state.columns.indexOf(c)]); }));
      return [c, d.count, d.missing, d.mean === null ? "" : fmt(d.mean), d.median === null ? "" : fmt(d.median), d.std === null ? "" : fmt(d.std), d.min === null ? "" : fmt(d.min), d.max === null ? "" : fmt(d.max)];
    });
    downloadMyCSV(header, rows, "my_data_stats.csv");
  }

  function renderNumericCorrelation() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    var cols = numericColumns(state);
    if (cols.length < 2) { el.innerHTML = "<em>Need at least two numeric columns.</em>"; return; }
    var rows = state.rows.map(function (r) { return rowNumeric(state, r, cols); });
    var cm = Stats.correlationMatrix(cols, rows);

    var html = '<h3 class="chart-heading">Correlation matrix (Pearson)</h3>';
    html += '<div class="corr-heatmap"><table><thead><tr><th></th>';
    cols.forEach(function (c) { html += "<th>" + _escapeHtml(c) + "</th>"; });
    html += "</tr></thead><tbody>";
    for (var i = 0; i < cols.length; i++) {
      html += "<tr><th>" + _escapeHtml(cols[i]) + "</th>";
      for (var j = 0; j < cols.length; j++) {
        var r = cm.matrix[i][j];
        html += "<td style='background:" + corrColor(r) + "'>" + (r === null ? "—" : r.toFixed(2)) + "</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    html += '<div class="corr-legend"><span style="background:#dc2626"></span> -1&nbsp;&nbsp;<span style="background:#f3f4f6"></span> 0&nbsp;&nbsp;<span style="background:#2563eb"></span> +1</div>';

    var strong = [];
    for (i = 0; i < cols.length; i++) {
      for (j = i + 1; j < cols.length; j++) {
        var rc = cm.matrix[i][j];
        if (rc !== null && Math.abs(rc) >= 0.7) strong.push([cols[i], cols[j], rc.toFixed(3)]);
      }
    }
    if (strong.length) {
      html += '<h4 class="mydata-subtitle">Strong correlations (|r| ≥ 0.7)</h4>'
        + _htmlTable(["Variable A", "Variable B", "r"], strong);
    }
    el.innerHTML = html;
  }

  function corrColor(r) {
    if (r === null || isNaN(r)) return "transparent";
    var a = Math.min(Math.abs(r), 1) * 0.85 + 0.1;
    if (r >= 0) return "rgba(37,99,235," + a.toFixed(2) + ")";
    return "rgba(220,38,38," + a.toFixed(2) + ")";
  }

  function renderNumericPca() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    var cols = numericColumns(state);
    if (cols.length < 2) { el.innerHTML = "<em>Need at least two numeric columns.</em>"; return; }
    var cats = categoricalColumns(state);

    var html = '<h3 class="chart-heading">Principal Component Analysis</h3>'
      + '<div class="mydata-tool-row">'
      + '<label class="tool-select-label" for="my-pca-group">Color by</label>'
      + '<select id="my-pca-group" class="tool-select" onchange="renderNumericPca()"><option value="">none</option>' + cats.map(function (c) {
        return '<option value="' + _escapeHtml(c) + '">' + _escapeHtml(c) + "</option>";
      }).join("") + "</select>"
      + '</div><div class="chart-container chart-container-md mb-12"><canvas id="my-num-pca-chart"></canvas></div>'
      + '<div id="my-num-pca-info"></div>';

    var sel = document.getElementById("my-pca-group");
    var groupCol = sel && cats.length ? sel.value : "";
    el.innerHTML = html;

    var matrix = state.rows.map(function (r) { return rowNumeric(state, r, cols); });
    var pca = Stats.pca(matrix, 2);
    var info = document.getElementById("my-num-pca-info");
    if (pca && info) {
      var evText = pca.explained.map(function (v, i) { return "PC" + (i + 1) + ": " + (v * 100).toFixed(1) + "%"; }).join(" · ");
      info.innerHTML = "<p class='chart-caption'>Explained variance — " + evText + ".</p>";
    }
    renderNumericPcaChart(state, matrix, pca, cols, groupCol);
  }

  function renderNumericPcaChart(state, matrix, pca, cols, groupCol) {
    var canvas = document.getElementById("my-num-pca-chart");
    if (!canvas || typeof Chart === "undefined" || !pca) return;
    _destroyChart(canvas);
    var symbols = [];
    pca.scores.forEach(function (pt, i) {
      symbols.push({ x: pt[0], y: pt[1], name: state.rows[i][0], strategy: groupCol ? (state.rows[i][state.columns.indexOf(groupCol)] || "") : "" });
    });
    var groups = {};
    symbols.forEach(function (s) { if (!groups[s.strategy]) groups[s.strategy] = []; groups[s.strategy].push(s); });
    var names = Object.keys(groups).sort();
    var datasets = names.map(function (g, i) {
      return {
        label: g || "samples",
        data: groups[g].map(function (s) { return { x: s.x, y: s.y, name: s.name, strategy: s.strategy }; }),
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + "CC",
        borderColor: CHART_COLORS[i % CHART_COLORS.length],
        pointRadius: 5, pointHoverRadius: 7
      };
    });
    new Chart(canvas, {
      type: "scatter",
      data: { datasets: datasets },
      options: _scatterOptions(
        "PCA of " + cols.length + " numeric columns",
        "PC1 (" + (pca.explained[0] * 100).toFixed(0) + "%)", "PC2 (" + (pca.explained[1] * 100).toFixed(0) + "%)")
    });
  }

  function renderNumericClusters() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    var cols = numericColumns(state);
    if (cols.length < 2) { el.innerHTML = "<em>Need at least two numeric columns.</em>"; return; }
    var maxK = Math.min(8, state.rows.length - 1);
    var k = Math.max(2, Math.min(maxK, 3));
    var opts = [];
    for (var i = 1; i <= maxK; i++) opts.push('<option value="' + i + '"' + (i === k ? " selected" : "") + ">k = " + i + "</option>");

    el.innerHTML =
      '<h3 class="chart-heading">k-means clustering</h3>'
      + '<div class="mydata-tool-row">'
      + '<label class="tool-select-label" for="my-k">Clusters</label>'
      + '<select id="my-k" class="tool-select" onchange="renderNumericClusters()">' + opts.join("") + '</select>'
      + "</div>"
      + '<div class="chart-container chart-container-md mb-12"><canvas id="my-cluster-chart"></canvas></div>'
      + '<div id="my-cluster-table"></div>';
    var knum = parseInt(document.getElementById("my-k").value, 10);
    if (isNaN(knum)) knum = k;

    var matrix = state.rows.map(function (r) { return rowNumeric(state, r, cols); });
    var km = Stats.kmeans(matrix, knum, 100);
    var pca = Stats.pca(matrix, 2);
    if (!km || !pca) { el.innerHTML = "<em>Clustering failed.</em>"; return; }

    var groups = {};
    km.assignments.forEach(function (cl, i) {
      var key = "cluster " + cl;
      (groups[key] = groups[key] || []).push({ x: pca.scores[i][0], y: pca.scores[i][1], name: state.rows[i][0] + (state.columns.includes("condition") ? " (" + state.rows[i][state.columns.indexOf("condition")] + ")" : "") });
    });
    var datasets = Object.keys(groups).map(function (g, i) {
      return {
        label: g,
        data: groups[g],
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + "CC",
        borderColor: CHART_COLORS[i % CHART_COLORS.length],
        pointRadius: 5
      };
    });
    var canvas = document.getElementById("my-cluster-chart");
    _destroyChart(canvas);
    new Chart(canvas, { type: "scatter", data: { datasets: datasets }, options: _scatterOptions("Clusters projected on PC1/PC2", "PC1", "PC2") });

    var summary = {};
    state.rows.forEach(function (r, i) { var c = km.assignments[i]; (summary[c] = summary[c] || []).push(r[0]); });
    var tbl = document.getElementById("my-cluster-table");
    if (tbl) tbl.innerHTML = _htmlTable(["Cluster", "Size", "Samples"], Object.keys(summary).sort().map(function (c) {
      return ["cluster " + c, summary[c].length, summary[c].join(", ")];
    }));
  }

  function renderNumericRegression() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    var cols = numericColumns(state);
    if (cols.length < 2) { el.innerHTML = "<em>Need at least two numeric columns.</em>"; return; }
    var yDefault = cols[cols.length - 1], xDefault = cols[0] === yDefault ? cols[1] : cols[0];
    var opts = cols.map(function (c) { return '<option value="' + _escapeHtml(c) + '">' + _escapeHtml(c) + "</option>"; });

    el.innerHTML =
      '<h3 class="chart-heading">Ordinary least squares regression</h3>'
      + '<div class="mydata-tool-row">'
      + '<label class="tool-select-label">Response (y)</label>'
      + '<select id="my-ols-y" class="tool-select" onchange="_myOlsCompute()">' + opts.join("") + '</select>'
      + '<label class="tool-select-label" style="margin-left:12px">Predictor (x)</label>'
      + '<select id="my-ols-x" class="tool-select" onchange="_myOlsCompute()">' + opts.join("") + '</select>'
      + "</div>"
      + '<div class="chart-container chart-container-md mb-12"><canvas id="my-ols-chart"></canvas></div>'
      + '<div id="my-ols-summary"></div>';
    var selY = document.getElementById("my-ols-y"), selX = document.getElementById("my-ols-x");
    if (selY) selY.value = yDefault;
    if (selX) selX.value = xDefault;
    _myOlsCompute();
  }

  function _myOlsCompute() {
    var state = MyData.state;
    if (!state) return;
    var selY = document.getElementById("my-ols-y"), selX = document.getElementById("my-ols-x");
    if (!selY || !selX) return;
    var yCol = selY.value, xCol = selX.value;
    if (xCol === yCol) { var summary = document.getElementById("my-ols-summary"); if (summary) summary.innerHTML = "<em>Pick different columns.</em>"; return; }
    var yi = state.columns.indexOf(yCol), xi = state.columns.indexOf(xCol);
    var y = [], x = [];
    state.rows.forEach(function (r) {
      var yv = Stats.toNum(r[yi]), xv = Stats.toNum(r[xi]);
      if (!isNaN(yv) && !isNaN(xv)) { y.push(yv); x.push(xv); }
    });
    if (y.length < 3) return;
    var ols = Stats.ols(y, [x]);
    var summary = document.getElementById("my-ols-summary");
    if (summary) {
      if (!ols) { summary.innerHTML = "<em>Regression failed under the normal equations.</em>"; return; }
      summary.innerHTML = _htmlTable(["Model", "Equation", "R²", "Intercept", "Slope"], [
        [yCol + " ~ " + xCol, yCol + " = " + fmt(ols.coefficients.x1) + "·" + xCol + " + " + fmt(ols.intercept), fmt(ols.r2), fmt(ols.intercept), fmt(ols.coefficients.x1)]
      ]);
    }
    var canvas = document.getElementById("my-ols-chart");
    _destroyChart(canvas);
    var pts = x.map(function (xv, i) { return { x: xv, y: y[i], name: state.rows[i][0] }; });
    var lineX = [Math.min.apply(Math, x), Math.max.apply(Math, x)];
    var lineY = lineX.map(function (xv) { return ols.intercept + ols.coefficients.x1 * xv; });
    new Chart(canvas, {
      data: {
        datasets: [
          { label: "data", data: pts, backgroundColor: "#3b82f6CC", borderColor: "#3b82f6", pointRadius: 5, type: "scatter" },
          { label: "fit", data: [{ x: lineX[0], y: lineY[0] }, { x: lineX[1], y: lineY[1] }], borderColor: "#dc2626", borderWidth: 2, type: "line", fill: false, pointRadius: 0 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { tooltip: { callbacks: { label: function (ctx) { return ctx.dataset.label === "data" ? " " + (ctx.raw.name || "") : ""; } } } },
        scales: {
          x: { type: "linear", title: { display: true, text: xCol } },
          y: { title: { display: true, text: yCol } }
        }
      }
    });
  }

  function renderNumericHistograms() {
    var state = MyData.state;
    var el = document.getElementById("mydata-content");
    var cols = numericColumns(state);
    if (!cols.length) { el.innerHTML = "<em>No numeric columns.</em>"; return; }
    el.innerHTML =
      '<h3 class="chart-heading">Histograms</h3>'
      + '<div class="mydata-tool-row">'
      + '<label class="tool-select-label" for="my-hist-col">Column</label>'
      + '<select id="my-hist-col" class="tool-select" onchange="renderNumericHistograms()">' + cols.map(function (c) {
        return '<option value="' + _escapeHtml(c) + '">' + _escapeHtml(c) + "</option>";
      }).join("") + '</select></div>'
      + '<div class="chart-container chart-container-md"><canvas id="my-hist-chart"></canvas></div>';
    var col = document.getElementById("my-hist-col").value;
    var idx = state.columns.indexOf(col);
    var values = state.rows.map(function (r) { return Stats.toNum(r[idx]); }).filter(function (v) { return !isNaN(v); });
    if (values.length < 2) { el.innerHTML = "<em>Not enough numeric values.</em>"; return; }
    var bins = Math.max(5, Math.min(20, Math.round(Math.sqrt(values.length)) || 5));
    var lo = Math.min.apply(Math, values), hi = Math.max.apply(Math, values);
    var width = (hi - lo) || 1;
    var counts = new Array(bins).fill(0);
    values.forEach(function (v) {
      var b = Math.min(bins - 1, Math.floor((v - lo) / width * bins));
      counts[b]++;
    });
    var labels = counts.map(function (_, b) {
      return fmt(lo + width * b / bins) + "–" + fmt(lo + width * (b + 1) / bins);
    });
    var canvas = document.getElementById("my-hist-chart");
    _destroyChart(canvas);
    new Chart(canvas, {
      type: "bar",
      data: { labels: labels, datasets: [{ data: counts, backgroundColor: "#6366f1CC", borderColor: "#6366f1", borderWidth: 1 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 45, font: { size: 10 } } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }

  /* ----------------------------------------------------------- downloads */
  function downloadMyCSV(header, rows, filename) {
    var blob = new Blob([CSVUtils.textFromRows(header, rows, ",")], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 100);
  }

  function downloadMyDataResults() {
    var state = MyData.state;
    if (!state) return;
    if (state.mode === "numeric") {
      downloadMyCSV(state.columns, state.rows, "my_data.csv");
    } else {
      var headers = ["pathogen", "effector", "type", "host_target", "mechanism"];
      var rows = state.effectors.map(function (e) { return [e.pathogen_name, e.effector_name, e.type, e.host_target, e.mechanism]; });
      downloadMyCSV(headers, rows, "my_data_effectors.csv");
    }
  }

function downloadTemplate(kind) {
    var text = kind === "numeric" ? CSVUtils.templateNumeric()
      : kind === "profiles" ? CSVUtils.templateProfiles()
      : CSVUtils.templateHostPathogen();
    var blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = kind === "numeric" ? "numeric_template.csv"
      : kind === "profiles" ? "pathogen_profiles_template.csv"
      : "hostpathogen_template.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /* ------------------------------------------------------------- wiring */
  window.setMyTab = setMyTab;
  window.loadDataPreset = loadDataPreset;
  window.onMyImportMethod = onMyImportMethod;
  window.importFromActiveMethod = importFromActiveMethod;
  window.clearMyData = clearMyData;
  window.downloadTemplate = downloadTemplate;
  window.filterMyEffectors = filterMyEffectors;
  window.loadMyNetwork = loadMyNetwork;
  window.downloadMyHubs = downloadMyHubs;
  window.downloadMyStats = downloadMyStats;
  window.downloadMyDataResults = downloadMyDataResults;
  window._myOlsCompute = _myOlsCompute;
  window.buildMyEffectorFeatures = buildEffectorFeatures;
  window.renderNumericPca = renderNumericPca;
  window.renderNumericHistograms = renderNumericHistograms;
  window.renderNumericClusters = renderNumericClusters;

  /* Hook into the existing init chain (runs last, after network.js). */
  var _origInitToolkit_md = window.initToolkit;
  window.initToolkit = function () {
    if (_origInitToolkit_md) _origInitToolkit_md();
    initMyData();
  };
})();