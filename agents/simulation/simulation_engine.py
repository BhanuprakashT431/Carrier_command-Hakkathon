import copy
from typing import Dict, Any, List
from schemas.agent_schemas import AnalysisResponse
from scoring.career_scorer import calculate_career_score, calculate_stress_adjusted_score

class SimulationEngine:
    def __init__(self):
        pass

    def run_simulation(self, base_analysis: AnalysisResponse, scenario: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs a deterministic simulation on the base analysis data given a specific scenario.
        Returns the structured simulation result including score deltas and ranking changes.
        """
        if not base_analysis.agent_data or "CareerAgent" not in base_analysis.agent_data:
            return {"status": "DATA_UNAVAILABLE", "message": "Career data missing"}

        # 3. Create an immutable copy of the analysis data
        sim_data = copy.deepcopy(base_analysis.agent_data)
        career_data = sim_data.get("CareerAgent", {})

        metrics = {
            "skill": float(career_data.get("SkillMatch", 0)),
            "interest": float(career_data.get("InterestMatch", 0)),
            "goal": float(career_data.get("GoalMatch", 0)),
            "market": float(career_data.get("MarketOpportunity", 0)),
            "learning": float(career_data.get("LearningFeasibility", 0)),
            "experience": float(career_data.get("ExperienceAlignment", 0))
        }

        scenario_type = scenario.get("type", "")
        changes = scenario.get("changes", [])

        # 4. Apply the scenario, deterministically recalculating the affected skill gaps
        if scenario_type == "SKILL_IMPROVEMENT":
            total_improvement = sum([(c.get("new", 0) - c.get("current", 0)) for c in changes if isinstance(c, dict)])
            metrics["skill"] = min(100.0, metrics["skill"] + (total_improvement * 0.1))
            metrics["learning"] = max(0.0, metrics["learning"] - 2.0)

        elif scenario_type == "SKILL_DEGRADATION":
            total_degradation = sum([(c.get("current", 0) - c.get("new", 0)) for c in changes if isinstance(c, dict)])
            metrics["skill"] = max(0.0, metrics["skill"] - (total_degradation * 0.1))

        elif scenario_type == "LEARNING_TIME_CHANGE":
            # e.g., [{"direction": "increase", "amount": 20}]
            for c in changes:
                if c.get("direction") == "increase":
                    metrics["learning"] = min(100.0, metrics["learning"] + c.get("amount", 10.0))
                else:
                    metrics["learning"] = max(0.0, metrics["learning"] - c.get("amount", 10.0))

        elif scenario_type == "MARKET_CHANGE":
            for c in changes:
                if c.get("direction") == "increase":
                    metrics["market"] = min(100.0, metrics["market"] + c.get("amount", 15.0))
                else:
                    metrics["market"] = max(0.0, metrics["market"] - c.get("amount", 15.0))

        elif scenario_type == "EXPERIENCE_INCREASE":
            for c in changes:
                metrics["experience"] = min(100.0, metrics["experience"] + c.get("amount", 10.0))

        elif scenario_type == "PREFERENCE_CHANGE":
            metrics["interest"] = min(100.0, metrics["interest"] + 10.0)

        elif scenario_type == "GOAL_CHANGE":
            metrics["goal"] = min(100.0, metrics["goal"] + 5.0)

        elif scenario_type == "LOCATION_CHANGE":
            metrics["market"] = min(100.0, metrics["market"] + 5.0)
            if "RiskAgent" in sim_data:
                # 6. Recalculate affected Risk factors and Stress metrics
                risks = sim_data["RiskAgent"].get("risks", [])
                risks.append({"type": "Relocation", "severity": "medium", "description": "New location risk added."})
                sim_data["RiskAgent"]["risks"] = risks

        elif scenario_type == "SALARY_TARGET_CHANGE":
            for c in changes:
                if c.get("direction") == "increase":
                    metrics["goal"] = max(0.0, metrics["goal"] - 10.0)
                    metrics["market"] = max(0.0, metrics["market"] - 5.0)
                else:
                    metrics["goal"] = min(100.0, metrics["goal"] + 10.0)
                    metrics["market"] = min(100.0, metrics["market"] + 5.0)

        else:
            return {"status": "INSUFFICIENT_EVIDENCE", "message": f"Unknown scenario type: {scenario_type}"}

        # 5. Recalculate career factors and deterministic Career Scoring (via career_scorer.py)
        new_score = calculate_career_score(
            metrics["skill"],
            metrics["interest"],
            metrics["goal"],
            metrics["market"],
            metrics["learning"],
            metrics["experience"]
        )

        original_score = float(career_data.get("final_score", calculate_career_score(
            float(career_data.get("SkillMatch", 0)),
            float(career_data.get("InterestMatch", 0)),
            float(career_data.get("GoalMatch", 0)),
            float(career_data.get("MarketOpportunity", 0)),
            float(career_data.get("LearningFeasibility", 0)),
            float(career_data.get("ExperienceAlignment", 0))
        )))

        # Simulate stress adjustments based on risks
        stress_deltas = [-1.0 * len(sim_data.get("RiskAgent", {}).get("risks", []))]
        stress_adjusted = calculate_stress_adjusted_score(new_score, stress_deltas)

        sim_data["CareerAgent"]["SkillMatch"] = metrics["skill"]
        sim_data["CareerAgent"]["InterestMatch"] = metrics["interest"]
        sim_data["CareerAgent"]["GoalMatch"] = metrics["goal"]
        sim_data["CareerAgent"]["MarketOpportunity"] = metrics["market"]
        sim_data["CareerAgent"]["LearningFeasibility"] = metrics["learning"]
        sim_data["CareerAgent"]["ExperienceAlignment"] = metrics["experience"]
        sim_data["CareerAgent"]["final_score"] = new_score

        return {
            "status": "SUCCESS",
            "scenario_type": scenario_type,
            "original_score": original_score,
            "new_score": new_score,
            "delta": new_score - original_score,
            "stress_adjusted_score": stress_adjusted,
            "simulated_agent_data": sim_data
        }
