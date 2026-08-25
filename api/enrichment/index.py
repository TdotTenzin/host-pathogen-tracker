"""
api/enrichment.py — Pathway enrichment endpoints.
Dependencies: fastapi, pydantic, pandas, numpy, scipy
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI
from typing import List

from hostpathogen.enrichment import targeted_pathways_by_pathogen, overrepresentation_analysis

app = FastAPI()


# ---------------------------------------------------------------------------
# Enrichment
# ---------------------------------------------------------------------------


@app.get("/api/enrichment/pathogen/{name}")
async def pathogen_enrichment(name: str):
    return targeted_pathways_by_pathogen(name)


@app.post("/api/enrichment/overrepresentation")
async def custom_enrichment(genes: List[str]):
    return overrepresentation_analysis(genes)
