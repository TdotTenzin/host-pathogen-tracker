# Host–Pathogen Trafficking Hub

An educational hub on phagosome maturation and how pathogens subvert it, built
around one curated SQLite dataset (~54 pathogens, ~250 effectors, ~72 host
proteins) surfaced through four layers:

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

**Full stack (API + frontend)** — either:

```
docker compose up            # http://localhost:8000
```

or:

```
pip install -r requirements.txt
uvicorn api.main:app --reload    # http://localhost:8000
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
js/             Frontend logic (charts, offline toolkit, data loader)
notebooks/      Jupyter walkthroughs (SQL, interactome, ML)
r/              R analyses + generated chart data
tests/          pytest suite
scripts/        Data build/export utilities
```

## API

Interactive docs at `/docs` when running locally. Key endpoints:
`/api/bootstrap`, `/api/pathogens`, `/api/effectors`,
`/api/trafficking/predict-stage`, `/api/interactome/hubs`, `/api/ml/predict/{name}`.

See `glossary.md` for the domain model (trafficking stages, strategies,
marker definitions).
