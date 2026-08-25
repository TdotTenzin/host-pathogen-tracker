(function() {
  function fetchJSON(url) {
    return fetch(url).then(function(r) {
      if (!r.ok) throw new Error(url + " returned " + r.status);
      return r.json();
    });
  }

  function processEffectors(effectors) {
    return effectors.map(function(e) {
      return {
        pathogen_name: e.pathogen,
        effector_name: e.effector,
        type: e.type,
        host_target: e.host_target,
        mechanism: e.mechanism
      };
    });
  }

  function buildStageMarkers(stages) {
    var allMarkerNames = [];
    var markerSet = {};
    stages.forEach(function(s) {
      (s.markers_present || []).forEach(function(m) {
        if (!markerSet[m.name]) {
          markerSet[m.name] = true;
          allMarkerNames.push(m.name);
        }
      });
    });
    var stageMarkers = [];
    stages.forEach(function(s) {
      var presentSet = {};
      (s.markers_present || []).forEach(function(m) { presentSet[m.name] = 1; });
      allMarkerNames.forEach(function(m) {
        stageMarkers.push({ stage_name: s.name, host_protein_name: m, presence: presentSet[m] || 0 });
      });
    });
    return { stage_markers: stageMarkers, stage_marker_names: allMarkerNames };
  }

  function loadFallbackJSON() {
    return fetch("data/fallback.json")
      .then(function(r) { if (!r.ok) throw new Error("fallback.json unavailable"); return r.json(); })
      .catch(function() { return null; });
  }

  function mergeFallback(fb) {
    if (!fb) return;
    if (fb.pathogens) TOOLKIT_DATA.pathogens = fb.pathogens;
    if (fb.effectors) TOOLKIT_DATA.effectors = fb.effectors;
    if (fb.host_proteins) TOOLKIT_DATA.host_proteins = fb.host_proteins;
    if (fb.hubs) TOOLKIT_DATA.hubs = fb.hubs;
    if (fb.maturation_stages) TOOLKIT_DATA.maturation_stages = fb.maturation_stages;
    if (fb.stage_markers) TOOLKIT_DATA.stage_markers = fb.stage_markers;
    if (fb.stage_marker_names) TOOLKIT_DATA.stage_marker_names = fb.stage_marker_names;
    if (fb.pathogen_actions) TOOLKIT_DATA.pathogen_actions = fb.pathogen_actions;
    if (fb.ml_predictions) TOOLKIT_DATA.ml_predictions = fb.ml_predictions;
  }

  function loadLiveData() {
    // Try bootstrap endpoint first (single request, reduces cold starts)
    return fetchJSON("/api/bootstrap")
      .then(function(data) {
        if (data.pathogens) TOOLKIT_DATA.pathogens = data.pathogens;
        if (data.effectors) TOOLKIT_DATA.effectors = processEffectors(data.effectors);
        if (data.host_proteins) TOOLKIT_DATA.host_proteins = data.host_proteins;
        if (data.hubs) TOOLKIT_DATA.hubs = data.hubs;

        if (data.stages) {
          TOOLKIT_DATA.maturation_stages = data.stages.map(function(s) {
            return {
              stage_order: s.stage_order, name: s.name, time_range: s.time_range,
              ph_min: s.ph_min, ph_max: s.ph_max, description: s.description
            };
          });
          var sm = buildStageMarkers(data.stages);
          TOOLKIT_DATA.stage_markers = sm.stage_markers;
          TOOLKIT_DATA.stage_marker_names = sm.stage_marker_names;
          TOOLKIT_DATA.pathogen_actions = [];
          data.stages.forEach(function(s) {
            (s.active_pathogens || []).forEach(function(ap) {
              TOOLKIT_DATA.pathogen_actions.push({
                pathogen: ap.pathogen,
                stage: s.name,
                ph: (s.ph_min + s.ph_max) / 2,
                action: ap.strategy
              });
            });
          });
        }
      })
      .catch(function() {
        // Bootstrap failed — try individual endpoints
        return Promise.all([
          fetchJSON("/api/pathogens").catch(function() { return null; }),
          fetchJSON("/api/effectors?limit=500").catch(function() { return null; }),
          fetchJSON("/api/trafficking/stages").catch(function() { return null; }),
          fetchJSON("/api/interactome/hubs?top_n=15").catch(function() { return null; }),
          fetchJSON("/api/host-proteins?limit=100").catch(function() { return null; }),
        ]).then(function(results) {
          var pathogens = results[0];
          var effectors = results[1];
          var stages = results[2];
          var hubs = results[3];
          var hostProteins = results[4];

          if (pathogens) { TOOLKIT_DATA.pathogens = pathogens; }
          if (effectors) { TOOLKIT_DATA.effectors = processEffectors(effectors); }
          if (hostProteins) { TOOLKIT_DATA.host_proteins = hostProteins; }
          if (hubs) { TOOLKIT_DATA.hubs = hubs; }

          if (stages) {
            TOOLKIT_DATA.maturation_stages = stages.map(function(s) {
              return {
                stage_order: s.stage_order, name: s.name, time_range: s.time_range,
                ph_min: s.ph_min, ph_max: s.ph_max, description: s.description
              };
            });
            var sm = buildStageMarkers(stages);
            TOOLKIT_DATA.stage_markers = sm.stage_markers;
            TOOLKIT_DATA.stage_marker_names = sm.stage_marker_names;
            TOOLKIT_DATA.pathogen_actions = [];
            stages.forEach(function(s) {
              (s.active_pathogens || []).forEach(function(ap) {
                TOOLKIT_DATA.pathogen_actions.push({
                  pathogen: ap.pathogen,
                  stage: s.name,
                  ph: (s.ph_min + s.ph_max) / 2,
                  action: ap.strategy
                });
              });
            });
          }

          var hasFullData = pathogens && effectors && stages && hubs;
          if (hasFullData) return;
          return loadFallbackJSON().then(mergeFallback);
        })
        .catch(function() {
          return loadFallbackJSON().then(mergeFallback);
        });
      });
  }

  function init() {
    loadLiveData().then(function() {
      if (typeof initToolkit === "function") initToolkit();
      if (typeof initCharts === "function") initCharts();
      if (typeof handleDeepLink === "function") handleDeepLink();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
