import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AnalysisRequest, ProfileAgentOutput

class ProfileAgent(BaseAgent):
    agent_name = "profile_agent"
    phase = 1
    
    def get_system_prompt(self) -> str:
        return "You are the Profile Agent. Analyze the user's raw profile data and extract structured insights about their skills, experiences, and career goals."
    
    async def run(self, request: AnalysisRequest, context: dict) -> ProfileAgentOutput:
        start_time = time.time()
        user_content = json.dumps(request.profile)
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=ProfileAgentOutput)
