/* ---------------------------------------------------------------------------
   Glossary — Help section data and renderer.
   Provides quick-start steps, an FAQ, and a searchable glossary of the
   biology, statistics, and machine-learning terms used across the toolkit.
   No dependencies; renders into #help-content.
   --------------------------------------------------------------------------- */

(function () {
  "use strict";

  var TERMS = [
    /* --------------------------------------------------- Biology */
    { c: "Biology", t: "Effector protein", d: "A microbial protein delivered into the host cell to manipulate host biology. Effectors are usually injected by dedicated secretion systems (T3SS/T4SS) and often remodel endomembrane trafficking, actin dynamics, or immune signalling." },
    { c: "Biology", t: "Host target", d: "The host protein, organelle, or pathway that an effector acts upon. In this dataset each effector lists its host target(s), which become nodes in the interaction network." },
    { c: "Biology", t: "Type III / Type IV secretion system", d: "A needle-like protein syringe (T3SS) or conjugation-related transporter (T4SS) used by bacteria to inject effectors into host cells. Salmonella (SPI-1/SPI-2), Shigella (T3SS), and Legionella (Dot/Icm T4SS) all use them." },
    { c: "Biology", t: "Pathogenicity island", d: "A horizontally-acquired genomic region that clusters virulence genes, including secretion systems and effectors. Salmonella SPI-1 and SPI-2 encode T3SSs for entry and intracellular survival, respectively." },
    { c: "Biology", t: "Phagosome", d: "The membrane-bound vacuole formed when a phagocyte engulfs a particle. It matures through sequential fusion with early endosomes, late endosomes, and finally lysosomes to become a degradative phagolysosome." },
    { c: "Biology", t: "Phagosome maturation", d: "The ordered conversion of a phagosome into a degradative phagolysosome, marked by Rab5→Rab7 switching, PI(3)P turnover, V-ATPase acidification (pH 6.5→4.5), and LAMP1/cathepsin acquisition." },
    { c: "Biology", t: "Early phagosome", d: "A young phagosome marked by Rab5, EEA1 and PI(3)P, with a mildly acidic lumen (pH ~6.5). It fuses with early endosomes and is the branch point many pathogens manipulate." },
    { c: "Biology", t: "Late phagosome / phagolysosome", d: "Mature degradative compartments marked by Rab7 and LAMP1, then fully acidic (pH ~4.5) cathepsin-rich phagolysosomes. Their formation is what most intracellular pathogens must evade." },
    { c: "Biology", t: "Maturation arrest", d: "An evasion strategy in which a pathogen blocks phagosome maturation. Example: Mycobacterium tuberculosis dephosphorylates PI(3)P with SapM, preventing Rab5→Rab7 conversion so the vacuole stalls at the early/late boundary." },
    { c: "Biology", t: "Modified compartment", d: "A strategy where a pathogen keeps its vacuole at a stable but non-degradative stage. Example: Salmonella's SCV acquires LAMP1 yet excludes hydrolytic enzymes, giving a replicative niche." },
    { c: "Biology", t: "Escape to cytosol", d: "A strategy where a pathogen lyses its phagosome and replicates in the cytosol. Listeria (LLO) and Shigella (IpaB) punch through the vacuolar membrane to gain access to the cytoplasm." },
    { c: "Biology", t: "Vesicle rerouting", d: "A strategy where a pathogen redirects vesicular traffic so its vacuole avoids the endocytic-degradative path. Legionella recruits ER-derived COPII vesicles to build an ER-like compartment (LCV)." },
    { c: "Biology", t: "Extracellular survival", d: "A strategy of remaining outside host cells, often by resisting humoral defences, e.g. capsule production, serum resistance, or toxin-driven tissue destruction." },
    { c: "Biology", t: "Gram stain", d: "A differential stain that separates bacteria by cell-wall architecture. Gram-positive bacteria have thick peptidoglycan and stay purple; Gram-negative bacteria have an outer membrane and appear pink; acid-fast bacteria (mycobacteria) resist decolorization." },
    { c: "Biology", t: "Interactome", d: "The full set of molecular interactions in a biological system. Here it is the bipartite graph of effector–host-protein targeting relationships built from the curated dataset." },
    { c: "Biology", t: "Hub protein", d: "A highly-connected node in the interactome: a host protein targeted by effectors from many different pathogens. High-degree hubs (e.g. Rab7, actin, Rac1) represent conserved exploitation points." },
    { c: "Biology", t: "Salmonella-containing vacuole (SCV)", d: "Salmonella's modified-compartment niche: LAMP1-positive yet non-degradative, with pH ~5.0–5.5. SPI-2 effectors (SifA, SseJ, SseG) remodel it and extend Salmonella-induced filaments." },
    { c: "Biology", t: "Marker (maturation)", d: "A host protein whose presence/absence reports the phagosomal stage — e.g. Rab5 and EEA1 mark early stages, Rab7, LAMP1 and V-ATPase mark late ones. The Stage Predictor uses marker sets to call a stage." },

    /* ------------------------------------------ Statistics & genomics */
    { c: "Statistics & Genomics", t: "Descriptive statistics", d: "Summary measures of a sample: count, missing values, mean, median, standard deviation, and min/max. The Statistics tab computes these for every numeric column." },
    { c: "Statistics & Genomics", t: "p-value", d: "The probability of observing a test statistic at least as extreme as the one seen, assuming the null hypothesis is true. Small p-values (conventionally < 0.05) indicate evidence against the null." },
    { c: "Statistics & Genomics", t: "Welch's t-test", d: "A two-sample t-test that does not assume equal variances between groups. Used in the Compare and Differential Expression tabs to test whether two groups (e.g. infected vs. control) differ in mean expression." },
    { c: "Statistics & Genomics", t: "Multiple testing problem", d: "When many hypotheses are tested at once, the chance of false positives (type I errors) inflates. Testing 100 genes at α = 0.05 would alone generate ~5 spurious hits — hence corrections are needed." },
    { c: "Statistics & Genomics", t: "Benjamini–Hochberg FDR", d: "A correction that controls the expected proportion of false positives among the rejected hypotheses. It ranks p-values and adjusts each by m/rank; you get an adjusted p-value (q-value) that stays interpretable at genome scale." },
    { c: "Statistics & Genomics", t: "Bonferroni correction", d: "The strictest multiple-testing correction: multiply each p-value by the number of tests m. It protects the family-wise error rate but sacrifices power, which is why genomics usually prefers FDR." },
    { c: "Statistics & Genomics", t: "Differential expression (DEG)", d: "Identification of genes whose expression differs between conditions. Requires a ratio (fold change) and a significance test; results are summarized by log2 fold-change and adjusted p-value per gene." },
    { c: "Statistics & Genomics", t: "Log2 fold-change (log2FC)", d: "The base-2 logarithm of the ratio of mean expression in group B over group A. log2FC of +2 means 4× upregulation, −2 means 4× downregulation; it is symmetric around zero and additive." },
    { c: "Statistics & Genomics", t: "Volcano plot", d: "A scatter plot of log2 fold-change (x) against −log10(adjusted p-value) (y). Genes in the upper corners are both strongly changed and statistically significant; the y-axis lets low p-values plot high." },
    { c: "Statistics & Genomics", t: "MA plot", d: "A scatter plot of mean expression strength (x, the 'A' axis) against log2 fold-change (y, the 'M' axis = minus). Highlights where changes occur across the expression range and reveals bias from low-abundance genes." },
    { c: "Statistics & Genomics", t: "Heatmap", d: "A matrix where values are encoded as colour. Here rows are genes/features, columns are samples; values are z-scored per row so colour reflects relative up/down regulation, with blue–white–red for low–mid–high." },
    { c: "Statistics & Genomics", t: "z-score", d: "Standardization: (x − mean) / SD, computed per row in the heatmap. z-scores make features comparable and highlight deviations from a row's own average regardless of absolute scale." },
    { c: "Statistics & Genomics", t: "Pearson correlation", d: "A measure (−1 to +1) of the linear association between two variables. Used in the Correlation tab to build the correlation matrix and flag strong associations (|r| ≥ 0.7)." },
    { c: "Statistics & Genomics", t: "Principal Component Analysis (PCA)", d: "A linear method that projects samples onto orthogonal axes of maximum variance (principal components). PCA compresses many correlated features into a few components you can visualise, colouring by groups such as condition or strategy." },
    { c: "Statistics & Genomics", t: "UMAP", d: "A nonlinear dimensionality-reduction method that preserves local neighbourhood structure, often producing tighter, more interpretable clusters than PCA for complex biological data." },
    { c: "Statistics & Genomics", t: "k-means clustering", d: "A partitional clustering algorithm that groups samples into k clusters by minimising within-cluster distances. The Clusters tab runs it and projects the result onto PC1/PC2." },
    { c: "Statistics & Genomics", t: "OLS regression", d: "Ordinary least squares fits a linear model y = β₀ + β₁x by minimising summed squared residuals. The Regression tab reports the equation, R², and coefficients." },
    { c: "Statistics & Genomics", t: "Box plot", d: "A five-number summary visualised as a box: median line, interquartile range (Q1–Q3) box, whiskers to min/max. The Compare tab draws one box per group for a chosen column." },
    { c: "Statistics & Genomics", t: "Over-representation analysis (ORA)", d: "Testing whether your gene list is enriched for members of known pathways beyond chance, using the hypergeometric distribution (Fisher's exact test). The Enrichment tab runs ORA with Bonferroni correction." },
    { c: "Statistics & Genomics", t: "Hypergeometric test", d: "Models drawing without replacement: given N background proteins, K in a pathway, and n found in your list, it asks the probability of seeing k or more overlaps by chance." },
    { c: "Statistics & Genomics", t: "Multiple sequence alignment (MSA)", d: "Arranging three or more sequences to maximise shared columns (conserved residues). The building block for the Neighbour-Joining phylogeny used on effector proteins." },
    { c: "Statistics & Genomics", t: "Neighbour-joining (NJ)", d: "A fast distance-based phylogenetic method that repeatedly joins the closest taxa while correcting for evolutionary rate variation, producing a rooted/unrooted tree from a distance matrix." },

    /* ------------------------------------------------- Machine learning */
    { c: "Machine Learning", t: "Random Forest", d: "An ensemble of decision trees built on random data subsets and feature subsets; predictions are the majority vote. Robust on small datasets, used here to classify evasion strategy from 11 effector-derived features." },
    { c: "Machine Learning", t: "Feature engineering", d: "Turning raw data into predictive numeric inputs. Each pathogen's effector repertoire is summarised into counts (n_effectors, n_T3SS, n_toxins, …) forming a 54×11 feature matrix for the classifier." },
    { c: "Machine Learning", t: "Cross-validation", d: "Splitting data into training/testing folds repeatedly to estimate generalisation. The classifier comparison uses 5-fold stratified CV and reports mean accuracy ± SD per model." },
    { c: "Machine Learning", t: "Confusion matrix", d: "A table of true vs. predicted classes; the diagonal is correct predictions and off-diagonal cells are errors. Quantifies which classes a classifier confuses." },

    /* ------------------------------------------- Web, data & methods */
    { c: "Site & Data", t: "Preset dataset", d: "A bundled dataset you can load with one click: the curated 54-pathogen collection and a simulated 12-sample expression table, so you can try every tool without finding your own file." },
    { c: "Site & Data", t: "Host-pathogen CSV format", d: "The import layout for the network tools: one row per effector with columns pathogen, effector, type, host_target, mechanism. See 'Host-pathogen CSV' in the templates." },
    { c: "Site & Data", t: "Numeric CSV format", d: "A rectangular table for the statistics tools: first row is column headers, at least one categorical column (e.g. condition) and one or more numeric columns (sample, condition, RAB5A, …)." },
    { c: "Site & Data", t: "Offline / file:// mode", d: "Opening index.html directly from disk. Chart.js, D3, and the embedded data all load locally, so every client-side tool works with no server; only live API features (ML prediction, UMAP, phylogeny build) degrade gracefully." },
    { c: "Site & Data", t: "fallback.json / embedded data", d: "A JSON snapshot of the whole database, bundled both as data/fallback.json and as the TOOLKIT_DATA object in js/data.js. The data layer falls back to it whenever the API is unreachable." },
    { c: "Site & Data", t: "CSV / TSV import", d: "Paste or upload rows of text with a header row. Values may be comma- or tab-separated, and the importer does a best-effort column-type inference (numeric vs. categorical)." }
  ];

  var FAQ = [
    { q: "How do I try the site without my own data?", a: "In the 'Import Data' section click a preset — 'Curated dataset (54 pathogens)' feeds the network, hubs, stages, enrichment, ML and PCA tools; 'Sample expression data' feeds statistics, correlation, PCA, clustering, regression, histograms, compare, heatmap and differential expression. Everything else then appears on the page." },
    { q: "Does the site need a server?", a: "No. All client-side tools — import, network, hubs, stage map, enrichment, PCA, statistics, clustering, regression, compare, heatmap, and DEG — run entirely in your browser, even when opened from file://. The live API adds ML strategy prediction, UMAP, and on-the-fly phylogeny when available; without it those tabs show an offline notice." },
    { q: "My import looks empty or failed — what should I check?", a: "For host-pathogen data use the template columns: pathogen, effector, type, host_target, mechanism (one row per effector). For numeric data keep a header row, put a categorical column such as 'condition' first, and make sure numeric cells contain only numbers. If nothing appears, the dataset may not match either shape — the status line above the Import button explains what happened." },
    { q: "What does the Compare tab need?", a: "A numeric column (the response) and a categorical column with exactly two groups, each with at least two rows. It then runs a Welch t-test and draws per-group box plots. The built-in expression preset's 'condition' column (infected vs. control) is a ready example." },
    { q: "How is differential expression (DEG) computed here?", a: "For every numeric column it splits samples by the chosen two-group column, computes a Welch t-test and the log2 fold-change of group B over group A, then corrects all p-values with the Benjamini–Hochberg procedure (adjusted p < 0.05 = significant). Results are shown as a volcano plot, an MA plot, a sortable table, and a z-scored heatmap of the top genes. Values are log2-transformed internally; add a small pseudocount if your data contains zeros." },
    { q: "What is the difference between a p-value and an adjusted p-value?", a: "A raw p-value is for a single test. When you run hundreds (one per gene), some will look significant by chance alone; the adjusted (BH) p-value controls the expected fraction of false discoveries among the genes you call significant. That is why the volcano/table should be read on adjusted p-values." }
  ];

  var QUICK_STEPS = [
    { icon: "&#8648;", title: "1 — Load data", body: "Pick a preset or import your own CSV/TSV/JSON in the Import Data section. The rest of the page unlocks once a dataset is loaded.", href: "#my-data" },
    { icon: "&#128202;", title: "2 — Explore", body: "Browse pathogens, the interaction network, the maturation timeline, ML, phylogeny, and the built-in toolkit cards.", href: "#all-pathogens" },
    { icon: "&#9881;", title: "3 — Analyse", body: "In 'My Data', run stats, correlation, PCA, clustering, regression, compare, heatmaps, and differential expression on your table.", href: "#mydata-panel" }
  ];

  function _esc(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function _termList(filter, cat) {
    var q = (filter || "").toLowerCase().trim();
    return TERMS.filter(function (term) {
      if (cat && term.c !== cat) return false;
      if (!q) return true;
      return term.t.toLowerCase().indexOf(q) !== -1
        || term.d.toLowerCase().indexOf(q) !== -1
        || term.c.toLowerCase().indexOf(q) !== -1;
    });
  }

  function _renderTerms(searchEl, catEl, listEl) {
    var list = _termList(searchEl ? searchEl.value : "", catEl ? catEl.value : "");
    var countEl = document.getElementById("glossary-count");
    if (countEl) countEl.textContent = list.length + " term" + (list.length === 1 ? "" : "s");
    var openAfterFilter = searchEl && searchEl.value && list.length === 1;
    listEl.innerHTML = list.map(function (term) {
      return '<details class="glossary-term" open>' +
        '<summary><span class="glossary-cat">' + _esc(term.c) + "</span> " + _esc(term.t) + "</summary>" +
        "<p>" + _esc(term.d) + "</p></details>";
    }).join("") || "<em>No matching glossary terms.</em>";

    if (!openAfterFilter && list.length <= 8 && !(searchEl && searchEl.value)) {
      var items = listEl.querySelectorAll("details.glossary-term");
      for (var i = 0; i < items.length; i++) items[i].removeAttribute("open");
    }
  }

  function init() {
    var root = document.getElementById("help-content");
    if (!root) return;

    root.innerHTML =
      '<div class="help-grid">' +
      QUICK_STEPS.map(function (s) {
        return '<div class="tool-card help-step">' +
          '<div class="tool-header"><span class="tool-icon">' + s.icon + "</span><h3>" + _esc(s.title) + "</h3></div>" +
          "<p>" + _esc(s.body) + '</p><a class="tool-btn tool-btn-sm" href="' + _esc(s.href) + '">Go &nearr;</a>' +
          "</div>";
      }).join("") +
      "</div>" +

      '<div class="help-block">' +
      "<h3 class='chart-heading'>Frequently Asked Questions</h3>" +
      FAQ.map(function (f) {
        return "<details class='faq-item'><summary>" + _esc(f.q) + "</summary><p>" + _esc(f.a) + "</p></details>";
      }).join("") +
      "</div>" +

      '<div class="help-block">' +
      '<h3 class="chart-heading">Glossary <span id="glossary-count" class="glossary-count"></span></h3>' +
      '<div class="mydata-tool-row">' +
      '<input id="glossary-search" class="tool-input" type="text" placeholder="Search terms…">' +
      '<select id="glossary-cat" class="tool-select">' +
      '<option value="">All categories</option>' +
      ["Biology", "Statistics & Genomics", "Machine Learning", "Site & Data"].map(function (c) {
        return '<option value="' + _esc(c) + '">' + _esc(c) + "</option>";
      }).join("") +
      "</select></div>" +
      '<div id="glossary-list" class="glossary-list"></div>' +
      "</div>";

    var searchEl = document.getElementById("glossary-search");
    var catEl = document.getElementById("glossary-cat");
    var listEl = document.getElementById("glossary-list");
    _renderTerms(searchEl, catEl, listEl);
    if (searchEl) searchEl.addEventListener("input", function () { _renderTerms(searchEl, catEl, listEl); });
    if (catEl) catEl.addEventListener("change", function () { _renderTerms(searchEl, catEl, listEl); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();