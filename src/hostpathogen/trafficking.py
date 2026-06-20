"""
trafficking.py — Phagosome maturation state machine.

Models the 5-stage phagosome maturation pathway as a state machine.
Given a set of molecular markers, infers which stage the phagosome
is in and which pathogens are active at that stage.
"""

from hostpathogen.data.loader import query, to_df


def _build_marker_profiles() -> dict:
    """
    Fetch every (stage_name, protein_name, presence) row from the DB
    and group by stage so we can compare against marker observations.
    Returns {stage_name: {"marker_name": 0_or_1, ...}}
    """
    rows = query("""
        SELECT ms.name AS stage, hp.name AS protein, sm.presence
        FROM stage_markers sm
        JOIN maturation_stages ms ON sm.stage_id = ms.id
        JOIN host_proteins hp ON sm.host_protein_id = hp.id
        ORDER BY ms.stage_order, hp.name
    """)
    profiles: dict[str, dict[str, int]] = {}
    for r in rows:
        stage = r["stage"]
        if stage not in profiles:
            profiles[stage] = {}
        profiles[stage][r["protein"]] = r["presence"]
    return profiles


class PhagosomeMaturation:
    """
    Represents the phagosome maturation pathway with 5 ordered stages.

    Usage:
        pm = PhagosomeMaturation()
        stage = pm.get_stage(["Rab5", "EEA1", "PI3P"])
        print(stage)  # "Early phagosome"

        info = pm.stage_info("Early phagosome")
        print(info["markers_present"])  # ["Rab5", "EEA1", ...]
    """

    def __init__(self):
        # Ordered list of stage names
        rows = query(
            "SELECT name FROM maturation_stages ORDER BY stage_order"
        )
        self.stage_names = [r["name"] for r in rows]

        # Full stage metadata
        self.stages_df = to_df(
            "SELECT * FROM maturation_stages ORDER BY stage_order"
        )

        # Molecular marker profiles per stage
        self._profiles = _build_marker_profiles()

    def get_stage(self, observed_markers: list[str]) -> str | None:
        """
        Given a list of marker names observed in an experiment,
        return the most likely maturation stage name.

        Matching logic: the stage whose marker profile has the highest
        fraction of observed markers that agree with expected presence.
        Only markers defined in the profile are considered.
        """
        observed = set(observed_markers)
        best_stage = None
        best_score = -1

        for stage, profile in self._profiles.items():
            # Count agreements: observed marker + profile says present = good,
            # unobserved marker + profile says absent = also good
            matches = 0
            total = 0
            for marker, expected_present in profile.items():
                is_observed = marker in observed
                if is_observed == bool(expected_present):
                    matches += 1
                total += 1
            score = matches / total if total > 0 else 0
            if score > best_score:
                best_score = score
                best_stage = stage

        return best_stage

    def stage_info(self, stage_name: str) -> dict:
        """
        Return details about a stage: markers present, functional changes,
        pH range, and which pathogens act at this stage.
        """
        row = self.stages_df[self.stages_df["name"] == stage_name]
        if row.empty:
            return {}

        profile = self._profiles.get(stage_name, {})
        markers_present = sorted(
            [m for m, p in profile.items() if p == 1]
        )
        markers_absent = sorted(
            [m for m, p in profile.items() if p == 0]
        )

        # Pathogens whose effectors act at this stage
        pathogens_at_stage = to_df("""
            SELECT DISTINCT p.name AS pathogen
            FROM effectors e
            JOIN pathogens p ON e.pathogen_id = p.id
            JOIN effector_targets et ON e.id = et.effector_id
            JOIN host_proteins hp ON et.host_protein_id = hp.id
            JOIN stage_markers sm ON hp.id = sm.host_protein_id
            JOIN maturation_stages ms ON sm.stage_id = ms.id
            WHERE ms.name = ? AND sm.presence = 1
        """, (stage_name,))

        return {
            "name": stage_name,
            "time_range": row.iloc[0]["time_range"],
            "ph_min": row.iloc[0]["ph_min"],
            "ph_max": row.iloc[0]["ph_max"],
            "description": row.iloc[0]["description"],
            "markers_present": markers_present,
            "markers_absent": markers_absent,
            "active_pathogens": pathogens_at_stage["pathogen"].tolist(),
        }

    def plot_trajectory(self, marker_snapshots: list[list[str]]) -> list[str]:
        """
        Given a time series of marker observations (each snapshot is a list
        of marker names), return the inferred stage at each time point.

        This is useful for live-cell imaging where you track markers over time.

        Example:
            snapshots = [
                ["PI(4,5)P2"],           # t=0
                ["Rab5", "EEA1"],         # t=5 min
                ["Rab7", "LAMP1"],        # t=20 min
            ]
            pm.plot_trajectory(snapshots)
            # → ["Pre-phagocytosis", "Early phagosome", "Late phagosome"]
        """
        return [self.get_stage(snap) for snap in marker_snapshots]
