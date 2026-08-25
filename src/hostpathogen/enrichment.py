"""
enrichment.py — Pathway over-representation analysis.

Given a list of host proteins of interest (e.g. those targeted by a
particular pathogen), test whether a specific pathway is enriched
using the hypergeometric distribution (Fisher's exact test).

The "pathway database" here is derived from the curated host_proteins
table, where each protein is annotated with a 'pathway' column.

Optimizations:
  - Module-level caching of pathway database (static data)
  - Pre-computed num_tests for Bonferroni correction
"""

from math import comb

from hostpathogen.data.loader import to_df


def _hypergeom_sf(k: int, N: int, K: int, n: int) -> float:
    """Survival function P(X >= k) for hypergeometric distribution."""
    if k <= 0:
        return 1.0
    k = max(k, 0)
    upper = min(n, K)
    denom = comb(N, n)
    return sum(comb(K, i) * comb(N - K, n - i) for i in range(k, upper + 1)) / denom

# Module-level cache for pathway database
_cached_pathway_db = None


def _get_pathway_sizes() -> dict[str, int]:
    df = to_df("SELECT pathway, COUNT(*) AS n FROM host_proteins GROUP BY pathway")
    return dict(zip(df["pathway"], df["n"]))


def _get_pathway_members(pathway: str) -> list[str]:
    df = to_df("SELECT name FROM host_proteins WHERE pathway = ?", (pathway,))
    return df["name"].tolist()


def _build_pathway_db() -> dict[str, list[str]]:
    global _cached_pathway_db
    if _cached_pathway_db is not None:
        return _cached_pathway_db
    pathway_sizes = _get_pathway_sizes()
    _cached_pathway_db = {}
    for pathway in pathway_sizes:
        _cached_pathway_db[pathway] = _get_pathway_members(pathway)
    return _cached_pathway_db


def overrepresentation_analysis(
    gene_list: list[str],
    pathway_db: dict[str, list[str]] | None = None,
    background_size: int | None = None,
) -> list[dict]:
    if pathway_db is None:
        pathway_db = _build_pathway_db()

    if background_size is None:
        all_proteins = set()
        for members in pathway_db.values():
            all_proteins.update(members)
        background_size = len(all_proteins)

    observed = set(gene_list)

    num_tests = sum(
        1 for members in pathway_db.values()
        if len(set(members) & observed) > 0
    )

    results = []
    for pathway, members in pathway_db.items():
        pathway_set = set(members)
        k = len(observed & pathway_set)
        n = len(observed)
        K = len(pathway_set)
        N = background_size

        if k == 0:
            continue

        p_val = _hypergeom_sf(k, N, K, n)
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
