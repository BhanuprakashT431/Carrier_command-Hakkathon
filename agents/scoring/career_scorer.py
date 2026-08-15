def calculate_career_score(
    skill: float,
    interest: float,
    goal: float,
    market: float,
    learning: float,
    experience: float
) -> float:
    """
    Computes a deterministic career match score based on individual components.
    Formula: 0.25*Skill + 0.20*Interest + 0.15*Goal + 0.20*Market + 0.10*Learning + 0.10*Experience
    """
    def safe_float(val):
        if val is None:
            return 0.0
        try:
            val = float(val)
            if val < 0.0:
                return 0.0
            if val > 100.0:
                return 100.0
            return val
        except (ValueError, TypeError):
            return 0.0

    s = safe_float(skill)
    i = safe_float(interest)
    g = safe_float(goal)
    m = safe_float(market)
    l = safe_float(learning)
    e = safe_float(experience)

    return (0.25 * s) + (0.20 * i) + (0.15 * g) + (0.20 * m) + (0.10 * l) + (0.10 * e)

def calculate_stress_adjusted_score(base_score: float, deltas: list[float]) -> float:
    """Base + sum(deltas)"""
    return max(0.0, min(100.0, base_score + sum(deltas)))

def calculate_robustness_score(passed_scenarios: int, failed_scenarios: int, uncertain_scenarios: int) -> float:
    """passed / applicable"""
    applicable_scenarios = passed_scenarios + failed_scenarios + uncertain_scenarios
    if applicable_scenarios <= 0:
        return 0.0
    return (passed_scenarios / applicable_scenarios) * 100.0

def calculate_stability_score(
    skill: float, interest: float, goal: float, market: float, learning: float, experience: float
) -> float:
    """Run ±5% perturbation on profile, verify ranking change."""
    base = calculate_career_score(skill, interest, goal, market, learning, experience)
    plus = calculate_career_score(skill*1.05, interest*1.05, goal*1.05, market*1.05, learning*1.05, experience*1.05)
    minus = calculate_career_score(skill*0.95, interest*0.95, goal*0.95, market*0.95, learning*0.95, experience*0.95)
    
    max_diff = max(abs(base - plus), abs(base - minus))
    return max(0.0, min(100.0, 100.0 - max_diff))

def calculate_evidence_metrics(verified_claims: int, contradicted_claims: int, unverified_claims: int, total_claims: int) -> tuple[float, float]:
    """Returns (coverage, unsupported_rate)"""
    if total_claims <= 0:
        return 0.0, 0.0
    coverage = (verified_claims / total_claims) * 100.0
    unsupported_rate = ((contradicted_claims + unverified_claims) / total_claims) * 100.0
    return coverage, unsupported_rate
