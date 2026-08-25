"""
api/host_proteins.py — Host protein endpoints.
Dependencies: fastapi, pydantic, pandas, numpy
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, HTTPException, Query
from typing import Optional

from hostpathogen.data.loader import query

app = FastAPI()


# ---------------------------------------------------------------------------
# Host proteins
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
