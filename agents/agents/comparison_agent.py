import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AgentOutput, AnalysisRequest

class ComparisonAgent(BaseAgent):
    agent_name = "comparison_agent"
    phase = 6
    
    def get_system_prompt(self) -> str:
        return "You are the Career Comparison Agent (Orchestrator Assistant). Synthesize all agent outputs, weigh the adversarial challenges, and finalize the career decisions."
    
    async def run(self, request: AnalysisRequest, context: dict) -> AgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time)
