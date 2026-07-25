/* ---------------------------------------------------------------------------
   Dark Mode
   --------------------------------------------------------------------------- */
function toggleDarkMode() {
  var isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
    document.getElementById("dark-toggle").innerHTML = "&#9790;";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.getElementById("dark-toggle").innerHTML = "&#9728;";
  }
}

(function initTheme() {
  var saved = localStorage.getItem("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    setTimeout(function() {
      var btn = document.getElementById("dark-toggle");
      if (btn) btn.innerHTML = "&#9728;";
    }, 0);
  }
})();

/* ---------------------------------------------------------------------------
   Mobile Navigation
   --------------------------------------------------------------------------- */
function toggleMobileNav() {
  var links = document.getElementById("nav-links");
  var burger = document.getElementById("hamburger");
  var overlay = document.getElementById("mobile-overlay");
  links.classList.toggle("open");
  burger.classList.toggle("open");
  overlay.classList.toggle("open");
}

function closeMobileNav() {
  var links = document.getElementById("nav-links");
  var burger = document.getElementById("hamburger");
  var overlay = document.getElementById("mobile-overlay");
  links.classList.remove("open");
  burger.classList.remove("open");
  overlay.classList.remove("open");
}

/* ---------------------------------------------------------------------------
   URL Deep-linking — ?pathogen=Name
   --------------------------------------------------------------------------- */
function handleDeepLink() {
  var params = new URLSearchParams(window.location.search);
  var name = params.get("pathogen");
  if (!name) return;
  var cards = document.querySelectorAll(".pathogen-card-sm");
  for (var i = 0; i < cards.length; i++) {
    var nameEl = cards[i].querySelector(".pathogen-name");
    if (nameEl && nameEl.textContent.trim().toLowerCase() === name.toLowerCase()) {
      var cardId = cards[i].id;
      setTimeout(function() {
        toggleAPCard(cardId, name);
        cards[i].scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
      break;
    }
  }
}

/* ---------------------------------------------------------------------------
   Card toggling (featured pathogens)
   --------------------------------------------------------------------------- */
function toggleCard(cardId) {
  var card = document.getElementById(cardId);
  if (!card) return;
  card.classList.toggle('expanded');
}

var timelineData = [
  {
    name: "Pre-Phagocytosis",
    markers: [
      { label: "Rab5 — cytosolic", type: "" },
      { label: "Rab7 — cytosolic", type: "" },
      { label: "LAMP1 — lysosomal", type: "" },
      { label: "Actin — cortical", type: "present" }
    ],
    changes: [
      "Receptor recognition (Fc-γR, CR3, mannose receptor) initiates signaling",
      "PI3K activation generates PI(4,5)P2 at the phagocytic cup",
      "Rac1 and Cdc42 trigger actin nucleation via Arp2/3 and formins",
      "Local membrane curvature driven by BAR-domain proteins"
    ],
    pathogens: [
      "Shigella (T3SS IpaB/C): begins translocon insertion before full internalization",
      "Listeria (InlA/InlB): triggers PI3K→Rac1 via Met receptor signaling",
      "Salmonella (SopE, SipA): activates Rac1/Cdc42 for actin ruffle formation"
    ]
  },
  {
    name: "Phagosome Formation",
    markers: [
      { label: "Rab5 — being recruited", type: "present" },
      { label: "LAMP1 — absent", type: "absent" },
      { label: "PI(3)P — being generated", type: "present" },
      { label: "EEA1 — absent", type: "absent" }
    ],
    changes: [
      "Pseudopod zippering seals around particle; plasma membrane pinches off",
      "PI(4,5)P2 converted to PI(3)P by class III PI3K (VPS34)",
      "Rab5 anchors to nascent phagosomal membrane",
      "Actin coat begins depolymerizing from sealed vacuole"
    ],
    pathogens: [
      "Listeria: LLO begins inserting into the forming phagosomal membrane",
      "Shigella: IpaB pore formation begins; may escape before full sealing",
      "Legionella: Dot/Icm T4SS begins effector translocation immediately upon entry"
    ]
  },
  {
    name: "Early Phagosome",
    markers: [
      { label: "Rab5 ✓", type: "present" },
      { label: "EEA1 ✓", type: "present" },
      { label: "Rab7 — absent", type: "absent" },
      { label: "LAMP1 — absent", type: "absent" }
    ],
    changes: [
      "pH ~6.5 — mildly acidic, V-ATPase partly active",
      "Early endosome fusion delivers transferrin receptor, recycling cargo",
      "PI(3)P enrichment recruits FYVE-domain effectors (EEA1, Rabenosyn-5)",
      "Rab5 effector complex (hVPS34/p150) maintains PI(3)P and compartment identity"
    ],
    pathogens: [
      "M. tuberculosis: SapM dephosphorylates PI(3)P; blocks Rab5→Rab7 switch",
      "Salmonella SPI-1: early SCV acquires Rab5 transiently; SPI-2 effectors then redirect",
      "Legionella: LCV rapidly acquires ER markers instead of early endosomal markers via DrrA/SidM"
    ]
  },
  {
    name: "Late Phagosome",
    markers: [
      { label: "Rab7 ✓", type: "present" },
      { label: "LAMP1 ✓", type: "present" },
      { label: "Rab5 — absent/decreasing", type: "absent" },
      { label: "V-ATPase ✓", type: "present" }
    ],
    changes: [
      "pH ~5.5 — significant acidification via V-ATPase",
      "Rab5→Rab7 switch mediated by Mon1–CCZ1 GEF complex",
      "LAMP1 acquisition via late endosome fusion",
      "Cathepsin D, cathepsin B begin import but remain largely inactive",
      "RILP recruits dynein; vacuole moves toward perinuclear lysosomes"
    ],
    pathogens: [
      "Salmonella: SifA/SKIP decouples LAMP1 acquisition from functional maturation",
      "Salmonella: SseJ deacylates membrane cholesterol to maintain SCV identity",
      "M. tuberculosis: tlyA and other lipids prevent full V-ATPase recruitment; pH stays ~6.4"
    ]
  },
  {
    name: "Phagolysosome",
    markers: [
      { label: "LAMP1 ✓✓", type: "present" },
      { label: "Cathepsins ✓", type: "present" },
      { label: "Rab7 — decreasing", type: "" },
      { label: "pH ~4.5", type: "present" }
    ],
    changes: [
      "pH ~4.5 — fully acidified; optimal for hydrolase activity",
      "Cathepsin B, D, L, S cleave proteins; lipases degrade bacterial membranes",
      "Reactive Oxygen Species (ROS) generated by NADPH oxidase",
      "Reactive Nitrogen Species (RNS) via iNOS contribute to killing",
      "Bactericidal peptides (defensins, lactoferricin) concentrated in lumen"
    ],
    pathogens: [
      "Most pathogens that reach this stage are killed — this is the canonical endpoint",
      "Coxiella burnetii (not profiled): uniquely thrives IN the phagolysosome at pH 4.5",
      "Pathogens like Mtb, Salmonella, Legionella act upstream to never reach this stage"
    ]
  }
];

var activeStage = null;

function activateStage(index) {
  var stages = document.querySelectorAll('.timeline-stage');
  var detail = document.getElementById('timeline-detail');

  if (activeStage === index) {
    stages[index].classList.remove('active');
    detail.classList.remove('visible');
    activeStage = null;
    return;
  }

  if (activeStage !== null) {
    stages[activeStage].classList.remove('active');
  }

  stages[index].classList.add('active');
  activeStage = index;

  var data = timelineData[index];

  document.getElementById('detail-stage-name').textContent = data.name;

  var markersEl = document.getElementById('detail-markers');
  markersEl.innerHTML = '';
  var map = _getProteinPathogens();
  data.markers.forEach(function(m) {
    var tag = document.createElement('span');
    tag.className = 'marker-tag' + (m.type ? ' ' + m.type : '');
    tag.textContent = m.label;
    // Check if this label matches a known host protein
    var label = m.label;
    var matched = false;
    var keys = Object.keys(map);
    for (var k = 0; k < keys.length; k++) {
      if (label.indexOf(keys[k]) !== -1) {
        tag.style.cursor = "pointer";
        tag.title = "Click to see which pathogens target " + keys[k];
        (function(prot) {
          tag.addEventListener("click", function(e) {
            e.stopPropagation();
            _showMarkerPathogens(prot, tag);
          });
        })(keys[k]);
        matched = true;
        break;
      }
    }
    markersEl.appendChild(tag);
  });

  var changesEl = document.getElementById('detail-changes');
  changesEl.innerHTML = '';
  data.changes.forEach(function(c) {
    var li = document.createElement('li');
    li.textContent = c;
    changesEl.appendChild(li);
  });

  var pathEl = document.getElementById('detail-pathogens');
  pathEl.innerHTML = '';
  data.pathogens.forEach(function(p) {
    var li = document.createElement('li');
    li.textContent = p;
    pathEl.appendChild(li);
  });

  detail.classList.add('visible');

  setTimeout(function() {
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

function closeTimeline() {
  var stages = document.querySelectorAll('.timeline-stage');
  var detail = document.getElementById('timeline-detail');

  if (activeStage !== null) {
    stages[activeStage].classList.remove('active');
    activeStage = null;
  }
  detail.classList.remove('visible');
  var info = document.getElementById("marker-pathogen-info");
  if (info) info.style.display = "none";
}

// Build host protein → pathogens lookup from effectors data
var _proteinPathogens = null;
function _getProteinPathogens() {
  if (_proteinPathogens) return _proteinPathogens;
  _proteinPathogens = {};
  var effs = TOOLKIT_DATA.effectors || [];
  effs.forEach(function(e) {
    var targets = [e.host_target];
    // Some effectors list multiple targets separated by " / " or "and"
    if (e.host_target) {
      targets = e.host_target.split(/ \/ | and /);
    }
    targets.forEach(function(t) {
      var key = t.trim();
      if (!key) return;
      if (!_proteinPathogens[key]) _proteinPathogens[key] = [];
      if (_proteinPathogens[key].indexOf(e.pathogen_name) === -1) {
        _proteinPathogens[key].push(e.pathogen_name);
      }
    });
  });
  return _proteinPathogens;
}

function _showMarkerPathogens(proteinName, el) {
  var map = _getProteinPathogens();
  var info = document.getElementById("marker-pathogen-info");
  if (!info) return;

  // Try exact match first, then partial
  var pathogens = map[proteinName];
  if (!pathogens || !pathogens.length) {
    // Try partial match: find a key contained in proteinName
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      if (proteinName.indexOf(keys[i]) !== -1) {
        pathogens = map[keys[i]];
        break;
      }
    }
  }
  if (!pathogens || !pathogens.length) {
    info.style.display = "none";
    return;
  }

  el.classList.add("clicked");
  info.innerHTML = "<div class='marker-pathogen-header'><strong>Pathogens targeting this marker:</strong> <span class='marker-pathogen-close' onclick='_hideMarkerPathogens()'>&times;</span></div>"
    + "<ul>" + pathogens.map(function(p) { return "<li>" + p + "</li>"; }).join("") + "</ul>";
  info.style.display = "block";
}

function _hideMarkerPathogens() {
  var info = document.getElementById("marker-pathogen-info");
  if (info) info.style.display = "none";
  var tags = document.querySelectorAll(".marker-tag.clicked");
  tags.forEach(function(t) { t.classList.remove("clicked"); });
}

/* ---------------------------------------------------------------------------
   Toolkit — fully offline with embedded data; API is optional enhancement
   --------------------------------------------------------------------------- */

function _buildMarkerProfiles() {
  var profiles = {};
  TOOLKIT_DATA.stage_markers.forEach(function(sm) {
    if (!profiles[sm.stage_name]) profiles[sm.stage_name] = {};
    profiles[sm.stage_name][sm.host_protein_name] = sm.presence;
  });
  return profiles;
}

var _STAGE_PROFILES = null;
function _getStageProfiles() {
  if (!_STAGE_PROFILES) _STAGE_PROFILES = _buildMarkerProfiles();
  return _STAGE_PROFILES;
}

function initToolkit() {
  var pSel = document.getElementById("pathogen-select");
  var mSel = document.getElementById("ml-pathogen-select");
  if (!pSel && !mSel) return;

  var pathogenList = TOOLKIT_DATA.pathogens || [];
  var opts = pathogenList.map(function(p) {
    return '<option value="' + p.name + '">' + p.name + ' (' + p.strategy + ')</option>';
  }).join("");
  if (pSel) pSel.insertAdjacentHTML("beforeend", opts);
  if (mSel && mSel !== pSel) mSel.insertAdjacentHTML("beforeend", opts);

  var checklist = document.getElementById("marker-checklist");
  if (checklist) {
    checklist.innerHTML = TOOLKIT_DATA.stage_marker_names.map(function(m) {
      return '<label><input type="checkbox" value="' + m + '"> ' + m + '</label>';
    }).join("");
  }
}

function showError(elId, msg) {
  var el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = '<div class="error">' + msg + '</div>';
}

var _currentEffectors = [];

function _renderEffectorTable(rows, el) {
  if (!rows.length) { el.innerHTML = "<em>No effectors match the filter.</em>"; return; }
  var html = "<table><thead><tr><th>Effector</th><th>Type</th><th>Host Target</th><th>Mechanism</th></tr></thead><tbody>";
  rows.forEach(function(e) {
    html += "<tr><td>" + e.effector_name + "</td><td>" + (e.type || "—") + "</td><td>" + (e.host_target || "—") + "</td><td>" + (e.mechanism || "—") + "</td></tr>";
  });
  html += "</tbody></table>";
  el.innerHTML = html;
}

function loadPathogenEffectors() {
  var sel = document.getElementById("pathogen-select");
  var name = sel ? sel.value : "";
  if (!name) { showError("pathogen-result", "Select a pathogen first."); return; }

  _currentEffectors = TOOLKIT_DATA.effectors.filter(function(e) {
    return e.pathogen_name === name;
  });

  var el = document.getElementById("pathogen-result");
  if (!el) return;
  if (!_currentEffectors.length) { el.innerHTML = "<em>No effectors found for " + name + ".</em>"; return; }

  var searchEl = document.getElementById("effector-search");
  if (searchEl) { searchEl.value = ""; searchEl.style.display = "block"; searchEl.placeholder = "Filter " + _currentEffectors.length + " effectors…"; }
  var dlBtn = document.getElementById("dl-effectors-btn");
  if (dlBtn) dlBtn.style.display = "inline-block";

  _renderEffectorTable(_currentEffectors, el);
}

function filterEffectors() {
  var searchEl = document.getElementById("effector-search");
  var q = searchEl ? searchEl.value.toLowerCase() : "";
  var filtered = _currentEffectors.filter(function(e) {
    return e.effector_name.toLowerCase().indexOf(q) !== -1
        || (e.type || "").toLowerCase().indexOf(q) !== -1
        || (e.host_target || "").toLowerCase().indexOf(q) !== -1
        || (e.mechanism || "").toLowerCase().indexOf(q) !== -1;
  });
  var el = document.getElementById("pathogen-result");
  if (el) _renderEffectorTable(filtered, el);
}

function _stageResultFallback(observed, el) {
  var profiles = _getStageProfiles();
  var best = null, bestScore = -1;

  Object.keys(profiles).forEach(function(stage) {
    var profile = profiles[stage];
    var match = 0, total = 0;
    Object.keys(profile).forEach(function(marker) {
      if (observed[marker] !== undefined) {
        total++;
        if (observed[marker] === profile[marker]) match++;
      }
    });
    if (total > 0) {
      var score = match / total;
      if (score > bestScore) { bestScore = score; best = stage; }
    }
  });

  if (!best) {
    el.innerHTML = "<em>No matching stage. Try selecting different markers.</em>";
    return;
  }
  el.innerHTML = "<strong>Predicted stage:</strong> "
    + '<span class="badge badge-blue">' + best + "</span>"
    + " &nbsp;(confidence: " + (bestScore * 100).toFixed(0) + "%)";
}

function predictStage() {
  var checked = document.querySelectorAll("#marker-checklist input:checked");
  var markers = Array.from(checked).map(function(cb) { return cb.value; });

  if (!markers.length) { showError("stage-result", "Select at least one marker."); return; }

  var el = document.getElementById("stage-result");
  if (!el) return;
  el.innerHTML = "<em>Predicting…</em>";

  fetch("/api/trafficking/predict-stage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markers: markers })
  })
  .then(function(r) { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
  .then(function(info) {
    var present = (info.markers_present || []).join(", ");
    el.innerHTML = "<strong>Predicted stage:</strong> "
      + '<span class="badge badge-blue">' + info.name + "</span>"
      + "<br><small>pH " + info.ph_min + "–" + info.ph_max
      + " · " + info.time_range
      + " · Markers: " + present + "</small>";
  })
  .catch(function() {
    var observed = {};
    markers.forEach(function(m) { observed[m] = 1; });
    _stageResultFallback(observed, el);
  });
}

function _renderHubTable(data, el) {
  if (!data || !data.length) {
    el.innerHTML = "<em>No hub data available.</em>";
    return;
  }
  var html = "<table><thead><tr><th>#</th><th>Host Protein</th><th>Degree</th><th>Centrality</th></tr></thead><tbody>";
  data.forEach(function (h, i) {
    html += "<tr><td>" + (i + 1) + "</td><td>" + h.host + "</td><td>" + h.degree + "</td><td>" + h.centrality.toFixed(4) + "</td></tr>";
  });
  html += "</tbody></table>";
  el.innerHTML = html;
  var dlBtn = document.getElementById("dl-hubs-btn");
  if (dlBtn) dlBtn.style.display = "inline-block";
}

function loadHubProteins() {
  var el = document.getElementById("hub-result");
  if (!el) return;
  el.innerHTML = "<em>Loading…</em>";

  fetch("/api/interactome/hubs?top_n=10")
    .then(function (r) {
      if (!r.ok) throw new Error("Hub API unavailable");
      return r.json();
    })
    .then(function (data) {
      // Persist live data so download uses fresh values
      TOOLKIT_DATA.hubs = data;
      _renderHubTable(data, el);
    })
    .catch(function () {
      _renderHubTable(TOOLKIT_DATA.hubs, el);
    });
}

function predictStrategy() {
  var sel = document.getElementById("ml-pathogen-select");
  var name = sel ? sel.value : "";
  if (!name) { showError("ml-result", "Select a pathogen first."); return; }

  var el = document.getElementById("ml-result");
  if (!el) return;
  el.innerHTML = "<em>Predicting…</em>";

  fetch("/api/ml/predict/" + encodeURIComponent(name))
    .then(function (r) {
      if (!r.ok) throw new Error("ML API unavailable");
      return r.json();
    })
    .then(function (data) {
      var predicted = data.predicted_strategy;
      var actual = data.actual_strategy;
      var ok = predicted === actual ? "green" : "red";
      var pct = data.confidence ? (data.confidence * 100).toFixed(0) + "%" : "N/A";
      el.innerHTML = "<strong>Predicted:</strong> <span class='badge badge-" + ok + "'>" + predicted + "</span>"
        + " &nbsp;| <strong>Actual:</strong> <span class='badge badge-blue'>" + actual + "</span>"
        + " &nbsp;(confidence: " + pct + ")";
    })
    .catch(function () {
      // Fall back to static data
      var match = null;
      for (var i = 0; i < TOOLKIT_DATA.ml_predictions.length; i++) {
        if (TOOLKIT_DATA.ml_predictions[i].pathogen === name) {
          match = TOOLKIT_DATA.ml_predictions[i];
          break;
        }
      }
      if (!match) { el.innerHTML = "<em>No prediction available for " + name + ".</em>"; return; }
      var predicted = match.predicted;
      var actual = match.actual;
      var ok = predicted === actual ? "green" : "red";
      el.innerHTML = "<strong>Predicted:</strong> <span class='badge badge-" + ok + "'>" + predicted + "</span>"
        + " &nbsp;| <strong>Actual:</strong> <span class='badge badge-blue'>" + actual + "</span>"
        + " &nbsp;(confidence: " + (match.confidence * 100).toFixed(0) + "%)";
    });
}

function _downloadCSV(rows, columns, filename) {
  var header = columns.map(function(c) { return '"' + c.label + '"'; }).join(",");
  var data = rows.map(function(r) {
    return columns.map(function(c) { var v = r[c.key]; return '"' + (v || "").replace(/"/g, '""') + '"'; }).join(",");
  }).join("\n");
  var blob = new Blob([header + "\n" + data], { type: "text/csv;charset=utf-8;" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function downloadEffectorsCSV() {
  if (!_currentEffectors.length) return;
  _downloadCSV(_currentEffectors, [
    { key: "effector_name", label: "Effector" },
    { key: "type", label: "Type" },
    { key: "host_target", label: "Host Target" },
    { key: "mechanism", label: "Mechanism" }
  ], "effectors.csv");
}

function downloadHubsCSV() {
  var data = TOOLKIT_DATA.hubs;
  if (!data.length) return;
  _downloadCSV(data, [
    { key: "host", label: "Host Protein" },
    { key: "degree", label: "Degree" },
    { key: "centrality", label: "Centrality" }
  ], "hub_proteins.csv");
}

/* ---------------------------------------------------------------------------
   All 54 Pathogens — dynamic grid
   --------------------------------------------------------------------------- */

var _allPathogensData = [];

function renderAllPathogens() {
  var container = document.getElementById("all-pathogens-container");
  if (!container) return;
  var list = TOOLKIT_DATA.pathogens || [];
  var effMap = {};
  (TOOLKIT_DATA.effectors || []).forEach(function(e) {
    effMap[e.pathogen_name] = (effMap[e.pathogen_name] || 0) + 1;
  });
  _allPathogensData = list.slice();
  _renderPathogenGrid(list, effMap, container);
  var cnt = document.getElementById("all-pathogen-count");
  if (cnt) cnt.textContent = list.length;
}

function _strategyBorder(strat) {
  if (strat === "escape") return "ap-border-escape";
  if (strat === "arrest") return "ap-border-arrest";
  if (strat === "reroute") return "ap-border-reroute";
  if (strat === "modified_compartment") return "ap-border-modified";
  return "ap-border-extracellular";
}

function _renderPathogenGrid(list, effMap, container) {
  var html = "";
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var nEff = effMap[p.name] || p.n_effectors || "?";
    var gramBadge = "badge-blue";
    if (p.gram_stain === "Gram-positive") gramBadge = "badge-amber";
    else if (p.gram_stain === "Acid-fast") gramBadge = "badge-acid";
    else if (p.gram_stain === "Gram-negative") gramBadge = "badge-purple";
    var stratBadge = "badge-gray";
    if (p.strategy === "escape") stratBadge = "badge-red";
    else if (p.strategy === "arrest") stratBadge = "badge-amber";
    else if (p.strategy === "reroute") stratBadge = "badge-green";
    else if (p.strategy === "modified_compartment") stratBadge = "badge-purple";
    var cardId = "ap-card-" + i;
    var borderCls = _strategyBorder(p.strategy);
    html += '<div class="pathogen-card pathogen-card-sm ' + borderCls + '" id="' + cardId + '">'
      + '<div class="pathogen-card-top" onclick="toggleAPCard(\'' + cardId + '\',\'' + p.name.replace(/'/g, "\\'") + '\')">'
      + '<div class="pathogen-meta">'
      + '<span class="badge ' + gramBadge + '">' + (p.gram_stain || "—") + '</span>'
      + '<span class="badge ' + stratBadge + '">' + (p.strategy || "—") + '</span>'
      + '<span class="badge badge-gray">' + nEff + ' effectors</span>'
      + '</div>'
      + '<div class="pathogen-name">' + p.name + '</div>'
      + '<div class="pathogen-class">' + (p.species || "") + '</div>'
      + '<div class="pathogen-desc">' + (p.description || "") + '</div>'
      + (p.reference ? '<div class="pathogen-ref">DOI: <a href="https://doi.org/' + p.reference + '" target="_blank" rel="noopener noreferrer">' + p.reference + '</a></div>' : '')
      + '</div>'
      + '<div class="pathogen-toggle" onclick="toggleAPCard(\'' + cardId + '\',\'' + p.name.replace(/'/g, "\\'") + '\')"><span>Read Article <span class="toggle-arrow">&#9654;</span></span></div>'
      + '<div class="pathogen-panel"><div class="panel-article" id="' + cardId + '-article"><em>Loading…</em></div></div>'
      + '</div>';
  }
  container.innerHTML = html;
}

function toggleAPCard(cardId, name) {
  var card = document.getElementById(cardId);
  if (!card) return;
  var wasExpanded = card.classList.contains("expanded");
  card.classList.toggle("expanded");
  if (!wasExpanded) {
    var articleDiv = document.getElementById(cardId + "-article");
    if (articleDiv && articleDiv.innerHTML.indexOf("Loading") !== -1) {
      var p = null;
      var allP = TOOLKIT_DATA.pathogens || [];
      for (var pi = 0; pi < allP.length; pi++) {
        if (allP[pi].name === name) { p = allP[pi]; break; }
      }
      var effs = (TOOLKIT_DATA.effectors || []).filter(function(e) { return e.pathogen_name === name; });
      var targets = {};
      effs.forEach(function(e) {
        if (e.host_target) {
          var parts = e.host_target.split(/ \/ | and /);
          parts.forEach(function(t) { var k = t.trim(); if (k) targets[k] = (targets[k] || 0) + 1; });
        }
      });
      var targetKeys = Object.keys(targets);
      var mlPred = null;
      var mlAll = TOOLKIT_DATA.ml_predictions || [];
      for (var mi = 0; mi < mlAll.length; mi++) {
        if (mlAll[mi].pathogen === name) { mlPred = mlAll[mi]; break; }
      }

      var html = '<div class="panel-title">' + name + ' — Pathogen Article</div>';

      // Description section
      html += '<div class="article-section"><h4>Overview</h4><p>' + (p ? p.description : "") + '</p></div>';

      // Classification
      html += '<div class="article-section"><h4>Classification</h4><p><strong>Gram stain:</strong> ' + (p ? p.gram_stain : "—")
        + ' &nbsp;|&nbsp; <strong>Strategy:</strong> ' + (p ? p.strategy : "—")
        + ' &nbsp;|&nbsp; <strong>Effectors:</strong> ' + effs.length
        + (p && p.reference ? ' &nbsp;|&nbsp; <strong>DOI:</strong> <a href="https://doi.org/' + p.reference + '" target="_blank" rel="noopener noreferrer">' + p.reference + '</a>' : '')
        + '</p></div>';

      // Host targets
      if (targetKeys.length) {
        html += '<div class="article-section"><h4>Host Targets <span class="badge badge-gray">' + targetKeys.length + ' unique</span></h4><ul class="target-list">';
        targetKeys.sort().forEach(function(t) {
          html += '<li><span class="target-protein">' + t + '</span> <span class="target-count">(' + targets[t] + ' effectors)</span></li>';
        });
        html += '</ul></div>';
      }

      // Effectors table
      if (effs.length) {
        html += '<div class="article-section"><h4>Effector Repertoire</h4><table><thead><tr><th>Effector</th><th>Type</th><th>Host Target</th><th>Mechanism</th></tr></thead><tbody>';
        effs.forEach(function(e) {
          html += "<tr><td>" + e.effector_name + "</td><td>" + (e.type || "—") + "</td><td>" + (e.host_target || "—") + "</td><td>" + (e.mechanism || "—") + "</td></tr>";
        });
        html += '</tbody></table></div>';
      }

      // ML prediction
      if (mlPred) {
        var ok = mlPred.predicted === mlPred.actual ? "green" : "red";
        html += '<div class="article-section"><h4>ML Strategy Prediction</h4><p>'
          + 'Predicted: <span class="badge badge-' + ok + '">' + mlPred.predicted + '</span>'
          + ' &nbsp;|&nbsp; Actual: <span class="badge badge-blue">' + mlPred.actual + '</span>'
          + ' &nbsp;|&nbsp; Confidence: ' + (mlPred.confidence * 100).toFixed(0) + '%'
          + '</p></div>';
      }

      articleDiv.innerHTML = html;
    }
  }
}

function filterAllPathogens() {
  var q = (document.getElementById("ap-search").value || "").toLowerCase();
  var strat = document.getElementById("ap-strategy").value;
  var gram = document.getElementById("ap-gram").value;
  var filtered = _allPathogensData.filter(function(p) {
    if (q && p.name.toLowerCase().indexOf(q) === -1
      && (p.species || "").toLowerCase().indexOf(q) === -1
      && (p.description || "").toLowerCase().indexOf(q) === -1) return false;
    if (strat && p.strategy !== strat) return false;
    if (gram && p.gram_stain !== gram) return false;
    return true;
  });
  var effMap = {};
  (TOOLKIT_DATA.effectors || []).forEach(function(e) {
    effMap[e.pathogen_name] = (effMap[e.pathogen_name] || 0) + 1;
  });
  var container = document.getElementById("all-pathogens-container");
  if (container) _renderPathogenGrid(filtered, effMap, container);
}

// Hook into the existing init
var _origInitToolkit = initToolkit;
initToolkit = function() {
  if (_origInitToolkit) _origInitToolkit();
  renderAllPathogens();
};

// Init is now triggered by data-loader.js after API data is fetched
