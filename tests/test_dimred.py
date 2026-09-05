"""
Tests for the dimensionality reduction module (PCA / UMAP).
"""

from hostpathogen.ml.dimred import pca_analysis, pathogen_feature_pca, umap_analysis


def test_pca_analysis_keys():
    """pca_analysis should return expected summary fields."""
    result = pca_analysis()
    for key in [
        "explained_variance_ratio",
        "cumulative_variance",
        "n_components",
        "top_genes_pc1",
        "samples",
    ]:
        assert key in result
    assert len(result["samples"]) == 6


def test_pca_samples_have_condition():
    """Each PCA sample should carry a condition label."""
    result = pca_analysis()
    assert all("condition" in s for s in result["samples"])
    conditions = {s["condition"] for s in result["samples"]}
    assert "infected" in conditions
    assert "control" in conditions


def test_pathogen_feature_pca_shape():
    """pathogen_feature_pca should return 54 samples with PC1/PC2."""
    result = pathogen_feature_pca()
    assert len(result["samples"]) == 54
    for s in result["samples"]:
        assert "pathogen" in s
        assert "strategy" in s
        assert "PC1" in s
        assert "PC2" in s


def test_umap_handles_missing_library():
    """umap_analysis should degrade gracefully if umap-learn is unavailable."""
    result = umap_analysis()
    # Either it errored (with 'error' key) or returned samples; never crash.
    assert isinstance(result, dict)
