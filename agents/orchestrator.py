import asyncio
from typing import Dict, Any
from schemas.agent_schemas import AnalysisRequest, AnalysisResponse, DataMode, FinalDecision
from agents.profile_agent import ProfileAgent
from agents.career_agent import CareerAgent
from agents.skill_gap_agent import SkillGapAgent
from agents.market_agent import MarketAgent
from agents.risk_agent import RiskAgent
from agents.learning_agent import LearningAgent
from agents.adversarial_agent import AdversarialAgent
from agents.evidence_agent import EvidenceAgent
from agents.comparison_agent import ComparisonAgent
from scoring.career_scorer import (
    calculate_career_score,
    calculate_stress_adjusted_score,
    calculate_robustness_score,
    calculate_stability_score,
    calculate_evidence_metrics
)

class Orchestrator:
    def __init__(self, provider):
        self.provider = provider
        self.profile_agent = ProfileAgent(provider)
        self.career_agent = CareerAgent(provider)
        self.skill_gap_agent = SkillGapAgent(provider)
        self.market_agent = MarketAgent(provider)
        self.risk_agent = RiskAgent(provider)
        self.learning_agent = LearningAgent(provider)
        self.adversarial_agent = AdversarialAgent(provider)
        self.evidence_agent = EvidenceAgent(provider)
        self.comparison_agent = ComparisonAgent(provider)

    async def run_analysis(self, request: AnalysisRequest) -> AnalysisResponse:
        context: Dict[str, Any] = {}
        agents_completed = []

        # Phase 1
        profile_out = await self.profile_agent.run(request, context)
        context["profile_agent"] = profile_out.model_dump()
        agents_completed.append(self.profile_agent.agent_name)

        # Phase 2 (Parallel)
        tasks = [
            self.career_agent.run(request, context),
            self.skill_gap_agent.run(request, context),
            self.market_agent.run(request, context),
            self.risk_agent.run(request, context)
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        career_out = results[0] if not isinstance(results[0], Exception) else None
        skill_gap_out = results[1] if not isinstance(results[1], Exception) else None
        market_out = results[2] if not isinstance(results[2], Exception) else None
        risk_out = results[3] if not isinstance(results[3], Exception) else None

        if career_out:
            career_out.final_score = calculate_career_score(
                career_out.SkillMatch,
                career_out.InterestMatch,
                career_out.GoalMatch,
                career_out.MarketOpportunity,
                career_out.LearningFeasibility,
                career_out.ExperienceAlignment
            )
            context["career_agent"] = career_out.model_dump()
            agents_completed.append(self.career_agent.agent_name)
        
        if skill_gap_out:
            context["skill_gap_agent"] = skill_gap_out.model_dump()
            agents_completed.append(self.skill_gap_agent.agent_name)
            
        if market_out:
            context["market_agent"] = market_out.model_dump()
            agents_completed.append(self.market_agent.agent_name)
            
        if risk_out:
            context["risk_agent"] = risk_out.model_dump()
            agents_completed.append(self.risk_agent.agent_name)

        # Phase 3
        learning_out = await self.learning_agent.run(request, context)
        context["learning_agent"] = learning_out.model_dump()
        agents_completed.append(self.learning_agent.agent_name)

        # Phase 4
        adv_out = await self.adversarial_agent.run(request, context)
        context["adversarial_agent"] = adv_out.model_dump()
        agents_completed.append(self.adversarial_agent.agent_name)

        # Phase 5
        evidence_out = await self.evidence_agent.run(request, context)
        context["evidence_agent"] = evidence_out.model_dump()
        agents_completed.append(self.evidence_agent.agent_name)

        # Phase 6 & 7 (Comparison & final decision)
        comp_out = await self.comparison_agent.run(request, context)
        context["comparison_agent"] = comp_out.model_dump()
        agents_completed.append(self.comparison_agent.agent_name)

        original_score = career_out.final_score if career_out else 0.0
        
        deltas = [sc.delta_score for sc in adv_out.scenarios] if adv_out and adv_out.scenarios else []
        stress_adjusted = calculate_stress_adjusted_score(original_score, deltas)
        
        passed_scenarios = sum(1 for sc in adv_out.scenarios if sc.scenario_survived.value == 'survived') if adv_out and adv_out.scenarios else 0
        failed_scenarios = sum(1 for sc in adv_out.scenarios if sc.scenario_survived.value == 'failed') if adv_out and adv_out.scenarios else 0
        uncertain_scenarios = sum(1 for sc in adv_out.scenarios if sc.scenario_survived.value == 'partial') if adv_out and adv_out.scenarios else 0
        robustness = calculate_robustness_score(passed_scenarios, failed_scenarios, uncertain_scenarios)
        
        stability = calculate_stability_score(
            career_out.SkillMatch if career_out else 0,
            career_out.InterestMatch if career_out else 0,
            career_out.GoalMatch if career_out else 0,
            career_out.MarketOpportunity if career_out else 0,
            career_out.LearningFeasibility if career_out else 0,
            career_out.ExperienceAlignment if career_out else 0
        )
        
        verified = sum(1 for v in evidence_out.verifications if v.status == 'VERIFIED') if evidence_out and evidence_out.verifications else 0
        contradicted = sum(1 for v in evidence_out.verifications if v.status == 'CONTRADICTED') if evidence_out and evidence_out.verifications else 0
        unverified = sum(1 for v in evidence_out.verifications if v.status in ['UNVERIFIED', 'DATA_UNAVAILABLE']) if evidence_out and evidence_out.verifications else 0
        total_claims = len(evidence_out.verifications) if evidence_out and evidence_out.verifications else 0
        coverage, unsupported_rate = calculate_evidence_metrics(verified, contradicted, unverified, total_claims)
        
        final_decision = FinalDecision(
            original_suitability_score=original_score,
            stress_adjusted_score=stress_adjusted,
            risk_score=100.0 - stress_adjusted,
            stress_test_robustness=robustness,
            recommendation_stability=stability,
            evidence_coverage=coverage,
            unsupported_claim_rate=unsupported_rate,
            overall_confidence=comp_out.confidence if comp_out else 0.0
        )

        return AnalysisResponse(
            analysis_id=request.analysis_id,
            status="completed",
            data_mode=request.data_mode,
            agents_completed=agents_completed,
            overall_confidence=final_decision.overall_confidence,
            message="Analysis completed successfully.",
            final_decision=final_decision,
            agent_data=context
        )
