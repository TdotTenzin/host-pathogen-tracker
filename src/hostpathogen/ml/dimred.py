"""
dimred.py — Dimensionality reduction for host response profiles.

Applies PCA and UMAP to the simulated RNA-seq expression data to
visualise how infected samples cluster away from controls.
Also supports reduction of the effector feature matrix for pathogen
strategy visualisation.
"""

import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

from hostpathogen.data.loader import to_df


def _get_expression_matrix() -> tuple[pd.DataFrame, list[str]]:
    """
    Build a log2-CPM-like expression matrix from our simulated data
    or, failing that, generate one on the fly from the database.

    Returns (df, sample_labels) where df has genes as rows and
    samples as columns.
    """
    # Try loading from R exports first (richer data)
    try:
        path = pd.io.common.file_exists("r/data/deseq2_counts.csv")
        counts = pd.read_csv("r/data/deseq2_counts.csv", index_col=0)
        # Log2 transform
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
    """
    Run PCA on the host expression matrix.

    Returns a dict with:
      - explained_variance_ratio
      - components (loadings for top genes)
      - transformed samples (PC1, PC2, condition)
      - cumulative_variance
    """
    X, labels = _get_expression_matrix()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    pca = PCA(n_components=min(n_components, X_scaled.shape[0], X_scaled.shape[1]))
    X_pca = pca.fit_transform(X_scaled)

    # Get top contributing genes for PC1
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
    """
    Run UMAP on the host expression matrix.

    Uses umap-learn. Returns transformed coordinates for each sample.

    Parameters:
        n_neighbors: local neighbourhood size (smaller = more local structure)
        min_dist: minimum distance between points in embedding
    """
    from umap import UMAP

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
    """
    Run PCA on the pathogen effector feature matrix.
    Helps visualise how pathogens cluster by their effector repertoire.
    """
    from hostpathogen.ml.classifier import extract_features

    X, y = extract_features()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    n = min(2, X_scaled.shape[0], X_scaled.shape[1])
    pca = PCA(n_components=n)
    X_pca = pca.fit_transform(X_scaled)

    # Get pathogen names
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
