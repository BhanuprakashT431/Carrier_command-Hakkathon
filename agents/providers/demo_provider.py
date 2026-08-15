import json
import uuid
from typing import Optional, Dict, Any
from providers.ai_provider import AIProvider

class DemoProvider(AIProvider):
    provider_name = 'demo'

    async def generate(self, system_prompt: str, user_content: str, response_schema: Optional[Dict[str, Any]] = None) -> str:
        agent_type = "profile_agent"
        if "adversarial" in system_prompt.lower() or "stress" in system_prompt.lower(): agent_type = "adversarial_agent"
        elif "career" in system_prompt.lower(): agent_type = "career_agent"
        elif "skill" in system_prompt.lower(): agent_type = "skill_gap_agent"
        elif "market" in system_prompt.lower(): agent_type = "market_agent"
        elif "risk" in system_prompt.lower(): agent_type = "risk_agent"
        elif "learning" in system_prompt.lower(): agent_type = "learning_agent"
        elif "evidence" in system_prompt.lower(): agent_type = "evidence_agent"
        elif "comparison" in system_prompt.lower() or "orchestrator" in system_prompt.lower(): agent_type = "comparison_agent"

        if "resume" in system_prompt.lower() or "resume" in str(response_schema).lower():
            resume_response = {
                "status": "success",
                "data_mode": "demo",
                "extracted_facts": {
                    "education": ["B.Sc Computer Science, Demo University, 2020"],
                    "skills": ["Python", "FastAPI", "React", "Docker"],
                    "projects": ["Demo E-Commerce Platform", "AI Chatbot"],
                    "experience": ["Software Engineer at TechCorp (2020-2023)"],
                    "certifications": ["AWS Certified Developer"],
                    "achievements": ["Employee of the month, Jan 2022"],
                    "technologies": ["Git", "Linux", "Kubernetes"]
                },
                "inferences": {
                    "strengths": ["Strong programming foundation", "Cloud-native architecture knowledge"],
                    "potential_career_alignment": ["Backend Developer", "Full Stack Engineer"],
                    "potential_skill_gaps": ["CI/CD pipelines", "Advanced System Design"]
                },
                "scores": {
                    "technical_skills": 85,
                    "projects": 75,
                    "experience": 70,
                    "certifications": 60,
                    "achievements": 50,
                    "ats_compatibility": 90,
                    "career_alignment": 80,
                    "overall": 77
                },
                "missing_keywords": ["CI/CD", "System Design"],
                "evidence": [{"claim": "Has 3 years experience based on TechCorp timeline.", "confidence": 0.9}],
                "confidence": 0.88,
                "uncertainties": ["Exact role responsibilities at TechCorp unclear"],
                "score_disclaimer": "System-generated decision-support score. Not a scientific probability assessment."
            }
            return json.dumps(resume_response)

        # Mock structured response
        response = {
            "agent_id": str(uuid.uuid4()),
            "agent_name": agent_type,
            "analysis_id": "demo-analysis-123",
            "status": "success",
            "confidence": 0.85,
            "evidence_strength": "moderate",
            "findings": [{"title": "Demo Finding", "description": "This is a synthetic finding."}],
            "recommendations": [{"action": "Demo Action", "details": "Synthetic recommendation."}],
            "risks": [{"risk": "Demo Risk", "severity": "medium"}],
            "evidence": [{
                "claim": "Synthetic data used.",
                "source": "DemoProvider",
                "source_date": "2024-01-01",
                "source_type": "SYNTHETIC",
                "confidence": 1.0,
                "is_supported": True,
                "data_mode": "demo"
            }],
            "assumptions": ["Assuming demo context"],
            "uncertainties": ["High uncertainty due to demo mode"],
            "next_actions": ["Provide real data"],
            "processing_time_ms": 150,
            "model_used": "demo",
            "tools_used": [],
            "data_mode": "demo",
            "score_disclaimer": "System-generated decision-support metrics based on configured scoring formulas. Not scientific probability assessments."
        }

        if agent_type == "career_agent":
            response.update({
                "career": "Machine Learning Engineer",
                "SkillMatch": 80.0,
                "InterestMatch": 75.0,
                "GoalMatch": 90.0,
                "MarketOpportunity": 70.0,
                "LearningFeasibility": 65.0,
                "ExperienceAlignment": 85.0,
                "final_score": 77.0,
                "alternatives": [
                    {
                        "career": "Machine Learning Engineer",
                        "score": 77.0,
                        "stress_adjusted_score": 75.0,
                        "risk_score": 25.0
                    },
                    {
                        "career": "Data Scientist",
                        "score": 72.0,
                        "stress_adjusted_score": 68.0,
                        "risk_score": 32.0
                    },
                    {
                        "career": "Backend Developer",
                        "score": 65.0,
                        "stress_adjusted_score": 60.0,
                        "risk_score": 40.0
                    }
                ]
            })
        elif agent_type == "skill_gap_agent":
            response["gaps"] = [
                {
                    "career": "Machine Learning Engineer",
                    "skill_name": "Kubernetes",
                    "current_level": 20,
                    "required_level": 80,
                    "gap_size": 60,
                    "priority": "HIGH",
                    "data_mode": "demo"
                },
                {
                    "career": "Machine Learning Engineer",
                    "skill_name": "System Design",
                    "current_level": 40,
                    "required_level": 85,
                    "gap_size": 45,
                    "priority": "MEDIUM",
                    "data_mode": "demo"
                }
            ]

        elif agent_type == "market_agent":
            response["findings"] = [{"title": "Demo Data — Synthetic", "description": "This is a synthetic market finding. No real statistics are presented."}]
            response["evidence"] = [{
                "claim": "Synthetic market data used.",
                "source": "DemoProvider",
                "source_date": "2024-01-01",
                "source_type": "SYNTHETIC",
                "confidence": 1.0,
                "is_supported": True,
                "data_mode": "demo"
            }]
        elif agent_type == "learning_agent":
            response.update({
                "career": "Machine Learning Engineer",
                "day30_plan": {"skills": ["Python"], "milestones": ["M1", "M2"]},
                "day60_plan": {"skills": ["Docker"], "milestones": ["M3", "M4"]},
                "day90_plan": {"skills": ["Kubernetes"], "milestones": ["M5", "M6"]},
                "month6_plan": {"skills": ["System Design"], "milestones": ["M7", "M8"]},
                "resources": [{"title": "ML Course", "url": "http://demo", "type": "course"}],
                "total_duration": "6 months",
                "roadmap": [
                    {"timeframe": "30 days", "focus": "Foundational", "milestones": ["M1"]},
                    {"timeframe": "60 days", "focus": "Intermediate", "milestones": ["M2"]},
                    {"timeframe": "90 days", "focus": "Advanced", "milestones": ["M3"]},
                    {"timeframe": "180 days", "focus": "Expert", "milestones": ["M4"]}
                ],
                "projects": ["Demo Project 1", "Demo Project 2"]
            })
        elif agent_type == "adversarial_agent":
            scenarios = [
                "Market Decline", "AI Automation", "Skill Obsolescence", 
                "Entry-Level Competition", "User Weakness", "Alternative Career", 
                "Evidence Challenge", "Goal Conflict", "Learning Feasibility", "Worst-Case Scenario"
            ]
            response["scenarios"] = [
                {
                    "scenario_name": name,
                    "vulnerability_identified": "Demo vulnerability",
                    "impact_severity": "medium",
                    "mitigation_strategy": "Demo mitigation",
                    "scenario_survived": "survived",
                    "delta_score": -2.0
                } for name in scenarios
            ]
        elif agent_type == "evidence_agent":
            response["verifications"] = [
                {
                    "claim": "Market demand is high",
                    "status": "DATA_UNAVAILABLE",
                    "explanation": "Demo mode active."
                },
                {
                    "claim": "Has 3 years experience",
                    "status": "DEMO_SYNTHETIC",
                    "explanation": "Synthetic data."
                }
            ]

        return json.dumps(response)

    async def health_check(self) -> bool:
        return True
