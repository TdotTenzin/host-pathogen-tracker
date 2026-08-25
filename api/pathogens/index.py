"""
api/pathogens.py — Pathogen and effector endpoints.
Dependencies: fastapi, pydantic, pandas, numpy
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from hostpathogen.data.loader import query

app = FastAPI()


# ---------------------------------------------------------------------------
# Pathogens
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


# ---------------------------------------------------------------------------
# Effectors
# ---------------------------------------------------------------------------


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
