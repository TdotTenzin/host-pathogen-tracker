# Host–Pathogen Trafficking Hub

A bioinformatics toolkit for molecular cell biology and host–pathogen
interactions: one curated SQLite dataset (~54 pathogens, ~250 effectors,
~72 host proteins) plus a bring-your-own-data (My Data) pipeline for
analysing your own pathogen profiles, effectors, or numeric matrices.
Surfaced through four layers:

| Layer | Location | Runs on |
|---|---|---|
| Static frontend | `index.html`, `css/`, `js/` | Vercel CDN (offline-first; embeds `data/fallback.json`) |
| REST API | `api/index.py` (FastAPI) | Vercel serverless (`/api/*`), locally via uvicorn |
| Python package | `src/hostpathogen/` | pip (`pip install -e .`) |
| Analysis extras | `notebooks/`, `r/`, `scripts/` | Jupyter / R |

## Quickstart

**Static site only** — open `index.html` directly, or serve it:

```
python -m http.server 8000   # then visit http://localhost:8000
```

The frontend is fully offline-capable (embeds `data/fallback.json`). Load the
**Curated dataset (54 pathogens)** preset or import your own data in **My Data**
(CSV/TSV/JSON or pasted text) — sections appear once data is loaded and switch
to your imported dataset when you bring your own. Basic stats, PCA, clustering,
OLS, and network analysis run client-side; ML/UMAP fall back to the API.

Additional built-in sections ship with the toolkit: a **Dataset Overview**
(effector counts, phagosome pH by stage, strategy distribution), an
interactive **Phagosome Maturation Timeline**, a searchable **Gene &
Protein Explorer** of the curated host proteome, and a **Help & Glossary**
page. In **My Data**, numeric datasets unlock a **Compare** tab (group
summary + box plots + Welch t-test) and a z-scored **Heatmap** tab, plus a
**Differential Expression** tab with BH-FDR-corrected p-values, volcano/MA
plots, and a top-gene heatmap; host-pathogen datasets include a pathway
**Enrichment** tab with dot plot.

**Full stack (API + frontend)** — either:

```
docker compose up            # http://localhost:8000
```

or:

```
pip install -r requirements.txt
uvicorn main:app --reload    # http://localhost:8000
```

The FastAPI app serves the static site itself in local/Docker mode; on Vercel
the CDN serves static assets and only `/api/*` hits the function.

## Development setup

```
python -m venv .venv
.venv\Scripts\activate          # Windows  (source .venv/bin/activate on Unix)
pip install -e ".[dev]"
pytest
```

Dependencies are declared once in `pyproject.toml`; the root
`requirements.txt` mirrors them flat for Docker/Vercel.

## Data pipeline

Curated seed data → CSVs → SQLite → exports:

```
python src/hostpathogen/data/build_db.py      # builds src/hostpathogen/data/hostpathogen.db
python scripts/export_fallback_json.py        # regenerates data/fallback.json (offline toolkit data)
python scripts/refresh_data.py                # end-to-end refresh
Rscript r/export_chart_data.R                 # regenerates r/data/*.csv|.fasta|.nwk
```

`hostpathogen.db` is committed so Vercel can ship it inside the serverless
bundle (`vercel.json: includeFiles`). Regenerated artifacts under `data/` and
`r/data/` are also committed for the offline-first frontend.

## Project structure

```
api/            FastAPI app (Vercel entrypoint + local wrapper)
src/hostpathogen/
  data/         loader, build_db, export_r + committed SQLite DB
  ml/           classifier, dimred (PCA/UMAP), phylogenetics
  trafficking.py, interactome.py, enrichment.py
js/             Frontend logic (charts, offline toolkit, data loader, My Data
                imports, statistics + enrichment, glossary)
notebooks/      Jupyter walkthroughs (SQL, interactome, ML)
r/              R analyses + generated chart data
tests/          pytest suite
scripts/        Data build/export utilities
```

## API

Interactive docs at `/docs` when running locally. Key endpoints:
`/api/bootstrap`, `/api/pathogens`, `/api/effectors`,
`/api/trafficking/predict-stage`, `/api/interactome/hubs`, `/api/ml/predict/{name}`,
plus the My Data analysis endpoints `/api/mydata/pca` and
`/api/mydata/umap` (used by the ML section on imported data).

See `glossary.md` for the domain model (trafficking stages, strategies,
marker definitions).
