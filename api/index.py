"""
api/index.py — Vercel serverless entry point.

API-only FastAPI app (no static file mounts).
The static site (index.html, css, js, img) is served
directly by Vercel's CDN via vercel.json rewrites.
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel

from hostpathogen.data.loader import query, to_df

app = FastAPI(
    title="Host-Pathogen Omics Explorer API",
    version="0.2.0",
    description="REST API for host-pathogen interaction analysis — pathogens, "
    "effectors, trafficking networks, enrichment, and ML prediction. "
    "Database expanded to 54 pathogens with DOI references.",
)

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class MarkerInput(BaseModel):
    markers: list[str]


class MarkerSnapshot(BaseModel):
    snapshots: list[list[str]]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "database": str(
            Path(__file__).resolve().parent.parent
            / "src/hostpathogen/data/hostpathogen.db"
        ),
    }


# ---------------------------------------------------------------------------
# Search & filter
# ---------------------------------------------------------------------------


@app.get("/api/search")
async def search(
    q: str = Query("", description="Search term matching pathogen name, species, or description"),
    strategy: str | None = Query(None, description="Filter by evasion strategy"),
    gram_stain: str | None = Query(None, description="Filter by Gram stain result"),
    min_effectors: int | None = Query(None, description="Minimum number of effectors"),
    max_effectors: int | None = Query(None, description="Maximum number of effectors"),
    limit: int = Query(50, description="Max results"),
):
    sql = """
        SELECT p.*, COUNT(e.id) AS n_effectors
        FROM pathogens p
        LEFT JOIN effectors e ON e.pathogen_id = p.id
    """
    conditions = []
    params = []

    if q:
        conditions.append("(p.name LIKE ? OR p.species LIKE ? OR p.description LIKE ?)")
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])

    if strategy:
        conditions.append("p.strategy = ?")
        params.append(strategy)

    if gram_stain:
        conditions.append("p.gram_stain = ?")
        params.append(gram_stain)

    if conditions:
        sql += " WHERE " + " AND ".join(conditions)

    sql += " GROUP BY p.id ORDER BY p.name"

    if min_effectors is not None or max_effectors is not None:
        having_clauses = []
        if min_effectors is not None:
            having_clauses.append(f"COUNT(e.id) >= ?")
            params.append(min_effectors)
        if max_effectors is not None:
            having_clauses.append(f"COUNT(e.id) <= ?")
            params.append(max_effectors)
        sql += " HAVING " + " AND ".join(having_clauses)

    sql += " LIMIT ?"
    params.append(limit)

    return [dict(r) for r in query(sql, tuple(params))]


@app.get("/api/stats")
async def database_stats():
    """Return summary statistics about the database."""
    return {
        "pathogens": query("SELECT COUNT(*) AS n FROM pathogens")[0]["n"],
        "effectors": query("SELECT COUNT(*) AS n FROM effectors")[0]["n"],
        "host_proteins": query("SELECT COUNT(*) AS n FROM host_proteins")[0]["n"],
        "effector_targets": query("SELECT COUNT(*) AS n FROM effector_targets")[0]["n"],
        "maturation_stages": query("SELECT COUNT(*) AS n FROM maturation_stages")[0]["n"],
        "strategies": [dict(r) for r in query("SELECT strategy, COUNT(*) AS n FROM pathogens GROUP BY strategy ORDER BY n DESC")],
        "gram_stains": [dict(r) for r in query("SELECT gram_stain, COUNT(*) AS n FROM pathogens GROUP BY gram_stain ORDER BY n DESC")],
    }


# ---------------------------------------------------------------------------
# Pathogens
# ---------------------------------------------------------------------------


@app.get("/api/pathogens")
async def list_pathogens(
    strategy: str | None = Query(None, description="Filter by evasion strategy"),
    gram_stain: str | None = Query(None, description="Filter by Gram stain"),
    limit: int = Query(100, description="Max results"),
):
    sql = "SELECT * FROM pathogens"
    conditions = []
    params = []
    if strategy:
        conditions.append("strategy = ?")
        params.append(strategy)
    if gram_stain:
        conditions.append("gram_stain = ?")
        params.append(gram_stain)
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY name LIMIT ?"
    params.append(limit)
    return [dict(r) for r in query(sql, tuple(params))]


@app.get("/api/pathogens/{name}")
async def get_pathogen(name: str):
    rows = query("SELECT * FROM pathogens WHERE name = ?", (name,))
    if not rows:
        raise HTTPException(status_code=404, detail="Pathogen not found")
    result = dict(rows[0])
    # Include effector count
    cnt = query("SELECT COUNT(*) AS n FROM effectors WHERE pathogen_id = ?", (result["id"],))[0]["n"]
    result["n_effectors"] = cnt
    return result


@app.get("/api/pathogens/{name}/effectors")
async def pathogen_effectors(name: str):
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
    effector_type: str | None = Query(None, description="Filter by effector type (e.g. T3SS, T4SS, Toxin)"),
    host_target: str | None = Query(None, description="Filter by host target protein"),
    search: str | None = Query(None, description="Search effectors by name or mechanism"),
    limit: int = Query(500, description="Max results"),
):
    conditions = []
    params = []
    if pathogen:
        conditions.append("p.name = ?")
        params.append(pathogen)
    if effector_type:
        conditions.append("e.type LIKE ?")
        params.append(f"%{effector_type}%")
    if host_target:
        conditions.append("e.host_target = ?")
        params.append(host_target)
    if search:
        conditions.append("(e.name LIKE ? OR e.mechanism LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])

    sql = """
        SELECT p.name AS pathogen, e.name AS effector, e.type, e.host_target, e.mechanism
        FROM effectors e
        JOIN pathogens p ON e.pathogen_id = p.id
    """
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY p.name, e.name LIMIT ?"
    params.append(limit)
    return [dict(r) for r in query(sql, tuple(params))]


# ---------------------------------------------------------------------------
# Host proteins
# ---------------------------------------------------------------------------


@app.get("/api/host-proteins")
async def list_host_proteins(
    search: str | None = Query(None, description="Search by name or full_name"),
    pathway: str | None = Query(None, description="Filter by pathway"),
    limit: int = Query(100, description="Max results"),
):
    sql = "SELECT * FROM host_proteins"
    conditions = []
    params = []
    if search:
        conditions.append("(name LIKE ? OR full_name LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])
    if pathway:
        conditions.append("pathway = ?")
        params.append(pathway)
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY name LIMIT ?"
    params.append(limit)
    return [dict(r) for r in query(sql, tuple(params))]


@app.get("/api/host-proteins/{name}")
async def get_host_protein(name: str):
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
    stages = query("SELECT * FROM maturation_stages ORDER BY stage_order")
    result = []
    for s in stages:
        stage_dict = dict(s)
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
    from hostpathogen.trafficking import PhagosomeMaturation

    pm = PhagosomeMaturation()
    stage = pm.get_stage(input.markers)
    if stage is None:
        raise HTTPException(
            status_code=400, detail="Could not match marker profile to any stage"
        )
    info = pm.stage_info(stage)
    return info


@app.post("/api/trafficking/trajectory")
async def predict_trajectory(input: MarkerSnapshot):
    from hostpathogen.trafficking import PhagosomeMaturation

    pm = PhagosomeMaturation()
    stages = pm.plot_trajectory(input.snapshots)
    return {"trajectory": stages}


# ---------------------------------------------------------------------------
# Interactome / network
# ---------------------------------------------------------------------------


@app.get("/api/interactome/hubs")
async def get_hubs(
    top_n: int = Query(10, description="Number of top hubs to return"),
):
    from hostpathogen.interactome import build_network, hub_targets

    G = build_network()
    return hub_targets(G, top_n=top_n)


@app.get("/api/interactome/stats")
async def get_network_stats():
    from hostpathogen.interactome import build_network, network_stats

    G = build_network()
    return network_stats(G)


@app.get("/api/interactome/pathogen/{name}")
async def get_pathogen_subgraph(name: str):
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
    from hostpathogen.enrichment import targeted_pathways_by_pathogen

    return targeted_pathways_by_pathogen(name)


@app.post("/api/enrichment/overrepresentation")
async def custom_enrichment(genes: list[str]):
    from hostpathogen.enrichment import overrepresentation_analysis

    return overrepresentation_analysis(genes)


# ---------------------------------------------------------------------------
# ML / classifier
# ---------------------------------------------------------------------------


@app.get("/api/ml/predict/{pathogen_name}")
async def predict_strategy(pathogen_name: str):
    from hostpathogen.ml.classifier import extract_features, train_classifier

    model, _ = train_classifier()
    X, y = extract_features()

    all_pathogens = query("SELECT name FROM pathogens ORDER BY name")
    names = [r["name"] for r in all_pathogens]

    if pathogen_name not in names:
        raise HTTPException(
            status_code=404, detail=f"Pathogen '{pathogen_name}' not found"
        )

    idx = names.index(pathogen_name)
    features = X.iloc[[idx]]
    pred = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    confidence = round(float(max(proba)), 4)

    importances = [
        {"feature": col, "importance": round(float(imp), 4)}
        for col, imp in zip(X.columns, model.feature_importances_)
    ]
    importances.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "pathogen": pathogen_name,
        "predicted_strategy": str(pred),
        "actual_strategy": str(y.iloc[idx]),
        "confidence": confidence,
        "feature_importances": importances,
    }


@app.get("/api/ml/features")
async def get_feature_matrix():
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
    from hostpathogen.ml.dimred import pca_analysis

    return pca_analysis()


@app.get("/api/ml/umap")
async def run_umap(
    n_neighbors: int = Query(5, description="UMAP n_neighbors"),
    min_dist: float = Query(0.3, description="UMAP min_dist"),
):
    from hostpathogen.ml.dimred import umap_analysis

    return umap_analysis(n_neighbors=n_neighbors, min_dist=min_dist)


@app.get("/api/ml/pathogen-pca")
async def pathogen_pca():
    from hostpathogen.ml.dimred import pathogen_feature_pca

    return pathogen_feature_pca()


# ---------------------------------------------------------------------------
# Phase 4 — Phylogenetics
# ---------------------------------------------------------------------------


@app.get("/api/ml/phylogeny")
async def effector_phylogeny():
    from hostpathogen.ml.phylogenetics import build_phylogenetic_tree

    return build_phylogenetic_tree()


# ---------------------------------------------------------------------------
# Phase 4 — Classifier comparison & CV
# ---------------------------------------------------------------------------


@app.get("/api/ml/compare-classifiers")
async def compare_models():
    from hostpathogen.ml.classifier import compare_classifiers

    return compare_classifiers()


@app.get("/api/ml/cross-validate")
async def cross_validate_rf():
    from hostpathogen.ml.classifier import cross_validate_rf

    return cross_validate_rf()


@app.get("/api/ml/grid-search")
async def grid_search():
    from hostpathogen.ml.classifier import grid_search_rf

    return grid_search_rf()


# ---------------------------------------------------------------------------
# Local development — serve static frontend files via middleware
# ---------------------------------------------------------------------------

import os

PROJECT_ROOT = Path(__file__).resolve().parent.parent


@app.middleware("http")
async def _spa_static_middleware(request, call_next):
    """Fall through to FastAPI routes first; if they return 404,
    serve static files or index.html for local development."""
    response = await call_next(request)
    if response.status_code == 404:
        path = request.url.path
        if not path.startswith("/api/"):
            from fastapi.responses import FileResponse

            file_path = PROJECT_ROOT / path.lstrip("/")
            if file_path.is_file():
                return FileResponse(str(file_path))
            index_path = PROJECT_ROOT / "index.html"
            return FileResponse(str(index_path))
    return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api.index:app", host="0.0.0.0", port=8000, reload=True)
