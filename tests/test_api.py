"""
Tests for the FastAPI HTTP endpoints.
"""

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Ensure the repo root and src are importable in this test.
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from api.index import app  # noqa: E402

client = TestClient(app)


def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_list_pathogens():
    resp = client.get("/api/pathogens")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_pathogen_known():
    resp = client.get("/api/pathogens/Salmonella enterica")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Salmonella enterica"


def test_get_pathogen_unknown_404():
    resp = client.get("/api/pathogens/Nonexistent")
    assert resp.status_code == 404


def test_list_effectors():
    resp = client.get("/api/effectors?limit=10")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) <= 10


def test_pathogen_effectors():
    resp = client.get("/api/pathogens/Salmonella enterica/effectors")
    assert resp.status_code == 200
    rows = resp.json()
    assert len(rows) > 0
    assert "effector" in rows[0]


def test_trafficking_stages():
    resp = client.get("/api/trafficking/stages")
    assert resp.status_code == 200
    stages = resp.json()
    assert len(stages) == 5


def test_predict_stage():
    resp = client.post(
        "/api/trafficking/predict-stage",
        json={"markers": ["Rab5", "EEA1", "PI3P"]},
    )
    assert resp.status_code == 200
    assert "name" in resp.json()


def test_interactome_hubs():
    resp = client.get("/api/interactome/hubs?top_n=5")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) <= 5
    assert len(data) > 0


def test_interactome_pathogen_subgraph():
    resp = client.get("/api/interactome/pathogen/Salmonella enterica")
    assert resp.status_code == 200
    body = resp.json()
    assert "nodes" in body
    assert "edges" in body
    assert len(body["nodes"]) > 0


def test_interactome_stats():
    resp = client.get("/api/interactome/stats")
    assert resp.status_code == 200
    body = resp.json()
    assert "total_nodes" in body
    assert "host_proteins" in body


def test_enrichment_pathogen():
    resp = client.get("/api/enrichment/pathogen/Salmonella enterica")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_ml_predict():
    resp = client.get("/api/ml/predict/Salmonella enterica")
    assert resp.status_code == 200
    body = resp.json()
    assert "predicted_strategy" in body
    assert "actual_strategy" in body


def test_ml_pathogen_pca():
    resp = client.get("/api/ml/pathogen-pca")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["samples"]) == 54


def test_pathogen_phylogeny():
    resp = client.get("/api/ml/phylogeny")
    assert resp.status_code == 200
    body = resp.json()
    assert "newick" in body
    assert "colour_map" in body


def test_bootstrap():
    resp = client.get("/api/bootstrap")
    assert resp.status_code == 200
    body = resp.json()
    for key in ["pathogens", "effectors", "stages", "hubs", "host_proteins"]:
        assert key in body


def test_stats():
    resp = client.get("/api/stats")
    assert resp.status_code == 200
    body = resp.json()
    assert body["pathogens"] == 54
    assert body["effectors"] > 0
