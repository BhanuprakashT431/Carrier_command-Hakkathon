import json
import time
from abc import ABC, abstractmethod
from schemas.agent_schemas import AgentOutput, AnalysisRequest
from providers.ai_provider import AIProvider

class BaseAgent(ABC):
    agent_name: str
    agent_version: str = '1.0'
    phase: int
    
    def __init__(self, provider: AIProvider):
        self.provider = provider
    
    @abstractmethod
    async def run(self, request: AnalysisRequest, context: dict) -> AgentOutput:
        """Execute the agent. context contains outputs from previous agents."""
        pass
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Return the agent's system prompt."""
        pass
    
    def get_input_summary(self, request: AnalysisRequest) -> str:
        """Return a brief non-sensitive summary of inputs for audit logging."""
        return f"Analysis {request.analysis_id}, user {request.user_id}"
    
    async def _generate_and_parse(self, request: AnalysisRequest, user_content: str, start_time: float, schema_cls=AgentOutput) -> AgentOutput:
        """Call provider, parse JSON, validate against schema."""
        from providers.demo_provider import DemoProvider
        import logging
        
        try:
            raw_json = await self.provider.generate(self.get_system_prompt(), user_content, schema_cls.model_json_schema())
            # Basic cleanup in case LLM wraps with ```json ... ```
            clean_json = raw_json.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:-3].strip()
            
            data = json.loads(clean_json)
            # Override some fields to ensure consistency
            data["agent_name"] = self.agent_name
            data["analysis_id"] = request.analysis_id
            
            latency = int((time.time() - start_time) * 1000)
            data["processing_time_ms"] = latency
            data["latencyMs"] = latency
            data["requested_provider"] = self.provider.get_name()
            data["actual_provider"] = self.provider.get_name()
            data["fallback_occurred"] = False
            data["failure_reason"] = None
            
            return schema_cls(**data)
        except Exception as e:
            logging.error(f"Provider failed: {e}. Falling back to DemoProvider.")
            try:
                demo = DemoProvider()
                raw_json = await demo.generate(self.get_system_prompt(), user_content, schema_cls.model_json_schema())
                clean_json = raw_json.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:-3].strip()
                
                data = json.loads(clean_json)
                data["agent_name"] = self.agent_name
                data["analysis_id"] = request.analysis_id
                
                latency = int((time.time() - start_time) * 1000)
                data["processing_time_ms"] = latency
                data["latencyMs"] = latency
                data["requested_provider"] = self.provider.get_name()
                data["actual_provider"] = demo.get_name()
                data["fallback_occurred"] = True
                data["failure_reason"] = str(e)
                
                return schema_cls(**data)
            except Exception as inner_e:
                latency = int((time.time() - start_time) * 1000)
                # Fallback for parsing errors
                return schema_cls(
                    agent_id="error",
                    agent_name=self.agent_name,
                    analysis_id=request.analysis_id,
                    status="failed",
                    confidence=0.0,
                    evidence_strength="none",
                    processing_time_ms=latency,
                    latencyMs=latency,
                    model_used=self.provider.get_name(),
                    requested_provider=self.provider.get_name(),
                    actual_provider="error",
                    fallback_occurred=True,
                    failure_reason=f"{str(e)} | {str(inner_e)}",
                    data_mode=request.data_mode
                )
