"""
api/ml_classifier.py — ML classifier endpoints (strategy prediction).
Dependencies: fastapi, pydantic, pandas, numpy, scikit-learn
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, HTTPException
from hostpathogen.ml.classifier import (
    extract_features,
    train_classifier,
    compare_classifiers,
    cross_validate_rf,
    grid_search_rf,
)

app = FastAPI()


# ---------------------------------------------------------------------------
# Shared cache
# ---------------------------------------------------------------------------

_cached_model = None
_cached_features = None
_cached_model_features_key = None


def _get_cached_model_and_features():
    """Train ML model once and cache both model and features."""
    global _cached_model, _cached_features, _cached_model_features_key
    current_key = "static"
    if _cached_model_features_key != current_key:
        _cached_features = extract_features()
        _cached_model, _ = train_classifier()
        _cached_model_features_key = current_key
    return _cached_model, _cached_features


# ---------------------------------------------------------------------------
# ML / classifier (cached model)
# ---------------------------------------------------------------------------


@app.get("/api/ml/predict/{pathogen_name}")
async def predict_strategy(pathogen_name: str):
    model, (X, y) = _get_cached_model_and_features()

    all_pathogens = query("SELECT name FROM pathogens ORDER BY name")
    names = [r["name"] for r in all_pathogens]

    if pathogen_name not in names:
        raise HTTPException(
            status_code=404, detail=f"Pathogen '{pathogen_name}' not found"
        )

    idx = names.index(pathogen_name)
    features = X.iloc[[idx]]
    pred = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    confidence = round(float(max(proba)), 4)

    importances = [
        {"feature": col, "importance": round(float(imp), 4)}
        for col, imp in zip(X.columns, model.feature_importances_)
    ]
    importances.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "pathogen": pathogen_name,
        "predicted_strategy": str(pred),
        "actual_strategy": str(y.iloc[idx]),
        "confidence": confidence,
        "feature_importances": importances,
    }


@app.get("/api/ml/features")
async def get_feature_matrix():
    _, (X, y) = _get_cached_model_and_features()
    df = X.copy()
    df["strategy"] = y.values
    return df.to_dict(orient="records")


@app.get("/api/ml/compare-classifiers")
async def compare_models():
    return compare_classifiers()


@app.get("/api/ml/cross-validate")
async def cross_validate_rf_endpoint():
    return cross_validate_rf()


@app.get("/api/ml/grid-search")
async def grid_search():
    return grid_search_rf()


from hostpathogen.data.loader import query
