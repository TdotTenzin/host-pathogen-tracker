# Changelog

All notable changes to PathoMap are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [0.4.0] — 2026-09-27

### Added
- **Database section** (`js/database.js`): the five curated tables — Pathogens
  (54), Effectors (250), Host Proteins (72), Interactions (150), Maturation
  Stages (5) — as a tabbed, searchable, click-sortable browser with per-table row
  counts, CSV export, and the `SELECT` behind each table.
- `focusDatabaseForPathogen()` so the Organisms cards and the interaction
  network can send a pathogen to the Database.
- `GET /api/bootstrap` now returns `interactions` and a derived `n_effectors`
  count per pathogen, making the live and offline payloads the same shape.
- `interactions` added to `data/fallback.json` and the embedded `js/data.js`,
  which the Network section previously could not read offline.
- `out_of_fold_predictions()` in `src/hostpathogen/ml/classifier.py`, used by the
  data export to produce genuine held-out ML output.
- Frontend test coverage for the Database section: `tests/frontend/database_checks.js`
  runs the real `js/database.js` in a headless Node sandbox (55 assertions on
  normalisation, row counts, filtering, sorting, CSV export, and cell escaping),
  wired into pytest via `tests/test_frontend_js.py`. Also added a syntax check
  over every shipped script and a guard against deleted scripts reappearing in
  `index.html`. Suite is now 74 tests.
- 3 new classifier tests.

### Fixed
- **The offline ML predictions were fabricated.** `export_fallback_json.py`
  copied the true label into `predicted` and derived `confidence` from an MD5
  hash, so the Strategy Predictor reported 100% accuracy and only 10 distinct
  confidences. Predictions are now out-of-fold model output: 20/54 correct
  (37.0%) across 45 distinct confidence values.
- `extract_features()` indexed rows by positional integer instead of pathogen
  name, so `cross_validate_rf()` mislabelled the reported species in its
  confusion matrix.
- `notebooks/02-interactome-analysis.ipynb` imported `plot_network` from
  `hostpathogen.interactome`, which does not exist — the notebook failed on its
  first cell. The plotting cell is replaced with a pointer to the site's
  interactive network.
- `Dockerfile` installed from a root `requirements.txt` that does not exist, and
  did not copy `data/`, so a built image failed at startup.
- `pyproject.toml` declared no runtime dependencies.
- The interaction network caption claimed one edge per interaction; 150 records
  collapse to 135 distinct edges because a few effector–protein pairs repeat.
- CSV export of any table with a numeric column threw a `TypeError`: values were
  passed to `.replace()` without stringifying, so `n_effectors` and `pH` columns
  produced a download that failed instead of a file. Zeroes were also blanked by
  a `v || ""` fallback.
- Long text cells in the Database tables were truncated *before* HTML escaping,
  so a value containing markup was injected unescaped into the table body.
  Truncated values now end in `…` to distinguish them from complete values.

### Removed
- **Data import** and the entire My Data utility layer: `js/my-data.js`,
  `js/csv-utils.js`, `js/stats.js`, and the Compare / Heatmap / Differential
  Expression / Correlation / Regression tools that depended on them. The
  curated 54 pathogens are the product; there is no import path.
- **Help & Glossary page** and `js/glossary.js`. `glossary.md` is retained as a
  domain reference document.
- The `#toolkit` section, the All Pathogens effector explorer, and the
  host-protein full-table view. Unique capabilities were preserved by moving the
  Stage Predictor into Trafficking, the Strategy Predictor into Machine Learning,
  and the hubs chart into Network.
- `/api/mydata/*` endpoints (`predict-strategy`, `pca`, `umap`) and their unused
  request models and constants.
- `img/content-cutout.png` (447 KB) and 10 unreferenced pathogen/process icon SVGs.
  `img/` now holds only `favicon.svg` and `icon-telescope.svg`, both still
  referenced by the page.

### Changed
- The curated dataset is now loaded directly from `TOOLKIT_DATA`. Every section
  is always available — sections no longer appear only after a data load, and
  the "imported data in use" banner is gone.
- `data-loader.js` skips the network request entirely on `file://` and merges
  live bootstrap data over the embedded payload otherwise.
- R analyses (`r/`) are explicitly repository-only and are not surfaced on the
  site.
- Rebranded to PathoMap (*Microbial Genomics, Hosts & Ecology*). The
  project outgrew the "Host-Pathogen Tracker" framing: it now presents a
  central research question — *how are microbial genomes, biological
  interactions, evolution, and ecological environments connected?* — with the
  effector/host-protein interaction network as the currently-shipping layer
  and the genome, pangenome and ecology layers on the roadmap.
- Page title, nav brand, hero, footer, help copy and `glossary.js` strings
  rebranded. Hero now states explicitly which layers are live and which are
  planned, so the site does not overclaim genomic content it does not have.
- **Navigation restructured** around the PathoMap sections: Organisms,
  Network, Proteome and Phylogeny lead; the Analysis Tools, ML and My Data
  entries are demoted behind a separator at reduced opacity and relabelled as
  utility, per `ROADMAP.md` §4.
- `pyproject.toml` package renamed `hostpathogen` → `pathomap`, version 0.4.0.
- `My Data` localStorage cache key `hphub_mydata` → `pathomap_mydata`.
  **Breaking for returning visitors:** any previously imported dataset held in
  the old key is ignored and must be re-imported once.

### Added
- **`ROADMAP.md`**: PathoMap target architecture, an honest per-section status
  table (Explore, Organisms, Host–Pathogen Network, Genome Explorer, Pangenome,
  Phylogeny, Ecology, Sequence Tools, Compare), seven proposed workstreams, a
  sideline log of deliberately deferred work, and outstanding bugs — including
  the broken `Dockerfile`, the unreferenced ~464 KB in `img/`, and
  `notebooks/02-interactome-analysis.ipynb` importing a nonexistent
  `plot_network`.

## [Unreleased]

### Added
- **Dataset Overview section**: three previously orphaned charts (effectors per
  pathogen, phagosome pH by maturation stage, and evasion-strategy distribution)
  are now wired into the page as a dedicated section re-rendered whenever the
  curated dataset is loaded.
- **Maturation Timeline section**: interactive phagosome-maturation tour with
  per-stage molecular markers, cellular changes, and representative pathogens.
  The stage buttons are now built from `timelineData` in `js/script.js`.
- **Gene & Protein Explorer**: searchable host-proteome cards with pathway and
  localization filters and per-protein pathogen/effector targeting statistics.
- **Help & Glossary section**: quick-start steps, FAQ, and a searchable,
  categorised glossary (`js/glossary.js`).
- **Compare tab** (My Data, numeric mode): per-group descriptive statistics,
  CSS box plots, and a Welch two-sample t-test for any response column split by
  a two-group categorical column.
- **Heatmap tab** (My Data, numeric mode): z-scored expression heatmap with
  feature/sample row orientation, variance or alphabetical ordering, and CSV
  download.
- **Differential Expression tab** (My Data, numeric mode): log2-transformed
  Welch t-test per gene with Benjamini–Hochberg FDR correction, volcano and MA
  plots, a results table with up/down badges, a z-scored heatmap of top genes,
  and CSV download.
- **Enrichment dot plot**: the host-pathogen Enrichment tab now shows a
  bubble/dot plot of pathway gene ratio vs. −log10(adjusted p-value).
- `Stats.bhAdjust()`, `Stats.variance()`, and `Stats.log2FoldChange()`
  helpers in `js/stats.js`.
- `umap_analysis()` convenience wrapper in `src/hostpathogen/ml/dimred.py`.

### Changed
- The page no longer auto-loads the curated 54-pathogen dataset on startup;
  structural data (maturation stages/markers) is loaded so the toolkit works,
  and the curation-backed sections populate once the **Curated dataset** preset
  is imported (`js/data-loader.js`).
- Alternated section background colours so new sections sit cleanly in the
  existing rhythm.
- Charts and the protein explorer re-render automatically when the curated
  preset is loaded or data is cleared.

### Fixed
- Timeline markup (`#maturation-timeline`, `#timeline-detail`) now exists in
  `index.html`, giving the existing `activateStage`/`closeTimeline` logic the
  DOM it previously expected.
- `rowNumeric()` in `js/my-data.js` indexed `state.rows` by row array instead
  of by numeric column lookup, breaking the Correlation, PCA, and Clusters tabs
  in My Data numeric mode ("Cannot read properties of undefined").
- `initCharts()` in `js/charts.js` re-created charts on canvases that already
  held a Chart.js instance, throwing "Canvas is already in use" whenever the
  curated preset was reloaded. Existing charts are now destroyed first.
- Local dev server now mounts `/data`, so `data/fallback.json` resolves instead
  of 404ing on http:// (it was only served on Vercel's static hosting).