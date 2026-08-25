"""
api/trafficking.py — Phagosome maturation / trafficking endpoints.
Dependencies: fastapi, pydantic, pandas, numpy
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from hostpathogen.data.loader import query, to_df
from hostpathogen.trafficking import PhagosomeMaturation

app = FastAPI()


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class MarkerInput(BaseModel):
    markers: List[str]


class MarkerSnapshot(BaseModel):
    snapshots: List[List[str]]


# ---------------------------------------------------------------------------
# Trafficking / maturation stages
# ---------------------------------------------------------------------------


def _list_stages_internal() -> list[dict]:
    """Batch stage queries to avoid N+1 pattern."""
    stages = query("SELECT * FROM maturation_stages ORDER BY stage_order")

    # Batch 1: All markers present across all stages
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

    # Batch 2: All pathogens active at each stage (via targets)
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
