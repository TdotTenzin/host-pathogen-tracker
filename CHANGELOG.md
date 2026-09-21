# Changelog

All notable changes to the Host–Pathogen Trafficking Hub are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

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