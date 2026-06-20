"""
Phase 3 — FastAPI backend for the Host-Pathogen Omics Explorer.

Provides RESTful endpoints for all analysis modules and a built-in
HTML dashboard at the root path.
"""

from pathlib import Path
import sys

# Ensure the src directory is on the path so hostpathogen can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from hostpathogen.data.loader import query, to_df

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Host-Pathogen Omics Explorer API",
    version="0.1.0",
    description="REST API for host-pathogen interaction analysis — pathogens, "
    "effectors, trafficking networks, enrichment, and ML prediction.",
)

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class MarkerInput(BaseModel):
    """A list of observed molecular marker names for stage prediction."""
    markers: list[str]


class MarkerSnapshot(BaseModel):
    """Time series of marker observations for trajectory analysis."""
    snapshots: list[list[str]]


class PredictionResult(BaseModel):
    """ML prediction result for a pathogen's evasion strategy."""
    pathogen: str
    predicted_strategy: str | None


# ---------------------------------------------------------------------------
# Static file mounts — serve the existing HTML site alongside the API
# ---------------------------------------------------------------------------
BASE = Path(__file__).resolve().parent.parent
app.mount("/css", StaticFiles(directory=str(BASE / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(BASE / "js")), name="js")
app.mount("/img", StaticFiles(directory=str(BASE / "img")), name="img")


# ---------------------------------------------------------------------------
# Roots
# ---------------------------------------------------------------------------


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    """Serve the existing index.html site."""
    index_path = BASE / "index.html"
    if not index_path.exists():
        return HTMLResponse("<h1>index.html not found</h1>", status_code=404)
    return HTMLResponse(index_path.read_text(encoding="utf-8"))


@app.get("/dashboard", response_class=HTMLResponse, include_in_schema=False)
async def api_dashboard():
    """Serve the embedded API dashboard."""
    return HTML_DASHBOARD


@app.get("/api/health")
async def health():
    return {"status": "ok", "database": str(Path(__file__).parent.parent / "src/hostpathogen/data/hostpathogen.db")}


# ---------------------------------------------------------------------------
# Pathogens
# ---------------------------------------------------------------------------


@app.get("/api/pathogens")
async def list_pathogens():
    """Return all pathogens with their strategies and Gram stain."""
    return [dict(r) for r in query("SELECT * FROM pathogens ORDER BY name")]


@app.get("/api/pathogens/{name}")
async def get_pathogen(name: str):
    """Return details for a single pathogen."""
    rows = query("SELECT * FROM pathogens WHERE name = ?", (name,))
    if not rows:
        raise HTTPException(status_code=404, detail="Pathogen not found")
    return dict(rows[0])


@app.get("/api/pathogens/{name}/effectors")
async def pathogen_effectors(name: str):
    """Return all effectors for a given pathogen."""
    return [
        dict(r)
        for r in query(
            """
            SELECT e.name AS effector, e.type, e.host_target, e.mechanism
            FROM effectors e
            JOIN pathogens p ON e.pathogen_id = p.id
            WHERE p.name = ?
            ORDER BY e.name
            """,
            (name,),
        )
    ]


# ---------------------------------------------------------------------------
# Effectors
# ---------------------------------------------------------------------------


@app.get("/api/effectors")
async def list_effectors(
    pathogen: str | None = Query(None, description="Filter by pathogen name"),
):
    """Return all effectors, optionally filtered by pathogen."""
    if pathogen:
        rows = query(
            """
            SELECT p.name AS pathogen, e.name AS effector, e.type, e.host_target, e.mechanism
            FROM effectors e
            JOIN pathogens p ON e.pathogen_id = p.id
            WHERE p.name = ?
            ORDER BY e.name
            """,
            (pathogen,),
        )
    else:
        rows = query(
            """
            SELECT p.name AS pathogen, e.name AS effector, e.type, e.host_target, e.mechanism
            FROM effectors e
            JOIN pathogens p ON e.pathogen_id = p.id
            ORDER BY p.name, e.name
            """
        )
    return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# Host proteins
# ---------------------------------------------------------------------------


@app.get("/api/host-proteins")
async def list_host_proteins():
    """Return all host proteins with their function, localization, and pathway."""
    return [dict(r) for r in query("SELECT * FROM host_proteins ORDER BY name")]


@app.get("/api/host-proteins/{name}")
async def get_host_protein(name: str):
    """Return details for a single host protein, including which pathogens target it."""
    protein = query("SELECT * FROM host_proteins WHERE name = ?", (name,))
    if not protein:
        raise HTTPException(status_code=404, detail="Host protein not found")

    targeting = [
        dict(r)
        for r in query(
            """
            SELECT p.name AS pathogen, e.name AS effector, et.interaction_type
            FROM effector_targets et
            JOIN effectors e ON et.effector_id = e.id
            JOIN pathogens p ON e.pathogen_id = p.id
            JOIN host_proteins h ON et.host_protein_id = h.id
            WHERE h.name = ?
            """,
            (name,),
        )
    ]

    result = dict(protein[0])
    result["targeted_by"] = targeting
    return result


# ---------------------------------------------------------------------------
# Trafficking / maturation stages
# ---------------------------------------------------------------------------


@app.get("/api/trafficking/stages")
async def list_stages():
    """Return all phagosome maturation stages with their markers."""
    stages = query("SELECT * FROM maturation_stages ORDER BY stage_order")
    result = []
    for s in stages:
        stage_dict = dict(s)
        # Get markers present at this stage
        markers_present = [
            dict(r)
            for r in query(
                """
                SELECT hp.name, hp.function
                FROM stage_markers sm
                JOIN host_proteins hp ON sm.host_protein_id = hp.id
                WHERE sm.stage_id = ? AND sm.presence = 1
                ORDER BY hp.name
                """,
                (s["id"],),
            )
        ]
        # Get pathogens active at this stage
        pathogens_active = [
            dict(r)
            for r in query(
                """
                SELECT DISTINCT p.name AS pathogen, p.strategy
                FROM effectors e
                JOIN pathogens p ON e.pathogen_id = p.id
                JOIN effector_targets et ON e.id = et.effector_id
                JOIN host_proteins hp ON et.host_protein_id = hp.id
                JOIN stage_markers sm ON hp.id = sm.host_protein_id
                WHERE sm.stage_id = ? AND sm.presence = 1
                """,
                (s["id"],),
            )
        ]
        stage_dict["markers_present"] = markers_present
        stage_dict["active_pathogens"] = pathogens_active
        result.append(stage_dict)
    return result


@app.post("/api/trafficking/predict-stage")
async def predict_stage(input: MarkerInput):
    """Given a list of observed markers, predict which stage the phagosome is in."""
    from hostpathogen.trafficking import PhagosomeMaturation

    pm = PhagosomeMaturation()
    stage = pm.get_stage(input.markers)
    if stage is None:
        raise HTTPException(status_code=400, detail="Could not match marker profile to any stage")
    info = pm.stage_info(stage)
    return info


@app.post("/api/trafficking/trajectory")
async def predict_trajectory(input: MarkerSnapshot):
    """Given a time series of marker observations, return the trajectory through stages."""
    from hostpathogen.trafficking import PhagosomeMaturation

    pm = PhagosomeMaturation()
    stages = pm.plot_trajectory(input.snapshots)
    return {"trajectory": stages}


# ---------------------------------------------------------------------------
# Interactome / network
# ---------------------------------------------------------------------------


@app.get("/api/interactome/hubs")
async def get_hubs(top_n: int = Query(10, description="Number of top hubs to return")):
    """Return the host proteins with highest degree centrality."""
    from hostpathogen.interactome import build_network, hub_targets

    G = build_network()
    return hub_targets(G, top_n=top_n)


@app.get("/api/interactome/stats")
async def get_network_stats():
    """Return summary statistics of the host-pathogen interaction network."""
    from hostpathogen.interactome import build_network, network_stats

    G = build_network()
    return network_stats(G)


@app.get("/api/interactome/pathogen/{name}")
async def get_pathogen_subgraph(name: str):
    """
    Return the subgraph of effectors and host targets for a given pathogen.
    Returns nodes and edges as JSON for frontend graph rendering.
    """
    from hostpathogen.interactome import build_network, pathogen_subgraph

    G = build_network()
    sub = pathogen_subgraph(G, name)

    nodes = [
        {"id": n, "type": attr.get("type"), "pathogen": attr.get("pathogen")}
        for n, attr in sub.nodes(data=True)
    ]
    edges = [
        {"source": u, "target": v, "interaction": attr.get("interaction")}
        for u, v, attr in sub.edges(data=True)
    ]
    return {"nodes": nodes, "edges": edges}


# ---------------------------------------------------------------------------
# Enrichment
# ---------------------------------------------------------------------------


@app.get("/api/enrichment/pathogen/{name}")
async def pathogen_enrichment(name: str):
    """Run pathway enrichment on host proteins targeted by a given pathogen."""
    from hostpathogen.enrichment import targeted_pathways_by_pathogen

    return targeted_pathways_by_pathogen(name)


@app.post("/api/enrichment/overrepresentation")
async def custom_enrichment(genes: list[str]):
    """Run pathway enrichment on a custom list of host protein names."""
    from hostpathogen.enrichment import overrepresentation_analysis

    return overrepresentation_analysis(genes)


# ---------------------------------------------------------------------------
# ML / classifier
# ---------------------------------------------------------------------------


@app.get("/api/ml/predict/{pathogen_name}")
async def predict_strategy(pathogen_name: str):
    """Predict the evasion strategy for a given pathogen based on its effector features."""
    from hostpathogen.ml.classifier import extract_features, train_classifier

    model, _ = train_classifier()
    X, y = extract_features()

    # Find the pathogen in the feature matrix
    all_pathogens = query("SELECT name FROM pathogens ORDER BY name")
    names = [r["name"] for r in all_pathogens]

    if pathogen_name not in names:
        raise HTTPException(status_code=404, detail=f"Pathogen '{pathogen_name}' not found")

    idx = names.index(pathogen_name)
    features = X.iloc[[idx]]
    pred = model.predict(features)[0]

    # Get feature importances for context
    importances = [
        {"feature": col, "importance": round(float(imp), 4)}
        for col, imp in zip(X.columns, model.feature_importances_)
    ]
    importances.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "pathogen": pathogen_name,
        "predicted_strategy": str(pred),
        "actual_strategy": str(y.iloc[idx]),
        "feature_importances": importances,
    }


@app.get("/api/ml/features")
async def get_feature_matrix():
    """Return the feature matrix used for ML training."""
    from hostpathogen.ml.classifier import extract_features

    X, y = extract_features()
    df = X.copy()
    df["strategy"] = y.values
    return df.to_dict(orient="records")


# ---------------------------------------------------------------------------
# Phase 4 — Dimensionality reduction
# ---------------------------------------------------------------------------


@app.get("/api/ml/pca")
async def run_pca():
    """Run PCA on the host expression matrix. Returns explained variance and sample coordinates."""
    from hostpathogen.ml.dimred import pca_analysis

    return pca_analysis()


@app.get("/api/ml/umap")
async def run_umap(
    n_neighbors: int = Query(5, description="UMAP n_neighbors"),
    min_dist: float = Query(0.3, description="UMAP min_dist"),
):
    """Run UMAP on the host expression matrix. Returns 2D embedding with condition labels."""
    from hostpathogen.ml.dimred import umap_analysis

    return umap_analysis(n_neighbors=n_neighbors, min_dist=min_dist)


@app.get("/api/ml/pathogen-pca")
async def pathogen_pca():
    """Run PCA on the pathogen effector feature matrix. Shows how pathogens cluster."""
    from hostpathogen.ml.dimred import pathogen_feature_pca

    return pathogen_feature_pca()


# ---------------------------------------------------------------------------
# Phase 4 — Phylogenetics
# ---------------------------------------------------------------------------


@app.get("/api/ml/phylogeny")
async def effector_phylogeny():
    """Build and return a phylogenetic tree of all effector proteins (NJ tree, Newick format)."""
    from hostpathogen.ml.phylogenetics import build_phylogenetic_tree

    return build_phylogenetic_tree()


# ---------------------------------------------------------------------------
# Phase 4 — Classifier comparison & CV
# ---------------------------------------------------------------------------


@app.get("/api/ml/compare-classifiers")
async def compare_models():
    """Compare Random Forest, SVM, Logistic Regression, and k-NN using Leave-One-Out CV."""
    from hostpathogen.ml.classifier import compare_classifiers

    return compare_classifiers()


@app.get("/api/ml/cross-validate")
async def cross_validate_rf():
    """Detailed Leave-One-Out cross-validation report for Random Forest."""
    from hostpathogen.ml.classifier import cross_validate_rf

    return cross_validate_rf()


@app.get("/api/ml/grid-search")
async def grid_search():
    """Hyperparameter grid search for Random Forest."""
    from hostpathogen.ml.classifier import grid_search_rf

    return grid_search_rf()


# ---------------------------------------------------------------------------
# Embedded HTML dashboard
# ---------------------------------------------------------------------------

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
    </div>

    <div class="card">
      <h2>Phase 4 — Advanced ML</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/pca</span><span class="desc">PCA on host expression data</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/umap?n_neighbors=5&min_dist=0.3</span><span class="desc">UMAP embedding of expression profiles</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/pathogen-pca</span><span class="desc">PCA on pathogen effector features</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/phylogeny</span><span class="desc">Effector phylogenetic tree (Newick)</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/compare-classifiers</span><span class="desc">Compare 4 classifiers via LOOCV</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/cross-validate</span><span class="desc">Detailed LOOCV report for RF</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/ml/grid-search</span><span class="desc">Hyperparameter grid search for RF</span></div>
    </div>

    <div class="card">
      <h2>Interactive Docs</h2>
      <p style="margin-bottom:0"><a href="/docs" target="_blank">Swagger UI &rarr;</a> &middot; <a href="/redoc" target="_blank">ReDoc &rarr;</a> &middot; <a href="/dashboard" target="_blank">API Dashboard &rarr;</a></p>
    </div>

    <div class="footer">
      Host-Pathogen Omics Explorer &mdash; Built with FastAPI + SQLite
    </div>
  </div>
</body>
</html>"""


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
