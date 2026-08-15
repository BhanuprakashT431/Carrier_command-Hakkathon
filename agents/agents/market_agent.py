import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AnalysisRequest, MarketAgentOutput

class MarketAgent(BaseAgent):
    agent_name = "market_agent"
    phase = 2
    
    def get_system_prompt(self) -> str:
        return "You are the Market Intelligence Agent. Analyze current job market trends, demand, and salary expectations for the target careers."
    
    async def run(self, request: AnalysisRequest, context: dict) -> MarketAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=MarketAgentOutput)
