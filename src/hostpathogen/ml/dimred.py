"""
dimred.py — Dimensionality reduction for host response profiles.

Applies PCA and UMAP to the simulated RNA-seq expression data to
visualise how infected samples cluster away from controls.
Also supports reduction of the effector feature matrix for pathogen
strategy visualisation.

Optimizations:
  - Fixed relative path to use pathlib for cross-platform compatibility
  - Graceful fallback when umap-learn is not installed
"""

import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

from hostpathogen.data.loader import to_df

# Absolute path to R data directory (<repo root>/r/data)
_R_DATA_DIR = Path(__file__).resolve().parents[3] / "r" / "data"


def _get_expression_matrix() -> tuple[pd.DataFrame, list[str]]:
    # Try loading from R exports first (richer data)
    try:
        counts_path = _R_DATA_DIR / "deseq2_counts.csv"
        if counts_path.exists():
            counts = pd.read_csv(str(counts_path), index_col=0)
            log_expr = np.log2(counts + 1)
            labels = ["infected"] * 3 + ["control"] * 3
            return log_expr.T, labels
    except (FileNotFoundError, pd.errors.EmptyDataError):
        pass

    # Fallback: build from host_proteins with random expression
    df = to_df("SELECT name FROM host_proteins")
    genes = df["name"].tolist()
    rng = np.random.default_rng(42)
    data = rng.lognormal(mean=4, sigma=0.5, size=(len(genes), 6))
    expr = pd.DataFrame(
        np.log2(data + 1),
        index=genes,
        columns=[f"infected_{i+1}" for i in range(3)]
        + [f"control_{i+1}" for i in range(3)],
    )
    labels = ["infected"] * 3 + ["control"] * 3
    return expr.T, labels


def pca_analysis(n_components: int = 2) -> dict:
    X, labels = _get_expression_matrix()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    pca = PCA(n_components=min(n_components, X_scaled.shape[0], X_scaled.shape[1]))
    X_pca = pca.fit_transform(X_scaled)

    loadings = pd.DataFrame(
        pca.components_,
        columns=X.columns,
        index=[f"PC{i+1}" for i in range(pca.n_components_)],
    )
    top_genes_pc1 = (
        loadings.loc["PC1"]
        .abs()
        .sort_values(ascending=False)
        .head(5)
        .index.tolist()
    )

    samples_df = pd.DataFrame(
        X_pca,
        columns=[f"PC{i+1}" for i in range(pca.n_components_)],
    )
    samples_df["condition"] = labels

    return {
        "explained_variance_ratio": [
            round(float(v), 4) for v in pca.explained_variance_ratio_
        ],
        "cumulative_variance": round(float(np.cumsum(pca.explained_variance_ratio_)[-1]), 4),
        "n_components": pca.n_components_,
        "top_genes_pc1": top_genes_pc1,
        "samples": samples_df.to_dict(orient="records"),
    }


def umap_analysis(n_neighbors: int = 5, min_dist: float = 0.3) -> dict:
    try:
        from umap import UMAP
    except ImportError:
        return {
            "error": "umap-learn is not installed. Install with: pip install umap-learn",
            "n_neighbors": n_neighbors,
            "min_dist": min_dist,
            "samples": [],
        }

    X, labels = _get_expression_matrix()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    reducer = UMAP(n_neighbors=n_neighbors, min_dist=min_dist, random_state=42)
    X_umap = reducer.fit_transform(X_scaled)

    samples_df = pd.DataFrame(X_umap, columns=["UMAP1", "UMAP2"])
    samples_df["condition"] = labels

    return {
        "n_neighbors": n_neighbors,
        "min_dist": min_dist,
        "samples": samples_df.to_dict(orient="records"),
    }


def pathogen_feature_pca() -> dict:
    from hostpathogen.ml.classifier import extract_features

    X, y = extract_features()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    n = min(2, X_scaled.shape[0], X_scaled.shape[1])
    pca = PCA(n_components=n)
    X_pca = pca.fit_transform(X_scaled)

    all_names = to_df("SELECT name FROM pathogens ORDER BY name")["name"].tolist()

    samples = []
    for i in range(X_pca.shape[0]):
        samples.append(
            {
                "pathogen": all_names[i],
                "strategy": y.iloc[i],
                "PC1": round(float(X_pca[i, 0]), 4),
                "PC2": round(float(X_pca[i, 1]), 4) if n > 1 else 0.0,
            }
        )

    return {
        "explained_variance_ratio": [
            round(float(v), 4) for v in pca.explained_variance_ratio_
        ],
        "samples": samples,
        "feature_names": list(X.columns),
    }
