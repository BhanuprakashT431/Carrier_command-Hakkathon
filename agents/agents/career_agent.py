import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AnalysisRequest, CareerAgentOutput

class CareerAgent(BaseAgent):
    agent_name = "career_agent"
    phase = 2
    
    def get_system_prompt(self) -> str:
        return "You are the Career Intelligence Agent. Based on the user's extracted profile, recommend highly suitable career paths. Output SkillMatch, InterestMatch, GoalMatch, MarketOpportunity, LearningFeasibility, ExperienceAlignment."
    
    async def run(self, request: AnalysisRequest, context: dict) -> CareerAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=CareerAgentOutput)
