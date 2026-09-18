/* ---------------------------------------------------------------------------
   CSV utilities — parsing, schema detection, templates, and presets for the
   "My Data" import tools. Zero dependencies.

   Imported spreadsheets are classified into one of two modes:
     - "hostpathogen" : columns reference pathogens/effectors -> normalized
                        into TOOLKIT_DATA-shaped {pathogens, effectors}.
     - "numeric"      : tabular numeric data -> {columns, rows}.
   --------------------------------------------------------------------------- */

(function (global) {
  "use strict";

  function detectDelimiter(text) {
    var first = text.slice(0, 4000);
    var commas = (first.match(/,/g) || []).length;
    var tabs = (first.match(/\t/g) || []).length;
    if (tabs > commas) return "\t";
    return ",";
  }

  /* Parse delimited text, handling quoted fields with embedded delimiters,
     doubled quotes, and CRLF line endings. Returns an array of row arrays. */
  function parseDelimited(text, delim) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === delim) {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        row.push(field);
        field = "";
        if (row.length && row.some(function (s) { return String(s).trim() !== ""; })) {
          rows.push(row);
        }
        row = [];
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else {
        field += c;
      }
    }
    if (field !== "" || row.length) {
      row.push(field);
      if (row.some(function (s) { return String(s).trim() !== ""; })) rows.push(row);
    }
    return rows;
  }

  function parseTable(text) {
    var delim = detectDelimiter(text);
    var grid = parseDelimited(text, delim).filter(function (r) { return r.length; });
    if (!grid.length) return { columns: [], rows: [], delim: delim };
    var lastLen = grid[grid.length - 1].length;
    var maxLen = Math.max.apply(Math, grid.map(function (r) { return r.length; }));
    if (lastLen === 1 && String(grid[grid.length - 1][0]).trim() === "") grid.pop();
    var columns = (grid[0] || []).map(function (c, i) {
      var name = String(c).trim();
      if (!name) name = "column_" + (i + 1);
      return name;
    });
    var rows = grid.slice(1).map(function (r) {
      var row = [];
      for (var i = 0; i < maxLen; i++) row.push(i < r.length ? String(r[i]).trim() : "");
      return row;
    });
    return { columns: columns, rows: rows, delim: delim };
  }

  function normalizeHeader(name) {
    return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function columnIndex(columns, aliases) {
    for (var i = 0; i < columns.length; i++) {
      var n = normalizeHeader(columns[i]);
      for (var j = 0; j < aliases.length; j++) {
        if (n === normalizeHeader(aliases[j])) return i;
      }
    }
    return -1;
  }

  function detectMode(columns, rows) {
    var idxPathogen = columnIndex(columns, ["pathogen", "pathogen_name", "pathogenname", "organism", "species"]);
    var idxEffector = columnIndex(columns, ["effector", "effector_name", "effectorname"]);
    if (idxPathogen >= 0) return "hostpathogen";

    // Numeric: at least one column is numeric in a sample of the rows.
    var sample = rows.slice(0, 20);
    var numericCols = 0;
    for (var c = 0; c < columns.length; c++) {
      var numeric = 0, total = 0;
      for (var r = 0; r < sample.length; r++) {
        var v = sample[r][c];
        if (v === "") continue;
        total++;
        if (!isNaN(parseFloat(v))) numeric++;
      }
      if (total >= 3 && numeric / total >= 0.8) numericCols++;
    }
    if (numericCols >= 1 && columns.length >= 2) return "numeric";
    return "unknown";
  }

  function rowObject(columns, row) {
    var obj = {};
    for (var i = 0; i < columns.length; i++) obj[columns[i]] = row[i] || "";
    return obj;
  }

  function splitTargets(hostTarget) {
    if (!hostTarget) return [];
    return String(hostTarget)
      .split(/\s*\/\s*|\s+and\s+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s && s.toLowerCase() !== "none" && s.toLowerCase() !== "n/a"; });
  }

  /* Normalize a hostpathogen-mode table into {pathogens, effectors}. A table
     with a pathogen column but no effector column is treated as a pathogen
     profile list (drives the All Pathogens card grid). */
  function normalizeHostPathogen(columns, rows) {
    var iPathogen = columnIndex(columns, ["pathogen", "pathogen_name", "pathogenname"]);
    if (iPathogen < 0) iPathogen = columnIndex(columns, ["organism", "species"]);
    var iEffector = columnIndex(columns, ["effector", "effector_name", "effectorname"]);
    var isProfileTable = iEffector < 0;
    var iType = columnIndex(columns, ["type", "effector_type", "effectortype", "category"]);
    var iTarget = columnIndex(columns, ["host_target", "hosttarget", "target", "host_protein", "hostprotein", "target_host", "pathogen_target"]);
    var iMech = columnIndex(columns, ["mechanism", "function", "description"]);
    var iStrategy = columnIndex(columns, ["strategy", "evasion_strategy", "evasionstrategy"]);
    var iGram = columnIndex(columns, ["gram_stain", "gramstain", "gram"]);
    var iSpecies = columnIndex(columns, ["species", "organism", "scientific_name", "scientificname"]);
    var iDesc = isProfileTable
      ? columnIndex(columns, ["description", "about", "summary", "details", "notes", "info"])
      : columnIndex(columns, ["details", "about", "summary"]);
    var iRef = columnIndex(columns, ["reference", "doi", "publication", "source"]);

    var effectors = [];
    var pathogens = {};
    var hostTargets = {};

    rows.forEach(function (row) {
      var pathogen = String(row[iPathogen] || "unknown").trim();
      if (!pathogen) return;
      var effector = String((iEffector >= 0 ? row[iEffector] : "") || "").trim();

      if (!effector) {
        // Profile row — only pathogen-level fields are captured.
      } else {
        var rec = {
          pathogen_name: pathogen,
          effector_name: effector,
          type: iType >= 0 ? row[iType] || "" : "",
          host_target: iTarget >= 0 ? row[iTarget] || "" : "",
          mechanism: iMech >= 0 ? row[iMech] || "" : ""
        };
        effectors.push(rec);
        splitTargets(rec.host_target).forEach(function (t) { hostTargets[t] = true; });
      }

      var p = pathogens[pathogen] || {};
      p.name = pathogen;
      if (iStrategy >= 0 && row[iStrategy]) p.strategy = row[iStrategy];
      if (iGram >= 0 && row[iGram]) p.gram_stain = row[iGram];
      if (iSpecies >= 0 && iSpecies !== iPathogen && row[iSpecies]) p.species = row[iSpecies];
      if (iDesc >= 0 && row[iDesc]) p.description = row[iDesc];
      if (iRef >= 0 && row[iRef]) p.reference = row[iRef];
      p.n_effectors = (p.n_effectors || 0) + (effector ? 1 : 0);
      pathogens[pathogen] = p;
    });

    var pathogenList = Object.keys(pathogens).sort().map(function (k) { return pathogens[k]; });
    var hostProteins = Object.keys(hostTargets).sort().map(function (k) { return { name: k }; });
    return { pathogens: pathogenList, effectors: effectors, host_proteins: hostProteins };
  }

  /* Build a TOOLKIT_DATA-shaped dataset from the built-in curated data, so it
     can be loaded back through the "My Data" tools as a preset. */
  function buildPresetCurated() {
    var effectors = (global.TOOLKIT_DATA && global.TOOLKIT_DATA.effectors) || [];
    var map = {};
    effectors.forEach(function (e) {
      if (!map[e.pathogen_name]) map[e.pathogen_name] = { name: e.pathogen_name, n_effectors: 0 };
      map[e.pathogen_name].n_effectors++;
    });
    var pathogens = (global.TOOLKIT_DATA && global.TOOLKIT_DATA.pathogens) || [];
    var list = pathogens.map(function (p) {
      return {
        name: p.name,
        strategy: p.strategy || "",
        gram_stain: p.gram_stain || "",
        species: p.species || "",
        description: p.description || "",
        reference: p.reference || "",
        n_effectors: (map[p.name] && map[p.name].n_effectors) || p.n_effectors || 0
      };
    });
    var effs = effectors.map(function (e) {
      return {
        pathogen_name: e.pathogen_name,
        effector_name: e.effector_name,
        type: e.type || "",
        host_target: e.host_target || "",
        mechanism: e.mechanism || ""
      };
    });
    return {
      preset: "curated",
      label: "Curated dataset (54 pathogens)",
      mode: "hostpathogen",
      pathogens: list,
      effectors: effs,
      ml_predictions: (global.TOOLKIT_DATA && global.TOOLKIT_DATA.ml_predictions) || [],
      host_proteins: hostTargetsFromEffectors(effs)
    };
  }

  function hostTargetsFromEffectors(effectors) {
    var targets = {};
    effectors.forEach(function (e) {
      splitTargets(e.host_target).forEach(function (t) { targets[t] = true; });
    });
    return Object.keys(targets).sort().map(function (k) { return { name: k }; });
  }

  /* Deterministic seeded PRNG so the sample preset is stable across loads. */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Sample numeric preset: simulated qPCR-style expression values for
     host trafficking genes across infected vs control samples. */
  function buildPresetNumeric() {
    var genes = [
      { name: "RAB5A", base: 6.4, effect: 0.6 },
      { name: "RAB7A", base: 5.8, effect: -1.2 },
      { name: "EEA1", base: 5.2, effect: 0.4 },
      { name: "LAMP1", base: 6.1, effect: -1.8 },
      { name: "CTSD", base: 5.5, effect: -1.4 },
      { name: "ACTB", base: 7.2, effect: 0.1 },
      { name: "PIK3C3", base: 4.8, effect: 0.9 },
      { name: "VPS34", base: 4.5, effect: 0.8 }
    ];
    var rng = mulberry32(20240917);
    var rows = [];
    var columns = ["sample", "condition"].concat(genes.map(function (g) { return g.name; }));
    for (var i = 0; i < 12; i++) {
      var infected = i < 6;
      var row = ["S" + (i + 1), infected ? "infected" : "control"];
      genes.forEach(function (g) {
        var v = g.base + (infected ? g.effect : 0) + (rng() - 0.5) * 0.6;
        row.push(v.toFixed(2));
      });
      rows.push(row);
    }
    return {
      preset: "numeric",
      label: "Sample expression data (12 samples × 8 genes)",
      mode: "numeric",
      columns: columns,
      rows: rows
    };
  }

  /* Templates users can download to see the expected format. */
  function templateHostPathogen() {
    return [
      "pathogen,effector,type,host_target,mechanism",
      "Salmonella enterica,SopE,T3SS effector,Rac1,Cdc42 GEF activates actin ruffling",
      "Salmonella enterica,SifA,SPI-2 effector,SKIP / Rab9,Maintains SCV membrane integrity",
      "Mycobacterium tuberculosis,SapM,Phosphatase,PI3P,Depletes PI(3)P to block maturation",
      "Listeria monocytogenes,InlA,Invasin,ECAD,Hijacks E-cadherin for zipper entry",
      ""
    ].join("\n");
  }

  function templateNumeric() {
    return [
      "sample,condition,RAB5A,RAB7A,LAMP1",
      "S1,infected,7.2,4.9,4.1",
      "S2,infected,7.0,5.0,4.3",
      "S3,control,6.4,6.0,6.2",
      "S4,control,6.5,5.9,6.0",
      ""
    ].join("\n");
  }

  function templateProfiles() {
    return [
      "pathogen,strategy,gram_stain,species,description,reference",
      "Mycobacterium tuberculosis,arrest,Acid-fast,Mycobacterium tuberculosis complex,Blocks Rab5-to-Rab7 conversion and dampens phagosome acidification.,10.1128/IAI.00737-17",
      "Salmonella enterica,modified_compartment,Gram-negative,Salmonella enterica subsp. enterica,Redirects the SCV via SPI-2 effectors to avoid lysosomal fusion.,10.1038/nrmicro1322",
      "Shigella flexneri,escape,Gram-negative,Shigella flexneri serotype 2a,Lyses the phagosome and escapes to the cytosol via IpaB/C pores.,10.1038/nrmicro2078",
      ""
    ].join("\n");
  }

  function textFromRows(columns, rows, delim) {
    var d = delim || ",";
    function esc(v) {
      var s = String(v === null || v === undefined ? "" : v);
      return /[",\n\t]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }
    var lines = [columns.map(esc).join(d)];
    rows.forEach(function (r) { lines.push(r.map(esc).join(d)); });
    return lines.join("\n");
  }

  global.CSVUtils = {
    detectDelimiter: detectDelimiter,
    parseDelimited: parseDelimited,
    parseTable: parseTable,
    detectMode: detectMode,
    columnIndex: columnIndex,
    rowObject: rowObject,
    splitTargets: splitTargets,
    normalizeHostPathogen: normalizeHostPathogen,
    hostTargetsFromEffectors: hostTargetsFromEffectors,
    buildPresetCurated: buildPresetCurated,
    buildPresetNumeric: buildPresetNumeric,
    templateHostPathogen: templateHostPathogen,
    templateNumeric: templateNumeric,
    templateProfiles: templateProfiles,
    textFromRows: textFromRows
  };
})(window);