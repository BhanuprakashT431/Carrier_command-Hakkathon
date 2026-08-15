import pytest
from scoring.career_scorer import (
    calculate_career_score,
    calculate_stress_adjusted_score,
    calculate_robustness_score,
    calculate_stability_score,
    calculate_evidence_metrics
)

def test_normal_values():
    score = calculate_career_score(80, 70, 90, 60, 50, 40)
    # 0.25*80 + 0.20*70 + 0.15*90 + 0.20*60 + 0.10*50 + 0.10*40
    # 20 + 14 + 13.5 + 12 + 5 + 4 = 68.5
    assert score == 68.5

def test_zero_values():
    score = calculate_career_score(0, 0, 0, 0, 0, 0)
    assert score == 0.0

def test_max_values():
    score = calculate_career_score(100, 100, 100, 100, 100, 100)
    assert score == 100.0

def test_missing_values():
    score = calculate_career_score(None, 70, None, 60, 50, None)
    # 0 + 14 + 0 + 12 + 5 + 0 = 31.0
    assert score == 31.0

def test_invalid_values():
    score = calculate_career_score("invalid", 70, {}, 60, 50, [])
    # 0 + 14 + 0 + 12 + 5 + 0 = 31.0
    assert score == 31.0

def test_out_of_bounds_values():
    score = calculate_career_score(150, -20, 90, 60, 50, 40)
    # 150 -> 100
    # -20 -> 0
    # 0.25*100 + 0.20*0 + 0.15*90 + 0.20*60 + 0.10*50 + 0.10*40
    # 25 + 0 + 13.5 + 12 + 5 + 4 = 59.5
    assert score == 59.5

def test_stress_adjusted_score():
    assert calculate_stress_adjusted_score(80.0, [-10.0, -5.0]) == 65.0
    assert calculate_stress_adjusted_score(10.0, [-20.0]) == 0.0
    assert calculate_stress_adjusted_score(90.0, [20.0]) == 100.0

def test_robustness_score():
    assert calculate_robustness_score(8, 1, 1) == 80.0
    assert calculate_robustness_score(0, 0, 0) == 0.0
    assert calculate_robustness_score(5, 0, 0) == 100.0
    assert calculate_robustness_score(6, 2, 2) == 60.0

def test_stability_score():
    score = calculate_stability_score(80, 70, 90, 60, 50, 40)
    # base is 68.5
    # plus +5% is 1.05 * 68.5 = 71.925
    # minus -5% is 0.95 * 68.5 = 65.075
    # max_diff is 3.425
    # stability is 100 - 3.425 = 96.575
    assert score == pytest.approx(96.575)

def test_evidence_metrics():
    cov, unsupp = calculate_evidence_metrics(5, 2, 1, 10)
    assert cov == 50.0
    assert unsupp == 30.0
    
    cov, unsupp = calculate_evidence_metrics(0, 0, 0, 0)
    assert cov == 0.0
    assert unsupp == 0.0
