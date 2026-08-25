"""
api/interactome.py — Interaction network endpoints.
Dependencies: fastapi, pydantic, pandas, numpy, networkx
"""

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "src"))

from fastapi import FastAPI, Query
from hostpathogen.interactome import build_network, hub_targets, network_stats, pathogen_subgraph

app = FastAPI()


# ---------------------------------------------------------------------------
# Shared cache
# ---------------------------------------------------------------------------

_cached_network = None


def _get_cached_network():
    """Build network graph once and reuse across requests."""
    global _cached_network
    if _cached_network is None:
        _cached_network = build_network()
    return _cached_network


# ---------------------------------------------------------------------------
# Interactome / network
# ---------------------------------------------------------------------------


@app.get("/api/interactome/hubs")
async def get_hubs(top_n: int = Query(10, description="Number of top hubs to return")):
    G = _get_cached_network()
    return hub_targets(G, top_n=top_n)


@app.get("/api/interactome/stats")
async def get_network_stats():
    G = _get_cached_network()
    return network_stats(G)


@app.get("/api/interactome/pathogen/{name}")
async def get_pathogen_subgraph(name: str):
    G = _get_cached_network()
    sub = pathogen_subgraph(G, name)

    nodes = [
        {"id": n, "type": attr.get("type"), "pathogen": attr.get("pathogen")}
        for n, attr in sub.nodes(data=True)
    ]
    edges = [
        {"source": u, "target": v, "interaction": attr.get("interaction")}
        for u, v, attr in sub.edges(data=True)
    ]
    return {"nodes": nodes, "edges": edges}
