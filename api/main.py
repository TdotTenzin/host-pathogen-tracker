"""
api/main.py — Local development server.

Imports the API app from api/index.py and adds static file
mounts for local development. Vercel uses api/index.py directly.
"""

from pathlib import Path

# Import the shared API app from the Vercel entry point
from api.index import app

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

BASE = Path(__file__).resolve().parent.parent

# Static file mounts — for local dev only (Vercel's CDN handles these in production)
app.mount("/css", StaticFiles(directory=str(BASE / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(BASE / "js")), name="js")
app.mount("/img", StaticFiles(directory=str(BASE / "img")), name="img")


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    """Serve the existing index.html site (local dev only)."""
    index_path = BASE / "index.html"
    if not index_path.exists():
        return HTMLResponse("<h1>index.html not found</h1>", status_code=404)
    return HTMLResponse(index_path.read_text(encoding="utf-8"))


# Re-register dashboard here (imported app doesn't have it)
@app.get("/dashboard", response_class=HTMLResponse, include_in_schema=False)
async def api_dashboard():
    return HTMLResponse(HTML_DASHBOARD)


HTML_DASHBOARD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Host-Pathogen API Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           background: #f8fafc; color: #1e293b; line-height: 1.6; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 1.75rem; margin-bottom: 8px; color: #0f172a; }
    h1 small { font-size: 0.9rem; font-weight: 400; color: #64748b; }
    p { color: #475569; margin-bottom: 24px; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.1);
            padding: 20px; margin-bottom: 16px; }
    .card h2 { font-size: 1.1rem; margin-bottom: 12px; color: #0f172a; }
    .card code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px;
                 font-size: 0.85rem; }
    .endpoint { padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex;
                align-items: center; gap: 12px; }
    .endpoint:last-child { border-bottom: none; }
    .method { font-weight: 600; padding: 2px 8px; border-radius: 4px;
              font-size: 0.75rem; text-transform: uppercase; min-width: 52px;
              text-align: center; }
    .get { background: #dbeafe; color: #1d4ed8; }
    .post { background: #dcfce7; color: #15803d; }
    .path { font-family: monospace; font-size: 0.9rem; color: #334155; }
    .desc { font-size: 0.85rem; color: #64748b; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer { text-align: center; color: #94a3b8; font-size: 0.85rem;
              padding: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Host-Pathogen Omics Explorer <small>API v0.1.0</small></h1>
    <p>REST API for host-pathogen interaction analysis. Data sourced from the curated <code>hostpathogen.db</code> SQLite database.</p>

    <div class="card">
      <h2>Pathogens</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/pathogens</span><span class="desc">List all pathogens</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/pathogens/{name}</span><span class="desc">Get pathogen details</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/pathogens/{name}/effectors</span><span class="desc">List effectors for a pathogen</span></div>
    </div>

    <div class="card">
      <h2>Effectors &amp; Host Proteins</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/effectors?pathogen=</span><span class="desc">List effectors (optional filter)</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/host-proteins</span><span class="desc">List all host proteins</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/host-proteins/{name}</span><span class="desc">Host protein details + targeting info</span></div>
    </div>

    <div class="card">
      <h2>Trafficking</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/trafficking/stages</span><span class="desc">Phagosome maturation stages with markers</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/trafficking/predict-stage</span><span class="desc">Predict stage from marker list</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/trafficking/trajectory</span><span class="desc">Predict trajectory from marker time series</span></div>
    </div>

    <div class="card">
      <h2>Interactome</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/interactome/stats</span><span class="desc">Network summary statistics</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/interactome/hubs?top_n=10</span><span class="desc">Top hub host proteins</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/interactome/pathogen/{name}</span><span class="desc">Pathogen subgraph (nodes + edges)</span></div>
    </div>

    <div class="card">
      <h2>Enrichment</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/enrichment/pathogen/{name}</span><span class="desc">Pathway enrichment for a pathogen</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/enrichment/overrepresentation</span><span class="desc">Custom enrichment from gene list</span></div>
    </div>

    <div class="card">
      <h2>Machine Learning</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/features</span><span class="desc">Feature matrix for all pathogens</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/predict/{pathogen_name}</span><span class="desc">Predict evasion strategy</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/pca</span><span class="desc">PCA on host expression data</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/umap?n_neighbors=5&min_dist=0.3</span><span class="desc">UMAP embedding</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/pathogen-pca</span><span class="desc">PCA on pathogen effector features</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/phylogeny</span><span class="desc">Effector phylogenetic tree (Newick)</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/compare-classifiers</span><span class="desc">Compare 4 classifiers via LOOCV</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/cross-validate</span><span class="desc">Detailed LOOCV report for RF</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/grid-search</span><span class="desc">Hyperparameter grid search for RF</span></div>
    </div>

    <div class="card">
      <h2>Interactive Docs</h2>
      <p style="margin-bottom:0"><a href="/docs" target="_blank">Swagger UI &rarr;</a> &middot; <a href="/redoc" target="_blank">ReDoc &rarr;</a></p>
    </div>

    <div class="footer">
      Host-Pathogen Omics Explorer &mdash; Built with FastAPI + SQLite
    </div>
  </div>
</body>
</html>"""


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
