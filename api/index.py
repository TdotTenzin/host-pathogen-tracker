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
    version="0.1.0",
    description="REST API for host-pathogen interaction analysis — pathogens, "
    "effectors, trafficking networks, enrichment, and ML prediction.",
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
# Pathogens
# ---------------------------------------------------------------------------


@app.get("/api/pathogens")
async def list_pathogens():
    return [dict(r) for r in query("SELECT * FROM pathogens ORDER BY name")]


@app.get("/api/pathogens/{name}")
async def get_pathogen(name: str):
    rows = query("SELECT * FROM pathogens WHERE name = ?", (name,))
    if not rows:
        raise HTTPException(status_code=404, detail="Pathogen not found")
    return dict(rows[0])


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
):
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
    return [dict(r) for r in query("SELECT * FROM host_proteins ORDER BY name")]


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
