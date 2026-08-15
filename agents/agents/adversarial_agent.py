import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import AdversarialAgentOutput, AnalysisRequest

class AdversarialAgent(BaseAgent):
    agent_name = "adversarial_agent"
    phase = 4
    
    def get_system_prompt(self) -> str:
        return "You are the Adversarial Stress-Test Agent. Challenge the recommendations using the 10 scenarios: Market Decline, AI Automation, Skill Obsolescence, Entry-Level Competition, User Weakness, Alternative Career, Evidence Challenge, Goal Conflict, Learning Feasibility, Worst-Case Scenario."
    
    async def run(self, request: AnalysisRequest, context: dict) -> AdversarialAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=AdversarialAgentOutput)
