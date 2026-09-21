# Onboarding Guide

A walkthrough of the Host–Pathogen Trafficking Hub codebase. This guide is for
anyone — biologist or developer — who wants to understand how the project is
structured, what each piece does, and how to work with it.

---

## 1. What This Project Is

An analysis toolkit and educational resource about **phagosome maturation** and
how intracellular pathogens subvert it. It covers ~54 pathogens, ~250 effector
proteins, and ~72 host proteins, organised around five evasion strategies:

| Strategy | What the pathogen does | Example |
|---|---|---|
| **Arrest** | Blocks phagosome maturation at an early stage | *Mycobacterium tuberculosis* |
| **Escape** | Lyses the phagosome and replicates in the cytosol | *Listeria monocytogenes*, *Shigella flexneri* |
| **Modified compartment** | Creates a non-degradative vacuole | *Salmonella enterica* (SCV) |
| **Reroute** | Redirects vesicular traffic to build a different compartment | *Legionella pneumophila* (LCV) |
| **Extracellular** | Resists phagocytosis entirely | *Yersinia pestis* |

Beyond the curated 54, the site is a **bioinformatics toolkit**: the **My Data**
panel imports your own pathogens, effectors, or numeric matrices (CSV/TSV/JSON
or pasted text) and runs stats, PCA, clustering, OLS, enrichment, and network
analysis client-side. Importing a dataset switches the All Pathogens grid,
Network, and ML sections to the imported data (resumable back to curated).

The page also ships several always-available modules built on the curated data:
a **Dataset Overview** (effector counts, phagosome pH by stage,
evasion-strategy distribution), an interactive **Phagosome Maturation Timeline**,
a searchable **Gene & Protein Explorer** over the curated host proteome, and a
**Help & Glossary** section (`js/glossary.js`). Numeric My Data imports add
**Compare**, **Heatmap**, and **Differential Expression** tabs; host-pathogen
imports gain a pathway **Enrichment** dot plot.

The project surfaces its data through four layers: a static website, a REST
API, a Python package, and R/Jupyter analyses.

---

## 2. Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    Static Frontend                       │
│  index.html + css/ + js/  (Chart.js, D3 v7)             │
│  Runs on: Vercel CDN (or file:// offline)                │
├─────────────────────────────────────────────────────────┤
│                    REST API (FastAPI)                     │
│  api/index.py  →  ~20 endpoints                         │
│  Runs on: Vercel serverless (/api/*) or local uvicorn    │
├─────────────────────────────────────────────────────────┤
│                    Python Package                         │
│  src/hostpathogen/  (trafficking, interactome, ML)       │
│  Runs on: pip install -e .                               │
├─────────────────────────────────────────────────────────┤
│                    Analysis Extras                        │
│  notebooks/ (Jupyter)  +  r/ (R scripts)                │
│  Runs on: Jupyter / RStudio                              │
└─────────────────────────────────────────────────────────┘
```

All four layers read from one SQLite database (`hostpathogen.db`), which is
built from curated CSV seed files and committed to the repo.

---

## 3. File & Directory Map

```
host-pathogen-tracker/
│
├── index.html                  Main frontend page (single-page app)
├── main.py                     Local dev server (FastAPI + static mounts)
├── vercel.json                 Vercel deployment config (rewrites, function settings)
├── pyproject.toml              Python package metadata (hostpathogen v0.3.0)
├── Dockerfile / docker-compose.yml  Containerised API deployment
├── glossary.md                 Domain glossary (biology + computational terms)
├── ONBOARDING.md               This file
│
├── api/
│   ├── index.py                Single FastAPI app — all ~20 endpoints
│   └── requirements.txt        Pinned deps for Vercel serverless bundle
│
├── src/hostpathogen/           Installable Python package
│   ├── data/
│   │   ├── loader.py           Thread-local SQLite connection + query/to_df helpers
│   │   ├── build_db.py         Schema DDL + CSV→SQLite loader
│   │   ├── export_r.py         Exports DB tables to R-friendly CSVs
│   │   ├── hostpathogen.db     Pre-built SQLite database (committed)
│   │   └── seed/               Source CSVs (pathogens, effectors, host_proteins, etc.)
│   ├── trafficking.py          PhagosomeMaturation state machine (5-stage model)
│   ├── interactome.py          Bipartite NetworkX graph + centrality analysis
│   ├── enrichment.py           Hypergeometric over-representation test
│   └── ml/
│       ├── classifier.py       RandomForest strategy predictor (11 features)
│       ├── dimred.py           PCA + UMAP dimensionality reduction
│       └── phylogenetics.py    MSA + neighbour-joining tree builder
│
├── js/
│   ├── data.js                 Embedded TOOLKIT_DATA (offline-first payload)
│   ├── data-loader.js          API fetcher with file:// fallback
│   ├── charts.js               Chart.js visualisations (bar, radar, timeline);
│   │                           Dataset Overview charts re-render on preset load
│   ├── network.js              D3 v7 force-directed interactome graph
│   ├── phylogeny.js            Newick→SVG phylogenetic tree renderer
│   ├── ml-plots.js             PCA/UMAP scatter plots (curated + imported)
│   ├── script.js               Toolkit init/rendering (All Pathogens grid, Gene &
│   │                           Protein Explorer, maturation timeline, source-aware
│   │                           re-runs), dark mode, mobile nav
│   ├── stats.js                Client-side stats, PCA, clustering, OLS, Welch
│   │                           t-test, BH FDR, z-score heatmap helpers, enrichment
│   ├── csv-utils.js            Import schema detection + CSV/TSV normalization
│   ├── my-data.js              My Data panel: file/paste/preset import, dataset
│   │                           state, template downloads, localStorage cache, and
│   │                           the Compare / Heatmap / DEG / enrichment tabs
│   ├── glossary.js             Help & Glossary section (quick-start, FAQ, searchable terms)
│   └── chart.umd.min.js        Vendored Chart.js (offline fallback)
│
├── css/style.css               Site styling (dark mode, responsive)
├── img/                        Pathogen icons, favicon
│
├── data/
│   ├── fallback.json           Full DB export for offline frontend use
│   └── charts/                 Pre-computed chart JSON datasets
│
├── notebooks/
│   ├── 01-sql-exploration.ipynb
│   ├── 02-interactome-analysis.ipynb
│   ├── 03-evasion-classifier.ipynb
│   └── 04-advanced-ml.ipynb
│
├── r/
│   ├── deseq2-analysis.R       Differential expression (DESeq2)
│   ├── enrichment.R            Pathway over-representation in R
│   ├── visualizations.R        Publication-quality ggplot2 figures
│   ├── export_chart_data.R     Python DB → R CSVs
│   ├── report.Rmd              R Markdown report
│   └── data/                   Generated CSVs, FASTA, Newick tree
│
├── scripts/
│   ├── export_fallback_json.py  DB → data/fallback.json + data.js
│   └── refresh_data.py          Pull from PHI-base/UniProt/IntAct
│
└── tests/                      pytest suite (7 test files)
    ├── test_api.py
    ├── test_trafficking.py
    ├── test_interactome.py
    ├── test_enrichment.py
    ├── test_classifier.py
    ├── test_dimred.py
    └── test_data_loader.py
```

---

## 4. The Database

All data lives in one SQLite file: `src/hostpathogen/data/hostpathogen.db`.

### Tables and relationships

```
pathogens ──────< effectors ──────< effector_targets >────── host_proteins
    │                                                         │
    │                                                         │
    └──── maturation_stages ──────< stage_markers >───────────┘
```

| Table | Rows | Key columns | What it stores |
|---|---|---|---|
| `pathogens` | ~54 | name, species, gram_stain, strategy | One row per pathogen |
| `effectors` | ~250 | name, type, host_target, mechanism | One row per effector protein |
| `host_proteins` | ~72 | name, full_name, function, pathway | One row per host protein |
| `effector_targets` | ~154 | effector_id, host_protein_id, interaction_type | Which effector targets which host protein |
| `maturation_stages` | 5 | name, stage_order, ph_min, ph_max | The 5 maturation stages |
| `stage_markers` | ~40 | stage_id, host_protein_id, presence (0/1) | Which markers are present at each stage |

### Seed CSVs

The source data lives in `src/hostpathogen/data/seed/`:

- `pathogens.csv` — pathogen metadata
- `effectors.csv` — effector names, types, targets, mechanisms
- `host_proteins.csv` — host protein names, functions, pathways
- `effector_targets.csv` — effector→host_protein links
- `maturation_stages.csv` — the 5 stages with pH ranges
- `stage_markers.csv` — marker presence/absence per stage
- `generate_seed_data.py` — script to generate synthetic seed data

---

## 5. Data Pipeline

Data flows in one direction: **CSV → SQLite → exports**.

```
seed/*.csv
    │
    ▼
build_db.py  ──────────>  hostpathogen.db  (committed to repo)
    │                         │
    │                         ├──> export_fallback_json.py  →  data/fallback.json
    │                         │                          →  js/data.js (TOOLKIT_DATA)
    │                         ├──> export_chart_data.R     →  r/data/*.csv
    │                         └──> Python package (loader.py reads DB directly)
    │
    └── refresh_data.py  (optional: pulls from PHI-base, UniProt, IntAct)
```

### Rebuilding the database

```bash
# 1. Rebuild from seed CSVs
python src/hostpathogen/data/build_db.py

# 2. Regenerate frontend fallback data
python scripts/export_fallback_json.py

# 3. Regenerate R data exports
Rscript r/export_chart_data.R

# 4. Full refresh (includes optional external fetches)
python scripts/refresh_data.py --fetch-all
```

The database is committed so Vercel can ship it inside the serverless bundle
(`vercel.json` includes `src/**`). The `data/fallback.json` and `js/data.js`
are also committed so the frontend works fully offline.

---

## 6. Python Package (`src/hostpathogen/`)

Install with `pip install -e .` — the package is called `hostpathogen`.

### `data/loader.py`

The data access layer. Provides two functions:

- `query(sql, params)` — returns `list[sqlite3.Row]`
- `to_df(sql, params)` — returns a `pandas.DataFrame`

Uses **thread-local connection pooling** so each thread reuses one SQLite
connection without explicit close/open overhead.

### `trafficking.py`

The `PhagosomeMaturation` class models phagosome maturation as a **state
machine** with 5 stages. Given a list of molecular markers (e.g.
`["Rab5", "EEA1", "PI3P"]`), it:

1. Matches the marker set against pre-computed stage profiles
2. Returns the most likely stage name
3. Provides `stage_info()` with pH range, time range, markers present/absent,
   and which pathogens are active at that stage
4. `trajectory()` predicts the full maturation path from a time series of
   marker snapshots

### `interactome.py`

Builds a **bipartite NetworkX graph** from `effector_targets`:

- Nodes prefixed `E:` (effectors) and `H:` (host proteins)
- Edges represent effector→host_target interactions
- Provides: `hub_targets(top_n)` for centrality ranking, `network_stats()`
  for graph metrics, `pathogen_subgraph(name)` for per-pathogen extracts

### `enrichment.py`

Tests whether a set of host proteins is enriched for a specific pathway using
the **hypergeometric distribution** (Fisher's exact test equivalent). Corrects
for multiple testing with Bonferroni. Two entry points:

- `targeted_pathways_by_pathogen(name)` — enrichment for all pathways given a
  pathogen's effector targets
- `overrepresentation_analysis(protein_list)` — custom enrichment query

### `ml/classifier.py`

A **RandomForest classifier** that predicts a pathogen's evasion strategy from
11 effector-derived features (n_effectors, n_targets, n_T3SS, n_T4SS, etc.).

- `extract_features()` — builds the feature matrix (54 pathogens × 11 features)
- `train_classifier()` — trains on all data, returns (model, report)
- `compare_classifiers()` — LOOCV across 4 classifiers (RF, SVM, KNN, Logistic)
- `cross_validate_rf()` — detailed RF cross-validation report
- `grid_search_rf()` — hyperparameter tuning

### `ml/dimred.py`

Dimensionality reduction on two data types:

- **Host expression data**: PCA and UMAP on simulated RNA-seq (from `r/data/deseq2_counts.csv` or random fallback)
- **Pathogen effector features**: PCA on the 11-feature matrix to visualise strategy clustering

### `ml/phylogenetics.py`

A bioinformatics pipeline:

1. Generates or fetches effector protein sequences (synthetic by default, real
   via UniProt)
2. Performs multiple sequence alignment (Biopython `MultipleSeqAlignment`)
3. Builds a neighbour-joining tree (`DistanceTreeConstructor`)
4. Returns Newick format for frontend rendering

---

## 7. Frontend (`js/`, `css/`, `index.html`)

The frontend is a **single-page app** that works fully offline.

### How offline-first works

1. `js/data.js` contains a `TOOLKIT_DATA` object with all pathogens, effectors,
   host proteins, stages, and pre-computed ML results — embedded at build time
2. `js/data-loader.js` tries to `fetch()` from the API first; if that fails
   (e.g. `file://` or no server), it falls back to `TOOLKIT_DATA`
3. All charts, graphs, and visualisations read from `TOOLKIT_DATA`

### Key JS files

| File | What it does |
|---|---|
| `data.js` | `TOOLKIT_DATA` — the embedded offline dataset |
| `data-loader.js` | API fetcher with `file://` fallback (also loads `data/fallback.json`) |
| `charts.js` | Chart.js bar charts, radar plots, strategy breakdowns, Dataset Overview charts; destroys stale instances before re-rendering on preset reload |
| `network.js` | D3 v7 force-directed graph of effector→host interactions |
| `phylogeny.js` | Parses Newick strings and renders SVG trees |
| `ml-plots.js` | PCA/UMAP scatter plots (curated and imported data) |
| `script.js` | Toolkit bootstrap (`initToolkit`) and All Pathogens grid, Gene & Protein Explorer, maturation timeline; dark mode, mobile nav, smooth scroll |
| `stats.js` | Client-side math for My Data: summary stats, PCA, clustering, OLS, Welch t-test, Benjamini–Hochberg FDR (`bhAdjust`), z-score helpers, enrichment, adjacency/network |
| `csv-utils.js` | Detect dataset mode (host-pathogen, numeric, host-proteins) and normalize CSV/TSV/JSON rows |
| `my-data.js` | My Data panel: file/paste/preset import, `MyDataApplyImported` wiring, template downloads, `localStorage` cache (`hphub_mydata`), and the numeric Compare / Heatmap / Differential Expression tabs plus the host-pathogen enrichment dot plot |
| `glossary.js` | Help & Glossary section: quick-start steps, FAQ, searchable glossary rendered into `#help-content` |

### My Data & import flow

1. The user loads a dataset in **My Data**: CSVs/TSVs/JSON files, pasted text,
   or a bundled preset. `csv-utils.js` classifies it as *effector records*,
   *pathogen profiles* (no effector column), or a *numeric matrix*.
2. `my-data.js` stores parsed rows in `localStorage` (`hphub_mydata`) and calls
   `MyDataApplyImported` (defined in `script.js`), which sets the active dataset
   for the All Pathogens grid and re-runs Network/ML sections (`refreshNetworkSection`,
   `refreshMlSection`) through shared source getters (`_sourceList`, `_sourceEffectors`).
3. With no import, everything renders the curated 54. An "Imported data in use"
   banner offers a reset back to curated, and `clearMyData` restores it.
4. Client-side analysis runs in `stats.js` (PCA via a Jacobi-style eigen solver,
   clustering, OLS, enrichment). ML/UMAP for imported pathogen profiles call
   `POST /api/mydata/umap` when the API is reachable; the curated ML model remains
   available for the built-in dataset.
5. Imported datasets open a tabbed panel. Host-pathogen data gets Overview,
   Effectors, Network, Hubs, Stage Map, Enrichment (hypergeometric + Bonferroni,
   with a gene-ratio dot plot), Strategy (ML), and Effector PCA tabs. Numeric
   data gets Overview, Statistics, Correlation, PCA, Clusters, Regression,
   Histograms, Compare (two-sample Welch t-test with box plots), Heatmap
   (per-row z-scores), and Differential Expression (log2-fold change + BH FDR,
   volcano and MA plots, top-gene heatmap) tabs. Load the bundled presets to see
   every tab populated.

### External libraries (CDN with local fallback)

- **Chart.js v4.4.7** — for bar/radar/timeline charts
- **D3 v7** — for the interactome network and phylogeny tree

---

## 8. API Endpoints

The FastAPI app at `api/index.py` exposes ~25 endpoints. Interactive docs at
`/docs` when running locally.

| Domain | Endpoints | What they do |
|---|---|---|
| **Pathogens** | `GET /api/pathogens`, `GET /api/pathogens/{name}`, `GET /api/pathogens/{name}/effectors` | List/get pathogens and their effectors |
| **Effectors** | `GET /api/effectors?pathogen=` | List all effectors, optionally filtered |
| **Host proteins** | `GET /api/host-proteins`, `GET /api/host-proteins/{name}` | List/get host protein details + who targets them |
| **Trafficking** | `GET /api/trafficking/stages`, `POST /api/trafficking/predict-stage`, `POST /api/trafficking/trajectory` | Maturation stages, stage prediction from markers |
| **Interactome** | `GET /api/interactome/stats`, `GET /api/interactome/hubs`, `GET /api/interactome/pathogen/{name}` | Network stats, hub proteins, per-pathogen subgraph |
| **Enrichment** | `GET /api/enrichment/pathogen/{name}`, `POST /api/enrichment/overrepresentation` | Pathway enrichment analysis |
| **ML** | `GET /api/ml/predict/{name}`, `GET /api/ml/pca`, `GET /api/ml/umap`, `GET /api/ml/pathogen-pca`, `GET /api/ml/phylogeny`, `GET /api/ml/compare-classifiers`, `GET /api/ml/cross-validate`, `GET /api/ml/grid-search`, `GET /api/ml/features` | Strategy prediction, dimensionality reduction, phylogeny |
| **My Data** | `POST /api/mydata/predict-strategy`, `POST /api/mydata/pca`, `POST /api/mydata/umap` | Stats/PCA/UMAP on uploaded matrices (used when My Data has a numeric dataset) |
| **Stats** | `GET /api/stats`, `GET /api/search`, `GET /api/bootstrap` | Database summary, search, full data dump |

The API caches the NetworkX graph and trained RandomForest model in module
globals for warm-start performance in Vercel's serverless environment.

---

## 9. R Analysis Pipeline

The `r/` directory contains standalone R scripts that mirror and extend the
Python analysis:

| Script | What it does |
|---|---|
| `deseq2-analysis.R` | Differential expression analysis on simulated RNA-seq counts using DESeq2 |
| `enrichment.R` | Pathway over-representation via hypergeometric test (mirrors Python `enrichment.py`) |
| `visualizations.R` | Volcano plots, heatmaps, hub protein bar charts, effector counts (ggplot2 + pheatmap) |
| `export_chart_data.R` | Exports DB tables to CSVs in `r/data/` for R consumption |
| `report.Rmd` | R Markdown report combining all analyses |

The R scripts read from `r/data/`, which is populated by `export_chart_data.R`
or `export_r.py`. The `deseq2_counts.csv` generated here feeds back into the
Python `dimred.py` module for PCA/UMAP.

---

## 10. Running the Project

### Static site only (no API)

```bash
python -m http.server 8000
# Visit http://localhost:8000
```

Or just open `index.html` directly in a browser (uses embedded `TOOLKIT_DATA`).

### Full stack with uvicorn (local dev)

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -e ".[dev]"
uvicorn main:app --reload      # http://localhost:8000
```

### Docker

```bash
docker compose up              # http://localhost:8000
```

### Vercel (production)

Push to the connected Git repo. Vercel serves static assets from CDN and
routes `/api/*` to the serverless function.

---

## 11. Development Setup

```bash
# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows (source .venv/bin/activate on Unix)

# 2. Install package + dev dependencies
pip install -e ".[dev]"

# 3. Run tests
pytest

# 4. Run tests with verbose output
pytest -v
```

The test suite (`tests/`) covers all major modules: API endpoints, trafficking
state machine, interactome graph, enrichment math, classifier features, PCA
dimensionality reduction, and data loader.

---

## 12. Common Tasks

### Add a new pathogen

1. Add a row to `src/hostpathogen/data/seed/pathogens.csv`
2. Add its effectors to `src/hostpathogen/data/seed/effectors.csv`
3. Add effector→host_protein links to `src/hostpathogen/data/seed/effector_targets.csv`
4. Rebuild: `python src/hostpathogen/data/build_db.py`
5. Rebuild frontend: `python scripts/export_fallback_json.py`

### Analyse your own data (My Data)

1. Open the **My Data** panel on the site and either drag in a CSV/TSV/JSON,
   paste a table, or choose a preset
2. Host–pathogen tables need a pathogen column (e.g. `name`/`pathogen`); effectors
   can follow with `name`, `type`, `host_target`, `mechanism`. Columns like
   `species`, `gram_stain`, `strategy`, `description`, `reference` are detected
   automatically (`csv-utils.js`)
3. The All Pathogens grid, Network, and ML sections switch to the imported data
   (banner + reset to curated); a tabbed panel runs per-mode analyses. Numeric
   datasets unlock Statistics, Correlation, PCA, Clusters, Regression, Histograms,
   Compare (t-test), Heatmap (z-scores), and Differential Expression tabs;
   host-pathogen datasets unlock Network, Hubs, Stage Map, Enrichment, Strategy,
   and Effector PCA tabs.

### Add a new effector

1. Add a row to `src/hostpathogen/data/seed/effectors.csv` with the pathogen name
2. Add target links to `src/hostpathogen/data/seed/effector_targets.csv`
3. Rebuild DB and frontend (same as above)

### Add a new API endpoint

1. Open `api/index.py`
2. Add a new route function using FastAPI decorators (`@app.get(...)` or `@app.post(...)`)
3. Use `hostpathogen.data.loader.query()` or `to_df()` for data access
4. Add a test to `tests/test_api.py`
5. Update `main.py` dashboard HTML if the endpoint is user-facing

### Add a new frontend chart

1. Add data preparation logic to `TOOLKIT_DATA` in `scripts/export_fallback_json.py`
2. Rebuild: `python scripts/export_fallback_json.py`
3. Create a new section in `index.html`
4. Add rendering logic in `js/charts.js` (or a new JS file)
5. Load Chart.js/D3 if needed

### Add a new Python module

1. Create the module under `src/hostpathogen/`
2. Import from `hostpathogen.data.loader` for database access
3. Add functions that the API can call
4. Add tests to `tests/test_<module>.py`
5. Import and wire up in `api/index.py`

---

## 13. Notebook Walkthroughs

| Notebook | What it covers |
|---|---|
| `01-sql-exploration.ipynb` | Direct SQL queries against the database — exploring pathogens, effectors, host proteins, and stage markers |
| `02-interactome-analysis.ipynb` | Building the bipartite graph, centrality analysis, identifying hub host proteins |
| `03-evasion-classifier.ipynb` | Feature extraction, training the RandomForest, evaluation, confusion matrix |
| `04-advanced-ml.ipynb` | PCA, UMAP, phylogenetic tree building, classifier comparison |

All notebooks import from the installed `hostpathogen` package and read from
the committed `hostpathogen.db`.
