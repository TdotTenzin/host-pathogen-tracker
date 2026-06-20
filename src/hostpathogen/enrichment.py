"""
enrichment.py — Pathway over-representation analysis.

Given a list of host proteins of interest (e.g. those targeted by a
particular pathogen), test whether a specific pathway is enriched
using the hypergeometric distribution (Fisher's exact test).

The "pathway database" here is derived from the curated host_proteins
table, where each protein is annotated with a 'pathway' column.
"""

from scipy.stats import hypergeom
from hostpathogen.data.loader import to_df


def _get_pathway_sizes() -> dict[str, int]:
    """
    Count how many host proteins belong to each pathway.
    This defines our "pathway database" — the background.
    """
    df = to_df("SELECT pathway, COUNT(*) AS n FROM host_proteins GROUP BY pathway")
    return dict(zip(df["pathway"], df["n"]))


def _get_pathway_members(pathway: str) -> list[str]:
    """Return all host protein names in a given pathway."""
    df = to_df(
        "SELECT name FROM host_proteins WHERE pathway = ?",
        (pathway,),
    )
    return df["name"].tolist()


def overrepresentation_analysis(
    gene_list: list[str],
    pathway_db: dict[str, list[str]] | None = None,
    background_size: int | None = None,
) -> list[dict]:
    """
    Perform a hypergeometric over-representation test for each pathway.

    Parameters:
        gene_list: list of host protein names observed in your experiment
        pathway_db: dict of {pathway_name: [protein_names,...]},
                    auto-built from the hostpathogen DB if not provided
        background_size: total number of distinct proteins in the universe
                         (default: total distinct host proteins in DB)

    Returns:
        list of dicts sorted by p-value ascending:
        [{"pathway": "Endocytosis", "ratio": "3/5", "p_value": 0.002, ...}]
    """
    # Build pathway database from our curated data if not provided
    if pathway_db is None:
        pathway_sizes = _get_pathway_sizes()
        pathway_db = {}
        for pathway in pathway_sizes:
            pathway_db[pathway] = _get_pathway_members(pathway)

    # Background: total number of distinct host proteins
    if background_size is None:
        all_proteins = set()
        for members in pathway_db.values():
            all_proteins.update(members)
        background_size = len(all_proteins)

    # Convert gene_list to a set for fast intersection
    observed = set(gene_list)

    results = []
    for pathway, members in pathway_db.items():
        pathway_set = set(members)

        # Contingency table values
        k = len(observed & pathway_set)       # hits in our list
        n = len(observed)                      # total in our list
        K = len(pathway_set)                   # total in this pathway
        N = background_size                    # total background

        if k == 0:
            continue  # skip pathways with no overlap

        # Hypergeometric test: probability of seeing k or more hits by chance
        p_val = hypergeom.sf(k - 1, N, K, n)

        # Bonferroni correction
        num_tests = len([p for p in pathway_db if len(set(pathway_db[p]) & observed) > 0])
        p_adjusted = min(p_val * max(num_tests, 1), 1.0)

        results.append({
            "pathway": pathway,
            "ratio": f"{k}/{K}",
            "observed_in_list": k,
            "pathway_size": K,
            "p_value": round(p_val, 6),
            "p_adjusted": round(p_adjusted, 6),
            "members_hit": sorted(observed & pathway_set),
        })

    results.sort(key=lambda x: x["p_value"])
    return results


def targeted_pathways_by_pathogen(pathogen_name: str) -> list[dict]:
    """
    Convenience: which host pathways does a given pathogen target?
    Runs over-representation on all host proteins targeted by
    any effector of that pathogen.
    """
    df = to_df("""
        SELECT DISTINCT hp.name
        FROM effector_targets et
        JOIN effectors e ON et.effector_id = e.id
        JOIN host_proteins hp ON et.host_protein_id = hp.id
        JOIN pathogens p ON e.pathogen_id = p.id
        WHERE p.name = ?
    """, (pathogen_name,))

    targeted_proteins = df["name"].tolist()
    return overrepresentation_analysis(targeted_proteins)
