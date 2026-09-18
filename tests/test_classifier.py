"""
Tests for the ML classifier module (evasion strategy prediction).
"""

import pandas as pd

from hostpathogen.ml.classifier import (
    FEATURE_NAMES,
    extract_features,
    features_from_effectors,
    train_classifier,
    compare_classifiers,
    cross_validate_rf,
    grid_search_rf,
)


def test_extract_features_shape():
    """Feature matrix should have 54 rows (one per pathogen) and 11 columns."""
    X, y = extract_features()
    assert X.shape[0] == 54
    assert X.shape[1] == len(FEATURE_NAMES)
    assert len(y) == 54


def test_extract_features_no_nans():
    """Feature matrix should contain no missing values."""
    X, _ = extract_features()
    assert X.isna().sum().sum() == 0


def test_extract_feature_names_present():
    """X columns should match the declared FEATURE_NAMES."""
    X, _ = extract_features()
    assert list(X.columns) == FEATURE_NAMES


def test_features_from_effectors_shape_and_columns():
    """features_from_effectors mirrors FEATURE_NAMES and counts correctly."""
    df = pd.DataFrame(
        [
            {"pathogen": "Test Pathogen A", "type": "T3SS effector", "host_target": "Rab5 / EEA1"},
            {"pathogen": "Test Pathogen A", "type": "Toxin", "host_target": "Rab5"},
            {"pathogen": "Test Pathogen B", "type": "Porin", "host_target": "LAMP1"},
        ]
    )
    host_map = {
        "Rab5": ("phagosome_maturation", "vacuolar"),
        "EEA1": ("phagosome_maturation", "vacuolar"),
        "LAMP1": (None, "vacuolar"),
    }
    features = features_from_effectors(df, host_map=host_map)
    assert list(features.columns) == FEATURE_NAMES
    assert features.shape[0] == 2
    assert features.loc["Test Pathogen A", "n_effectors"] == 2
    assert features.loc["Test Pathogen A", "n_targets"] == 2
    assert features.loc["Test Pathogen A", "n_t3ss"] == 1
    assert features.loc["Test Pathogen A", "n_toxins"] == 1
    assert features.loc["Test Pathogen A", "n_interaction_types"] == 0
    assert features.loc["Test Pathogen B", "n_pathways"] == 0
    assert features.loc["Test Pathogen B", "n_surface_proteins"] == 1
    assert features.isna().sum().sum() == 0


def test_features_from_effectors_tolerates_missing_columns():
    """Effectors with no type/host_target columns still yield the 11 features."""
    df = pd.DataFrame({"pathogen": ["X", "X", "Y"]})
    features = features_from_effectors(df, host_map={})
    assert list(features.columns) == FEATURE_NAMES
    assert features.loc["X", "n_effectors"] == 2
    assert features.loc["X", "n_targets"] == 0
    assert features.loc["Y", "n_interaction_types"] == 0


def test_train_classifier_returns_fitted_model():
    """train_classifier should return a fitted model with predict + a report."""
    model, report = train_classifier()
    assert hasattr(model, "predict")
    assert hasattr(model, "predict_proba")
    assert "accuracy" in report


def test_compare_classifiers_returns_results():
    """compare_classifiers should return entries for all 4 models."""
    results = compare_classifiers()
    assert len(results) == 4
    names = {r["model"] for r in results}
    assert "Random Forest" in names
    for r in results:
        assert 0 <= r["mean_accuracy"] <= 1


def test_cross_validate_rf_structure():
    """cross_validate_rf should return per-pathogen fold results."""
    result = cross_validate_rf()
    assert result["n_folds"] == 5
    assert len(result["folds"]) == 54
    assert all("predicted_strategy" in f for f in result["folds"])


def test_grid_search_rf_structure():
    """grid_search_rf should return best params and score."""
    result = grid_search_rf()
    assert "best_params" in result
    assert "best_score" in result
    assert 0 <= result["best_score"] <= 1
