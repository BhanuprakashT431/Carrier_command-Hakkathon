import json
import time
from agents.base_agent import BaseAgent
from schemas.agent_schemas import EvidenceAgentOutput, AnalysisRequest

class EvidenceAgent(BaseAgent):
    agent_name = "evidence_agent"
    phase = 5
    
    def get_system_prompt(self) -> str:
        return "You are the Evidence Verification Agent. Verify claims, distinguishing between VERIFIED, UNVERIFIED, CONTRADICTED, DATA_UNAVAILABLE, and DEMO_SYNTHETIC."
    
    async def run(self, request: AnalysisRequest, context: dict) -> EvidenceAgentOutput:
        start_time = time.time()
        user_content = json.dumps({"profile": request.profile, "context": context})
        return await self._generate_and_parse(request, user_content, start_time, schema_cls=EvidenceAgentOutput)
