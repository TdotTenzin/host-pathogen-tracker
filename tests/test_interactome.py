"""
Tests for the interactome module (network construction + centrality analysis).
"""

import networkx as nx

from hostpathogen.interactome import (
    build_network,
    hub_targets,
    pathogen_subgraph,
    network_stats,
)


def test_build_network_returns_graph():
    """build_network should return a non-empty NetworkX graph."""
    G = build_network()
    assert isinstance(G, nx.Graph)
    assert G.number_of_nodes() > 0
    assert G.number_of_edges() > 0


def test_build_network_has_both_node_types():
    """Graph should contain both effector and host_protein typed nodes."""
    G = build_network()
    types = set()
    for _, attr in G.nodes(data=True):
        types.add(attr.get("type"))
    assert "effector" in types
    assert "host_protein" in types


def test_hub_targets_returns_sorted():
    """hub_targets should return top hubs sorted by degree descending."""
    G = build_network()
    hubs = hub_targets(G, top_n=10)
    assert len(hubs) <= 10
    assert len(hubs) > 0
    degrees = [h["degree"] for h in hubs]
    assert degrees == sorted(degrees, reverse=True)
    for h in hubs:
        assert "host" in h
        assert "centrality" in h


def test_pathogen_subgraph_known_pathogen():
    """Salmonella enterica should have at least one effector in its subgraph."""
    G = build_network()
    sub = pathogen_subgraph(G, "Salmonella enterica")
    assert sub.number_of_nodes() > 0
    effector_nodes = [
        n for n, attr in sub.nodes(data=True)
        if attr.get("type") == "effector"
    ]
    assert len(effector_nodes) > 0


def test_pathogen_subgraph_unknown_pathogen_empty():
    """Unknown pathogen name should produce an empty subgraph."""
    G = build_network()
    sub = pathogen_subgraph(G, "Nonexistent Pathogen")
    assert sub.number_of_nodes() == 0


def test_network_stats_keys():
    """network_stats should return expected summary fields."""
    G = build_network()
    stats = network_stats(G)
    for key in [
        "total_nodes",
        "host_proteins",
        "effectors",
        "total_interactions",
        "density",
    ]:
        assert key in stats
    assert stats["total_nodes"] == stats["host_proteins"] + stats["effectors"]
