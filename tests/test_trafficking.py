"""
Tests for the trafficking module.
Uses the pre-built hostpathogen.db.
"""

from hostpathogen.trafficking import PhagosomeMaturation


def test_stage_names_loaded():
    """Should have exactly 5 stages in order."""
    pm = PhagosomeMaturation()
    assert len(pm.stage_names) == 5
    assert pm.stage_names[0] == "Pre-phagocytosis"
    assert pm.stage_names[-1] == "Phagolysosome"


def test_get_stage_early():
    """Rab5 + EEA1 + PI3P should match Early phagosome."""
    pm = PhagosomeMaturation()
    stage = pm.get_stage(["Rab5", "EEA1", "PI3P"])
    assert stage == "Early phagosome"


def test_get_stage_late():
    """Rab7 + LAMP1 + M6PR should match Late phagosome (M6PR is absent in Phagolysosome)."""
    pm = PhagosomeMaturation()
    stage = pm.get_stage(["Rab7", "LAMP1", "M6PR"])
    assert stage == "Late phagosome"


def test_get_stage_pre():
    """PI(4,5)P2 only should match Pre-phagocytosis."""
    pm = PhagosomeMaturation()
    stage = pm.get_stage(["PI(4,5)P2"])
    assert stage == "Pre-phagocytosis"


def test_stage_info_keys():
    """stage_info should contain expected fields."""
    pm = PhagosomeMaturation()
    info = pm.stage_info("Early phagosome")
    assert "time_range" in info
    assert "ph_min" in info
    assert "ph_max" in info
    assert "markers_present" in info
    assert "markers_absent" in info
    assert "active_pathogens" in info


def test_trajectory():
    """Simulate a time course through maturation."""
    pm = PhagosomeMaturation()
    snapshots = [
        ["PI(4,5)P2"],
        ["Rab5", "EEA1", "PI3P"],
        ["Rab7", "LAMP1"],
    ]
    stages = pm.plot_trajectory(snapshots)
    assert len(stages) == 3
