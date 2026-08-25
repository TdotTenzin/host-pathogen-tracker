"""
interactome.py — Host-pathogen interaction network analysis.

Builds a bipartite network where:
  • Nodes are either pathogens (effectors) or host proteins
  • Edges represent "effector targets host protein" relationships

Provides centrality analysis to identify hub host proteins
that are targeted by many different pathogens.
"""

import networkx as nx

from hostpathogen.data.loader import to_df


def build_network() -> nx.Graph:
    """
    Build a NetworkX graph from the effector_targets table.

    Nodes: host proteins (prefixed "H:") and effectors (prefixed "E:").
    Edges: directed from effector to host target.

    Returns an undirected graph (for centrality metrics) with bipartite
    attributes so we can colour nodes by type.
    """
    df = to_df("""
        SELECT
            e.name AS effector,
            p.name AS pathogen,
            hp.name AS host_protein,
            et.interaction_type
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
    """)

    G = nx.Graph()

    for _, row in df.iterrows():
        effector_node = f"E:{row['effector']}"
        host_node = f"H:{row['host_protein']}"

        # Store effector metadata
        G.add_node(effector_node, type="effector", pathogen=row["pathogen"])
        # Store host metadata
        G.add_node(host_node, type="host_protein")
        # Edge with interaction type
        G.add_edge(
            effector_node,
            host_node,
            interaction=row["interaction_type"],
        )

    return G


def hub_targets(G: nx.Graph, top_n: int = 10) -> list[dict]:
    """
    Return the host proteins with highest degree centrality
    (targeted by the most effectors).

    Parameters:
        G: network returned by build_network()
        top_n: how many top hubs to return

    Returns a list of dicts:
        [{"host": "Rab1", "degree": 6, "centrality": 0.32}, ...]
    """
    # Filter to only host-protein nodes
    host_nodes = [
        n for n, attr in G.nodes(data=True)
        if attr.get("type") == "host_protein"
    ]

    centrality = nx.degree_centrality(G)
    results = []
    for node in host_nodes:
        host_name = node.replace("H:", "")
        results.append({
            "host": host_name,
            "degree": G.degree(node),
            "centrality": round(centrality[node], 4),
        })

    results.sort(key=lambda x: x["degree"], reverse=True)
    return results[:top_n]


def pathogen_subgraph(G: nx.Graph, pathogen_name: str) -> nx.Graph:
    """
    Extract the subgraph of effectors from a specific pathogen
    and all host proteins they target.

    Useful for visualising "what does this pathogen touch?"
    """
    # Find all effector nodes belonging to this pathogen
    pathogen_effectors = [
        n for n, attr in G.nodes(data=True)
        if attr.get("type") == "effector"
        and attr.get("pathogen") == pathogen_name
    ]

    # Get their neighbours (host proteins)
    relevant_nodes = set(pathogen_effectors)
    for e in pathogen_effectors:
        relevant_nodes.update(G.neighbors(e))

    return G.subgraph(relevant_nodes).copy()


def network_stats(G: nx.Graph) -> dict:
    """
    Return summary statistics about the interaction network.
    """
    host_nodes = [
        n for n, attr in G.nodes(data=True)
        if attr.get("type") == "host_protein"
    ]
    effector_nodes = [
        n for n, attr in G.nodes(data=True)
        if attr.get("type") == "effector"
    ]

    return {
        "total_nodes": G.number_of_nodes(),
        "host_proteins": len(host_nodes),
        "effectors": len(effector_nodes),
        "total_interactions": G.number_of_edges(),
        "density": nx.density(G),
    }
