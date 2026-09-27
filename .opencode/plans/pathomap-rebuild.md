# PathoMap — Final Plan

## What the site is

**A browsable database, plus visualisations built from SQL and Python.** No
eagerness, no help section, no import pipeline. The curated 54-pathogen SQLite
dataset is the product; the charts are the evidence that it can be queried and
analysed.

**Locked decisions:** delete the import system entirely · remove Help &
Glossary entirely · keep the Host Proteome Explorer as its own section · R
analysis stays in the repo, off the site · the ecology / genome / pangenome
vision is **not built** and lives on in `ROADMAP.md` as future work.

## The site after this work

| Section | Status |
|---|---|
| **Database** | **New — the centrepiece.** Sortable/searchable tables for all five entities. |
| Proteome | Kept, unchanged — a curated view over one of the database's tables. |
| Dataset Overview | Kept — 3 Chart.js charts. |
| Interaction Network | Kept — D3 bipartite graph. |
| Proteome / Hosts | Kept — 72-protein searchable grid. |
| Phagosome Timeline | Kept. |
| Machine Learning | Kept — PCA, UMAP, classifier CV. |
| Phylogeny | Kept — relabel explicitly as an *effector* phylogeny. |
| ~~My Data~~ | **Deleted.** |
| ~~Toolkit~~ | **Section deleted**, but its unique tools were kept: Stage Predictor → Trafficking, Strategy Predictor → ML, hubs chart → Network. The All Pathogens effector explorer and host-protein full-table view were dropped as duplicates. |
| ~~Help & Glossary~~ | **Deleted.** |
| ~~Inspiration~~ | Demoted to an About block in the footer. |

---

## Task 1 — Delete the dead weight

**Files:** `js/my-data.js` (1,796 lines), `js/csv-utils.js`, `js/stats.js`,
`js/glossary.js` — about 134 KB and four `<script>` tags gone from every load.

**Before deleting `csv-utils.js`,** inline its one real dependency:
`js/script.js:695` calls `CSVUtils.splitTargets()` to split `host_target`
strings on `/` and `and`. It is six lines — move it into `script.js`.

**Un-gate every section.** `my-data.js:_setContentVisible()` is what hides the 9
`data-gated` sections. Remove `data-gated` and `style="display:none"` from all
of them, drop the `nav-data` class from nav items, and call `initToolkit` from
`DOMContentLoaded` instead of from the import layer. This also fixes the
first-impression problem: the site currently shows nothing until you click a
preset.

**Straighten out the data source.** The curated 54 currently flows *through* the
import path — `loadDataPreset('curated')` → `applyImportedPathogens(kind:"curated")`
→ `_pathogenSource` — so the site treats its own data as "imported" and needs a
"Reset to no data" button. Delete `_pathogenSource`, `applyImportedPathogens()`,
`resetCuratedPathogens()`, `_updatePathogenSourceBanner()`, the
`pathomap_mydata` localStorage key, and collapse `_sourceList()` /
`_sourceEffectors()` to read `TOOLKIT_DATA` directly. They already fall back to
it, so the indirection is pure overhead.

**Prune the API:** remove `/api/mydata/pca`, `/api/mydata/umap`,
`/api/mydata/predict-strategy` and the `MatrixRequest` / `StrategyRequest`
schemas from `api/index.py`. Keep `/api/enrichment/*`.

**Accept:** the numeric analysis surface dies with it — Statistics,
Correlation, Clusters, Regression, Histograms, Heatmap and Differential
Expression were import-only. Stated intent.

---

## Task 2 — Add interactions to the offline data (blocker)

**The 150 `effector_targets` rows are in SQLite and the API but *not* in
`data/fallback.json` or `js/data.js`.** The database page cannot show an
Interactions table offline until this is fixed.

Add to `scripts/export_fallback_json.py` a query joining `effector_targets` →
`effectors` → `pathogens` and → `host_proteins`, emitting name-resolved rows:

```
{ effector, pathogen, host_protein, interaction_type }
```

Then add the key to the `data` dict, and to `js/data-loader.js:61-72` where each
`TOOLKIT_DATA` field is assigned. Regenerate via
`python scripts/export_fallback_json.py`.

---

## Task 3 — Build the database page

One section, five entity tables, reading from `TOOLKIT_DATA`:

| Table | Rows | Columns |
|---|---|---|
| Pathogens | 54 | name, species, gram_stain, strategy, description, n_effectors, reference |
| Effectors | 250 | pathogen, name, type, host_target, mechanism |
| Host Proteins | 72 | name, full_name, function, localization, pathway |
| Interactions | 150 | effector, pathogen, host_protein, interaction_type |
| Maturation Stages | 5 | name, time_range, ph_min, ph_max, description |

**Behaviour:** click a table name or a tab to switch; per-column sort
click-to-toggle; one search box filtering across the visible table's text
columns; row count shown; sticky header. Paginate only if a table needs it —
250 rows renders fine without.

**Build on what exists rather than starting over.** `#all-pathogens` already has
search + strategy/gram filters, `#proteome` is already a searchable grid, and the
Pathogen Explorer card already renders an effectors table. Generalise and reuse
that markup and filtering logic; the new page is the union of them with sorting
added, not a new pattern.

**Relationship to the Proteome section, which stays:** the database page is the
raw table; Proteome is the curated, filterable view of one of those tables
(pathway and localisation facets). Redundant by design, and worth keeping both —
but if it reads as duplication in the finished page, Proteome is the one to fold
in, since the database table already covers it.

**Relate it to SQL visibly.** Each table is the result of one `SELECT`. Showing
the query that produced each table is a small, honest way to make the SQL part of
the project legible to a visitor, and it doubles as documentation.

---

## Task 4 — Fix the fabricated ML predictions

**`ml_predictions` in the offline data is not a prediction at all.** From
`scripts/export_fallback_json.py:99-118`:

```python
ml_preds.append({
    'pathogen': p['name'],
    'predicted': p['strategy'],   # the label, copied
    'actual': p['strategy'],      # the same label
    'confidence': conf            # MD5 hash of the name -> 0.50..0.79
})
```

The comment above it says so outright: *"use actual strategy as predicted with a
confidence."* So offline accuracy is 100% by construction and the confidence
figures are deterministic noise from a hash. The Strategy Predictor displays
this when the API is down, showing a confidently wrong answer.

This has to be fixed before the ML section can honestly be presented as
"Python learning". Two options:

- **Run the real model in the export** — `train_classifier` and
  `features_from_effectors` already exist in
  `src/hostpathogen/ml/classifier.py`, and `/api/ml/predict/{name}` already
  serves genuine predictions. Emit real predicted class and real probability.
- **Or delete the Strategy Predictor card** and keep only PCA, UMAP and the
  classifier CV comparison, which *are* genuine (`compare_classifiers()` and
  `pathogen_feature_pca()` are really called).

Recommend the first. Note that `classifier_comparison` and `ml_pca` are already
real — the problem is confined to `ml_predictions`.

---

## Task 5 — Known bugs, cheap to fix

- **`Dockerfile` is broken.** Copies a root `requirements.txt` that does not
  exist, and runs `api.main:app` when the module is `api/index.py`.
  `docker compose up` cannot work.
- **`pyproject.toml` declares `dependencies = []`** while `api/requirements.txt`
  holds the real pins. Two sources of truth, one of them empty.
- **~464 KB of unreferenced `img/` files**, including five organism icons
  (`icon-salmonella.svg`, `icon-listeria.svg`, `icon-legionella.svg`,
  `icon-mycobacterium.svg`, `icon-shigella.svg`) and `content-cutout.png`.
  Shipped on every request, referenced nowhere.
- **`notebooks/02-interactome-analysis.ipynb` fails on first run** — imports
  `plot_network`, which `hostpathogen.interactome` does not define.
- **README install instructions are wrong** — `pip install -r requirements.txt`
  with no such file.
- **R PNG outputs are not committed** (`r/data/` holds CSVs only). Fine if R is
  repo-only evidence; state that in the README so the gap looks deliberate.

---

## Task 6 — Docs

- **Rewrite `ROADMAP.md`.** Its §4 sideline log describes a system that will no
  longer exist. Keep the full PathoMap vision — ecology as the primary axis, the
  `niches` schema, genome/pangenome, sequence tools, organism-vs-organism
  compare — clearly marked as *not built, future work*. That is where the "keep
  eco" answer lives.
- **Update `README.md` and `ONBOARDING.md`** to describe a database browser, not
  an import pipeline. Both currently document features being deleted.
- **CHANGELOG entry** for the deletions and the database page.

---

## Order

| # | Task | Risk |
|---|---|---|
| 1 | Delete import + glossary | low — all 58 tests are Python-only, none touch JS |
| 2 | Add interactions to offline data | low — one query, one export regen |
| 3 | Build the database page | medium — the main build |
| 4 | Fix `ml_predictions` | low, but **do it before showing the ML section to anyone** |
| 5 | Known bugs | low |
| 6 | Docs | low |

## One open question

`hostpathogen` is still the import package name in `pyproject.toml` (I renamed
the *distribution* to `pathomap` in the rebrand, so they no longer match).
Cosmetic, but do it as its own commit or leave it alone?
