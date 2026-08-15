import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AnalysisRequest, SkillGapAgentOutput

class SkillGapAgent(BaseAgent):
    agent_name = "skill_gap_agent"
    phase = 2
    
    def get_system_prompt(self) -> str:
        return "You are the Skill Gap Agent. Identify gaps between the user's current skills and their target career requirements."
    
    async def run(self, request: AnalysisRequest, context: dict) -> SkillGapAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=SkillGapAgentOutput)
