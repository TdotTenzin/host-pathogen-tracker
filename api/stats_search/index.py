"""
api/stats_search.py — Stats, search, and bootstrap endpoints.
Dependencies: fastapi, pydantic, pandas, numpy
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, Query
from typing import Optional

from hostpathogen.data.loader import query

app = FastAPI()


# ---------------------------------------------------------------------------
# Stats & Search
# ---------------------------------------------------------------------------


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
# Bootstrap — single endpoint for page load data
# ---------------------------------------------------------------------------


def _list_stages_internal() -> list[dict]:
    """Batch stage queries to avoid N+1 pattern."""
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


def _get_hubs_internal(top_n: int = 10) -> list[dict]:
    from hostpathogen.interactome import hub_targets
    from hostpathogen.interactome import build_network
    G = build_network()
    return hub_targets(G, top_n=top_n)


@app.get("/api/bootstrap")
async def bootstrap():
    """Single endpoint returning all data needed for page initialization."""
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
    hubs = _get_hubs_internal(top_n=15)
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
