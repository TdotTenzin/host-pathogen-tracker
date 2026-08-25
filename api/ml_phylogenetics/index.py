"""
api/ml_phylogenetics.py — ML phylogenetics endpoints.
Dependencies: fastapi, pydantic, pandas, numpy, biopython
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI
from hostpathogen.ml.phylogenetics import build_phylogenetic_tree

app = FastAPI()


# ---------------------------------------------------------------------------
# Phylogenetics
# ---------------------------------------------------------------------------


@app.get("/api/ml/phylogeny")
async def effector_phylogeny():
    return build_phylogenetic_tree()
