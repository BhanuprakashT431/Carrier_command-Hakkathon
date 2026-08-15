import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import LearningAgentOutput, AnalysisRequest

class LearningAgent(BaseAgent):
    agent_name = "learning_agent"
    phase = 3
    
    def get_system_prompt(self) -> str:
        return "You are the Learning Roadmap Agent. Create a structured 30/60/90/180 day learning plan to bridge the identified skill gaps, along with recommended projects."
    
    async def run(self, request: AnalysisRequest, context: dict) -> LearningAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=LearningAgentOutput)
