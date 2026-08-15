import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AnalysisRequest, RiskAgentOutput

class RiskAgent(BaseAgent):
    agent_name = "risk_agent"
    phase = 2
    
    def get_system_prompt(self) -> str:
        return "You are the Career Risk Agent. Evaluate automation risk, market volatility, and other risks for the recommended paths."
    
    async def run(self, request: AnalysisRequest, context: dict) -> RiskAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=RiskAgentOutput)
