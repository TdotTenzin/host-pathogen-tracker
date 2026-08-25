"""
api/index.py — Single Vercel serverless function for all API endpoints.
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

from hostpathogen.data.loader import query, to_df
from hostpathogen.trafficking import PhagosomeMaturation
from hostpathogen.interactome import build_network, hub_targets, network_stats, pathogen_subgraph
from hostpathogen.enrichment import targeted_pathways_by_pathogen, overrepresentation_analysis
from hostpathogen.ml.classifier import (
    extract_features,
    train_classifier,
    compare_classifiers,
    cross_validate_rf,
    grid_search_rf,
)
from hostpathogen.ml.dimred import pca_analysis, umap_analysis, pathogen_feature_pca
from hostpathogen.ml.phylogenetics import build_phylogenetic_tree

app = FastAPI(
    title="Host-Pathogen Omics Explorer API",
    version="0.3.0",
    description="REST API for host-pathogen interaction analysis.",
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class MarkerInput(BaseModel):
    markers: List[str]


class MarkerSnapshot(BaseModel):
    snapshots: List[List[str]]


# ---------------------------------------------------------------------------
# Shared caches
# ---------------------------------------------------------------------------

_cached_network = None
_cached_model = None
_cached_features = None


def _get_cached_network():
    global _cached_network
    if _cached_network is None:
        _cached_network = build_network()
    return _cached_network


def _get_cached_model_and_features():
    global _cached_model, _cached_features
    if _cached_features is None:
        _cached_features = extract_features()
        _cached_model, _ = train_classifier()
    return _cached_model, _cached_features


def _list_stages_internal() -> list[dict]:
    stages = query("SELECT * FROM maturation_stages ORDER BY stage_order")
    all_markers = query("""
        SELECT sm.stage_id, hp.name, hp.function
        FROM stage_markers sm
        JOIN host_proteins hp ON sm.host_protein_id = hp.id
        WHERE sm.presence = 1
        ORDER BY sm.stage_id, hp.name
    """)
    markers_by_stage = {}
    for r in all_markers:
        sid = r["stage_id"]
        if sid not in markers_by_stage:
            markers_by_stage[sid] = []
        markers_by_stage[sid].append({"name": r["name"], "function": r["function"]})
    all_active = query("""
        SELECT sm.stage_id, p.name AS pathogen, p.strategy
        FROM effectors e
        JOIN pathogens p ON e.pathogen_id = p.id
        JOIN effector_targets et ON e.id = et.effector_id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN stage_markers sm ON hp.id = sm.host_protein_id
        WHERE sm.presence = 1
        GROUP BY sm.stage_id, p.name
        ORDER BY sm.stage_id, p.name
    """)
    active_by_stage = {}
    for r in all_active:
        sid = r["stage_id"]
        if sid not in active_by_stage:
            active_by_stage[sid] = []
        active_by_stage[sid].append({"pathogen": r["pathogen"], "strategy": r["strategy"]})
    result = []
    for s in stages:
        stage_dict = dict(s)
        stage_dict["markers_present"] = markers_by_stage.get(s["id"], [])
        stage_dict["active_pathogens"] = active_by_stage.get(s["id"], [])
        result.append(stage_dict)
    return result


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get("/api/health")
async def health():
    return {"status": "ok", "database": "hostpathogen.db"}


# ---------------------------------------------------------------------------
# Pathogens & Effectors
# ---------------------------------------------------------------------------


@app.get("/api/pathogens")
async def list_pathogens(
    strategy: Optional[str] = Query(None, description="Filter by evasion strategy"),
    gram_stain: Optional[str] = Query(None, description="Filter by Gram stain"),
    limit: int = Query(100, description="Max results"),
    offset: int = Query(0, description="Offset for pagination"),
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
    sql += " ORDER BY name LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    return [dict(r) for r in query(sql, tuple(params))]


@app.get("/api/pathogens/{name}")
async def get_pathogen(name: str):
    rows = query("SELECT * FROM pathogens WHERE name = ?", (name,))
    if not rows:
        raise HTTPException(status_code=404, detail="Pathogen not found")
    result = dict(rows[0])
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


@app.get("/api/effectors")
async def list_effectors(
    pathogen: Optional[str] = Query(None, description="Filter by pathogen name"),
    effector_type: Optional[str] = Query(None, description="Filter by effector type"),
    host_target: Optional[str] = Query(None, description="Filter by host target protein"),
    search: Optional[str] = Query(None, description="Search effectors by name or mechanism"),
    limit: int = Query(500, description="Max results"),
    offset: int = Query(0, description="Offset for pagination"),
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
    sql += " ORDER BY p.name, e.name LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    return [dict(r) for r in query(sql, tuple(params))]


# ---------------------------------------------------------------------------
# Host Proteins
# ---------------------------------------------------------------------------


@app.get("/api/host-proteins")
async def list_host_proteins(
    search: Optional[str] = Query(None, description="Search by name or full_name"),
    pathway: Optional[str] = Query(None, description="Filter by pathway"),
    limit: int = Query(100, description="Max results"),
    offset: int = Query(0, description="Offset for pagination"),
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
    sql += " ORDER BY name LIMIT ? OFFSET ?"
    params.extend([limit, offset])
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
# Trafficking
# ---------------------------------------------------------------------------


@app.get("/api/trafficking/stages")
async def list_stages():
    return _list_stages_internal()


@app.post("/api/trafficking/predict-stage")
async def predict_stage(input: MarkerInput):
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
    pm = PhagosomeMaturation()
    stages = pm.plot_trajectory(input.snapshots)
    return {"trajectory": stages}


# ---------------------------------------------------------------------------
# Interactome
# ---------------------------------------------------------------------------


@app.get("/api/interactome/hubs")
async def get_hubs(top_n: int = Query(10, description="Number of top hubs to return")):
    G = _get_cached_network()
    return hub_targets(G, top_n=top_n)


@app.get("/api/interactome/stats")
async def get_network_stats():
    G = _get_cached_network()
    return network_stats(G)


@app.get("/api/interactome/pathogen/{name}")
async def get_pathogen_subgraph_endpoint(name: str):
    G = _get_cached_network()
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
    return targeted_pathways_by_pathogen(name)


@app.post("/api/enrichment/overrepresentation")
async def custom_enrichment(genes: List[str]):
    return overrepresentation_analysis(genes)


# ---------------------------------------------------------------------------
# ML / Classifier
# ---------------------------------------------------------------------------


@app.get("/api/ml/predict/{pathogen_name}")
async def predict_strategy(pathogen_name: str):
    model, (X, y) = _get_cached_model_and_features()
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
    _, (X, y) = _get_cached_model_and_features()
    df = X.copy()
    df["strategy"] = y.values
    return df.to_dict(orient="records")


@app.get("/api/ml/compare-classifiers")
async def compare_models():
    return compare_classifiers()


@app.get("/api/ml/cross-validate")
async def cross_validate_rf_endpoint():
    return cross_validate_rf()


@app.get("/api/ml/grid-search")
async def grid_search():
    return grid_search_rf()


# ---------------------------------------------------------------------------
# ML / Dimensionality Reduction
# ---------------------------------------------------------------------------


@app.get("/api/ml/pca")
async def run_pca():
    return pca_analysis()


@app.get("/api/ml/umap")
async def run_umap(
    n_neighbors: int = Query(5, description="UMAP n_neighbors"),
    min_dist: float = Query(0.3, description="UMAP min_dist"),
):
    return umap_analysis(n_neighbors=n_neighbors, min_dist=min_dist)


@app.get("/api/ml/pathogen-pca")
async def pathogen_pca():
    return pathogen_feature_pca()


# ---------------------------------------------------------------------------
# ML / Phylogenetics
# ---------------------------------------------------------------------------


@app.get("/api/ml/phylogeny")
async def effector_phylogeny():
    return build_phylogenetic_tree()


# ---------------------------------------------------------------------------
# Stats & Search
# ---------------------------------------------------------------------------


@app.get("/api/stats")
async def database_stats():
    return {
        "pathogens": query("SELECT COUNT(*) AS n FROM pathogens")[0]["n"],
        "effectors": query("SELECT COUNT(*) AS n FROM effectors")[0]["n"],
        "host_proteins": query("SELECT COUNT(*) AS n FROM host_proteins")[0]["n"],
        "effector_targets": query("SELECT COUNT(*) AS n FROM effector_targets")[0]["n"],
        "maturation_stages": query("SELECT COUNT(*) AS n FROM maturation_stages")[0]["n"],
        "strategies": [dict(r) for r in query("SELECT strategy, COUNT(*) AS n FROM pathogens GROUP BY strategy ORDER BY n DESC")],
        "gram_stains": [dict(r) for r in query("SELECT gram_stain, COUNT(*) AS n FROM pathogens GROUP BY gram_stain ORDER BY n DESC")],
    }


@app.get("/api/search")
async def search(
    q: str = Query("", description="Search term matching pathogen name, species, or description"),
    strategy: Optional[str] = Query(None, description="Filter by evasion strategy"),
    gram_stain: Optional[str] = Query(None, description="Filter by Gram stain result"),
    min_effectors: Optional[int] = Query(None, description="Minimum number of effectors"),
    max_effectors: Optional[int] = Query(None, description="Maximum number of effectors"),
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
            having_clauses.append("COUNT(e.id) >= ?")
            params.append(min_effectors)
        if max_effectors is not None:
            having_clauses.append("COUNT(e.id) <= ?")
            params.append(max_effectors)
        sql += " HAVING " + " AND ".join(having_clauses)
    sql += " LIMIT ?"
    params.append(limit)
    return [dict(r) for r in query(sql, tuple(params))]


# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------


@app.get("/api/bootstrap")
async def bootstrap():
    pathogens = [dict(r) for r in query("SELECT * FROM pathogens ORDER BY name")]
    effectors = [
        dict(r)
        for r in query(
            """
            SELECT p.name AS pathogen, e.name AS effector, e.type, e.host_target, e.mechanism
            FROM effectors e JOIN pathogens p ON e.pathogen_id = p.id
            ORDER BY p.name, e.name
            """
        )
    ]
    stages = _list_stages_internal()
    hubs = hub_targets(_get_cached_network(), top_n=15)
    host_proteins = [
        dict(r) for r in query("SELECT * FROM host_proteins ORDER BY name LIMIT 100")
    ]
    return {
        "pathogens": pathogens,
        "effectors": effectors,
        "stages": stages,
        "hubs": hubs,
        "host_proteins": host_proteins,
    }
