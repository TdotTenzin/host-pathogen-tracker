"""
classifier.py — Predict pathogen evasion strategy from effector features.

Given a pathogen's set of effectors, predict whether its intracellular
survival strategy is:
  • "arrest" — blocks phagosome maturation
  • "escape" — lyses the vacuole and replicates in cytosol
  • "reroute" — redirects vesicular traffic to build a different compartment
  • "modified_compartment" — creates a non-degradative niche (e.g. Salmonella)
  • "extracellular" — survives extracellularly, resists phagocytosis
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.metrics import classification_report, confusion_matrix

from hostpathogen.data.loader import to_df


FEATURE_NAMES = [
    "n_effectors",
    "n_targets",
    "n_interaction_types",
    "n_t3ss",
    "n_t4ss",
    "n_t6ss",
    "n_toxins",
    "n_surface_proteins",
    "n_invasins",
    "n_pathways",
    "n_localizations",
]


def extract_features() -> tuple[pd.DataFrame, pd.Series]:
    """
    Build a feature matrix from effector data (11 features, 54 pathogens).

    Returns (X, y).
    """
    effector_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(*) AS n_effectors
        FROM effectors e JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)
    target_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT hp.id) AS n_targets
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)
    type_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT et.interaction_type) AS n_interaction_types
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)
    secretion_counts = to_df("""
        SELECT p.name AS pathogen,
            SUM(CASE WHEN e.type LIKE '%T3SS%' THEN 1 ELSE 0 END) AS n_t3ss,
            SUM(CASE WHEN e.type LIKE '%T4SS%' THEN 1 ELSE 0 END) AS n_t4ss,
            SUM(CASE WHEN e.type LIKE '%T6SS%' THEN 1 ELSE 0 END) AS n_t6ss
        FROM effectors e JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)
    type_diversity = to_df("""
        SELECT p.name AS pathogen,
            SUM(CASE WHEN e.type LIKE '%Toxin%' OR e.type LIKE '%AB toxin%' OR e.type LIKE '%Pore-forming%' OR e.type LIKE '%Cholesterol-dependent%' THEN 1 ELSE 0 END) AS n_toxins,
            SUM(CASE WHEN e.type LIKE '%Surface protein%' OR e.type LIKE '%Outer membrane%' OR e.type LIKE '%Porin%' THEN 1 ELSE 0 END) AS n_surface_proteins,
            SUM(CASE WHEN e.type LIKE '%Invasin%' OR e.type LIKE '%Adhesin%' OR e.type LIKE '%Autotransporter%' THEN 1 ELSE 0 END) AS n_invasins
        FROM effectors e JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)
    pathway_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT hp.pathway) AS n_pathways
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)
    localization_counts = to_df("""
        SELECT p.name AS pathogen, COUNT(DISTINCT hp.localization) AS n_localizations
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
        GROUP BY p.name
    """)

    X = effector_counts.merge(target_counts, on="pathogen")
    X = X.merge(type_counts, on="pathogen")
    X = X.merge(secretion_counts, on="pathogen")
    X = X.merge(type_diversity, on="pathogen")
    X = X.merge(pathway_counts, on="pathogen")
    X = X.merge(localization_counts, on="pathogen")

    strategies = to_df("SELECT name AS pathogen, strategy FROM pathogens")
    y_df = X[["pathogen"]].merge(strategies, on="pathogen")
    X = X.drop(columns=["pathogen"])
    y = y_df["strategy"]
    return X, y


def train_classifier(
    test_size: float = 0.2,
    random_state: int = 42,
) -> tuple[RandomForestClassifier, dict]:
    """
    Train a Random Forest classifier. With 54 pathogens, we can do proper splits.
    """
    X, y = extract_features()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y,
    )
    model = RandomForestClassifier(
        n_estimators=100, random_state=random_state, class_weight="balanced",
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    return model, report


def plot_feature_importance(model: RandomForestClassifier) -> dict:
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    return [
        {"feature": FEATURE_NAMES[i], "importance": round(importances[i], 4)}
        for i in indices
    ]


# ---------------------------------------------------------------------------
# Cross-validation + classifier comparison (N=54 → 5-fold CV)
# ---------------------------------------------------------------------------

_STRATIFIED_KWARGS = {"n_splits": 5, "shuffle": True, "random_state": 42}


def compare_classifiers(random_state: int = 42) -> list[dict]:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import SVC
    from sklearn.linear_model import LogisticRegression
    from sklearn.neighbors import KNeighborsClassifier
    from sklearn.model_selection import cross_val_score

    X, y = extract_features()

    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=100, random_state=random_state, class_weight="balanced"
        ),
        "SVM (RBF)": SVC(kernel="rbf", gamma="scale", class_weight="balanced", random_state=random_state),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=random_state),
        "k-NN (k=5)": KNeighborsClassifier(n_neighbors=5),
    }

    cv = StratifiedKFold(**_STRATIFIED_KWARGS)
    results = []
    for name, model in models.items():
        scores = cross_val_score(model, X, y, cv=cv)
        results.append({
            "model": name,
            "mean_accuracy": round(float(scores.mean()), 4),
            "std_accuracy": round(float(scores.std()), 4),
            "per_fold": [round(float(s), 4) for s in scores],
        })
    results.sort(key=lambda x: x["mean_accuracy"], reverse=True)
    return results


def cross_validate_rf(random_state: int = 42) -> dict:
    from sklearn.model_selection import StratifiedKFold

    X, y = extract_features()
    all_names = to_df("SELECT name FROM pathogens ORDER BY name")["name"].tolist()

    cv = StratifiedKFold(**_STRATIFIED_KWARGS)
    fold_results = []
    for fold_idx, (train_idx, test_idx) in enumerate(cv.split(X, y)):
        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
        model = RandomForestClassifier(
            n_estimators=100, random_state=random_state, class_weight="balanced"
        )
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        for i, idx in enumerate(test_idx):
            fold_results.append({
                "fold": fold_idx + 1,
                "pathogen": all_names[idx],
                "true_strategy": str(y_test.iloc[i]),
                "predicted_strategy": str(preds[i]),
                "correct": bool(preds[i] == y_test.iloc[i]),
            })

    n_correct = sum(r["correct"] for r in fold_results)
    return {
        "n_folds": 5,
        "n_correct": n_correct,
        "accuracy": round(n_correct / len(fold_results), 4),
        "folds": fold_results,
    }


def grid_search_rf(random_state: int = 42) -> dict:
    from sklearn.model_selection import GridSearchCV, StratifiedKFold

    X, y = extract_features()
    param_grid = {
        "n_estimators": [50, 100, 200],
        "max_depth": [None, 5, 10],
        "min_samples_split": [2, 5],
    }
    rf = RandomForestClassifier(random_state=random_state, class_weight="balanced")
    grid = GridSearchCV(rf, param_grid, cv=StratifiedKFold(**_STRATIFIED_KWARGS), scoring="accuracy", n_jobs=-1)
    grid.fit(X, y)
    return {
        "best_params": grid.best_params_,
        "best_score": round(float(grid.best_score_), 4),
        "all_results": [
            {"params": p, "mean_score": round(float(s), 4)}
            for p, s in zip(grid.cv_results_["params"], grid.cv_results_["mean_test_score"])
        ],
    }
