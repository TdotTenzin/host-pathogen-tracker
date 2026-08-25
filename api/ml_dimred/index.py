"""
api/ml_dimred.py — ML dimensionality reduction endpoints (PCA, UMAP).
Dependencies: fastapi, pydantic, pandas, numpy, scikit-learn, umap-learn
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, Query
from hostpathogen.ml.dimred import pca_analysis, umap_analysis, pathogen_feature_pca

app = FastAPI()


# ---------------------------------------------------------------------------
# Dimensionality reduction
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
