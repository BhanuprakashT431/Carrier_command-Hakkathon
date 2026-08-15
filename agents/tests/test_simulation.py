import pytest
from schemas.agent_schemas import AnalysisResponse, DataMode
from simulation.simulation_engine import SimulationEngine

def create_mock_analysis() -> AnalysisResponse:
    return AnalysisResponse(
        analysis_id="test_sim_1",
        status="COMPLETED",
        data_mode=DataMode.DEMO,
        message="Test message",
        agent_data={
            "CareerAgent": {
                "SkillMatch": 50.0,
                "InterestMatch": 60.0,
                "GoalMatch": 70.0,
                "MarketOpportunity": 50.0,
                "LearningFeasibility": 40.0,
                "ExperienceAlignment": 50.0,
                "final_score": 54.0
            },
            "RiskAgent": {
                "risks": []
            }
        }
    )

def test_simulation_engine_isolation():
    engine = SimulationEngine()
    base_analysis = create_mock_analysis()
    
    scenario = {
        "type": "SKILL_IMPROVEMENT",
        "changes": [{"skill": "Python", "current": 20, "new": 70}]
    }
    
    result = engine.run_simulation(base_analysis, scenario)
    
    assert result["status"] == "SUCCESS"
    # Prove isolation: base_analysis should remain immutable
    assert base_analysis.agent_data["CareerAgent"]["SkillMatch"] == 50.0
    # Simulated data should be updated
    assert result["simulated_agent_data"]["CareerAgent"]["SkillMatch"] == 55.0
    assert result["simulated_agent_data"]["CareerAgent"]["LearningFeasibility"] == 38.0

def test_scenario_handling_learning_time():
    engine = SimulationEngine()
    base_analysis = create_mock_analysis()
    
    scenario = {
        "type": "LEARNING_TIME_CHANGE",
        "changes": [{"direction": "increase", "amount": 20.0}]
    }
    
    result = engine.run_simulation(base_analysis, scenario)
    assert result["simulated_agent_data"]["CareerAgent"]["LearningFeasibility"] == 60.0

def test_scenario_location_change():
    engine = SimulationEngine()
    base_analysis = create_mock_analysis()
    
    scenario = {
        "type": "LOCATION_CHANGE",
        "changes": []
    }
    
    result = engine.run_simulation(base_analysis, scenario)
    assert result["simulated_agent_data"]["CareerAgent"]["MarketOpportunity"] == 55.0
    # Relocation risk added
    risks = result["simulated_agent_data"]["RiskAgent"]["risks"]
    assert len(risks) == 1
    assert risks[0]["type"] == "Relocation"
    
def test_scenario_salary_target_change():
    engine = SimulationEngine()
    base_analysis = create_mock_analysis()
    
    scenario = {
        "type": "SALARY_TARGET_CHANGE",
        "changes": [{"direction": "increase"}]
    }
    
    result = engine.run_simulation(base_analysis, scenario)
    assert result["simulated_agent_data"]["CareerAgent"]["GoalMatch"] == 60.0
    assert result["simulated_agent_data"]["CareerAgent"]["MarketOpportunity"] == 45.0
    # Since Goal and Market both went down, score must be lower
    assert result["delta"] < 0
