"""
classifier.py — Predict pathogen evasion strategy from effector features.

Given a pathogen's set of effectors, predict whether its intracellular
survival strategy is:
  • "arrest" — blocks phagosome maturation
  • "escape" — lyses the vacuole and replicates in cytosol
  • "reroute" — redirects vesicular traffic to build a different compartment
  • "modified_compartment" — creates a non-degradative niche (e.g. Salmonella)

This is a small-scale demonstration. With only 5 pathogens the dataset is tiny,
so predictions are illustrative. In practice you'd scale to dozens of pathogens.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

from hostpathogen.data.loader import to_df


def extract_features() -> tuple[pd.DataFrame, pd.Series]:
    """
    Build a feature matrix from effector data.

    Features per pathogen:
      • Number of effectors
      • Number of distinct host protein targets
      • Number of distinct interaction types
      • Number of T3SS effectors
      • Number of T4SS effectors
      • Diversity score: number of distinct host pathways targeted

    Returns (X, y) where X is a DataFrame of features and y is the
    strategy label Series.
    """
    # Get effector counts per pathogen
    effector_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(*) AS n_effectors
        FROM effectors e JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)

    # Get distinct host targets per pathogen
    target_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT hp.id) AS n_targets
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)

    # Get distinct interaction types per pathogen
    type_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT et.interaction_type) AS n_interaction_types
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)

    # Count T3SS and T4SS effectors per pathogen
    secretion_counts = to_df("""
        SELECT p.name AS pathogen,
            SUM(CASE WHEN e.type LIKE '%T3SS%' THEN 1 ELSE 0 END) AS n_t3ss,
            SUM(CASE WHEN e.type LIKE '%T4SS%' THEN 1 ELSE 0 END) AS n_t4ss
        FROM effectors e JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)

    # Count distinct host pathways targeted per pathogen
    pathway_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT hp.pathway) AS n_pathways
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)

    # Merge all features into one DataFrame
    X = effector_counts.merge(target_counts, on="pathogen")
    X = X.merge(type_counts, on="pathogen")
    X = X.merge(secretion_counts, on="pathogen")
    X = X.merge(pathway_counts, on="pathogen")

    # Target labels
    strategies = to_df("SELECT name AS pathogen, strategy FROM pathogens")
    y_df = X[["pathogen"]].merge(strategies, on="pathogen")

    X = X.drop(columns=["pathogen"])
    y = y_df["strategy"]

    return X, y


def train_classifier(
    test_size: float = 0.3,
    random_state: int = 42,
) -> tuple[RandomForestClassifier, dict]:
    """
    Train a Random Forest classifier on the effector feature matrix.

    Parameters:
        test_size: fraction of data to hold out for testing
        random_state: seed for reproducibility

    Returns:
        (trained_model, report_dict)
    """
    X, y = extract_features()

    # With only 5 samples, stratified split may fail if classes are rare.
    # Fall back to training on everything if split is impossible.
    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=random_state,
            stratify=y,
        )
    except ValueError:
        # Too few samples for stratified split — train on everything
        X_train, X_test, y_train, y_test = X, X, y, y

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=random_state,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    # Predict and evaluate
    y_pred = model.predict(X_test)
    report = classification_report(
        y_test, y_pred,
        output_dict=True,
        zero_division=0,
    )

    return model, report


def plot_feature_importance(model: RandomForestClassifier) -> dict:
    """
    Return feature importance scores from a trained model.

    The Random Forest computes how much each feature contributes
    to the classification decision (higher = more important).
    """
    feature_names = [
        "n_effectors",
        "n_targets",
        "n_interaction_types",
        "n_t3ss",
        "n_t4ss",
        "n_pathways",
    ]
    importances = model.feature_importances_

    # Sort by importance descending
    indices = np.argsort(importances)[::-1]
    return [
        {"feature": feature_names[i], "importance": round(importances[i], 4)}
        for i in indices
    ]


# ---------------------------------------------------------------------------
# Phase 4: Cross-validation + classifier comparison
# ---------------------------------------------------------------------------


def compare_classifiers(random_state: int = 42) -> list[dict]:
    """
    Compare multiple classifiers on the effector feature matrix
    using leave-one-out cross-validation (best for small datasets).

    Models compared:
      - Random Forest
      - Support Vector Machine (RBF kernel)
      - Logistic Regression (multinomial)
      - k-Nearest Neighbours

    Returns a list of dicts with model name and mean CV accuracy.
    """
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import SVC
    from sklearn.linear_model import LogisticRegression
    from sklearn.neighbors import KNeighborsClassifier
    from sklearn.model_selection import LeaveOneOut, cross_val_score

    X, y = extract_features()

    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=100, random_state=random_state, class_weight="balanced"
        ),
        "SVM (RBF)": SVC(kernel="rbf", gamma="scale", class_weight="balanced", random_state=random_state),
        "Logistic Regression": LogisticRegression(
            max_iter=1000, random_state=random_state
        ),
        "k-NN (k=3)": KNeighborsClassifier(n_neighbors=3),
    }

    # Leave-One-Out cross-validation (best for N=5)
    cv = LeaveOneOut()
    results = []

    for name, model in models.items():
        scores = cross_val_score(model, X, y, cv=cv)
        results.append(
            {
                "model": name,
                "mean_accuracy": round(float(scores.mean()), 4),
                "std_accuracy": round(float(scores.std()), 4),
                "per_fold": [round(float(s), 4) for s in scores],
            }
        )

    results.sort(key=lambda x: x["mean_accuracy"], reverse=True)
    return results


def cross_validate_rf(random_state: int = 42) -> dict:
    """
    Detailed cross-validation report for the Random Forest classifier
    using Leave-One-Out. Shows per-fold predictions vs true labels.
    """
    from sklearn.model_selection import LeaveOneOut

    X, y = extract_features()
    all_names = to_df("SELECT name FROM pathogens ORDER BY name")["name"].tolist()

    cv = LeaveOneOut()
    fold_results = []

    for fold_idx, (train_idx, test_idx) in enumerate(cv.split(X)):
        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

        model = RandomForestClassifier(
            n_estimators=100, random_state=random_state, class_weight="balanced"
        )
        model.fit(X_train, y_train)
        pred = model.predict(X_test)[0]

        fold_results.append(
            {
                "fold": fold_idx + 1,
                "pathogen": all_names[test_idx[0]],
                "true_strategy": str(y_test.iloc[0]),
                "predicted_strategy": str(pred),
                "correct": bool(pred == y_test.iloc[0]),
            }
        )

    n_correct = sum(r["correct"] for r in fold_results)
    return {
        "n_folds": len(fold_results),
        "n_correct": n_correct,
        "accuracy": round(n_correct / len(fold_results), 4),
        "folds": fold_results,
    }


def grid_search_rf(random_state: int = 42) -> dict:
    """
    Perform a grid search over Random Forest hyperparameters
    using cross-validation. Demonstrates hyperparameter tuning.
    """
    from sklearn.model_selection import GridSearchCV, LeaveOneOut

    X, y = extract_features()

    param_grid = {
        "n_estimators": [10, 50, 100, 200],
        "max_depth": [None, 3, 5, 10],
        "min_samples_split": [2, 3, 5],
    }

    rf = RandomForestClassifier(random_state=random_state, class_weight="balanced")
    grid = GridSearchCV(
        rf,
        param_grid,
        cv=LeaveOneOut(),
        scoring="accuracy",
        n_jobs=-1,
    )
    grid.fit(X, y)

    return {
        "best_params": grid.best_params_,
        "best_score": round(float(grid.best_score_), 4),
        "all_results": [
            {
                "params": params,
                "mean_score": round(float(score), 4),
            }
            for params, score in zip(
                grid.cv_results_["params"], grid.cv_results_["mean_test_score"]
            )
        ],
    }
