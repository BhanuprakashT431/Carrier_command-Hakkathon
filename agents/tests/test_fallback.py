import pytest
from unittest.mock import AsyncMock, patch
from schemas.agent_schemas import AnalysisRequest, DataMode
from agents.profile_agent import ProfileAgent
from providers.ai_provider import AIProvider
from typing import Optional, Dict, Any

class MockFailingProvider(AIProvider):
    provider_name = "failing_provider"
    
    async def generate(self, system_prompt: str, user_content: str, response_schema: Optional[Dict[str, Any]] = None) -> str:
        raise ValueError("Prompt injection detected")
        
    async def health_check(self) -> bool:
        return False
        
    def get_name(self) -> str:
        return self.provider_name

@pytest.mark.asyncio
async def test_provider_fallback_on_error():
    provider = MockFailingProvider()
    agent = ProfileAgent(provider)
    
    request = AnalysisRequest(
        analysis_id="test_analysis_1",
        user_id="user_1",
        profile={"name": "Test User", "skills": ["Python"]},
        data_mode=DataMode.DEMO
    )
    
    context = {}
    
    result = await agent.run(request, context)
    
    assert result.status != "failed" # Should recover via fallback
    assert result.fallback_occurred is True
    assert result.requested_provider == "failing_provider"
    assert result.actual_provider == "demo"
    assert result.failure_reason == "Prompt injection detected"
    assert result.latencyMs >= 0

@pytest.mark.asyncio
async def test_provider_success_metrics():
    class MockSuccessProvider(AIProvider):
        provider_name = "success_provider"
        async def generate(self, system_prompt: str, user_content: str, response_schema: Optional[Dict[str, Any]] = None) -> str:
            return """
            {
                "agent_id": "profile_1",
                "status": "success",
                "confidence": 0.9,
                "evidence_strength": "strong",
                "processing_time_ms": 100,
                "model_used": "success_provider",
                "data_mode": "demo"
            }
            """
        async def health_check(self) -> bool:
            return True
    
    provider = MockSuccessProvider()
    agent = ProfileAgent(provider)
    
    request = AnalysisRequest(
        analysis_id="test_analysis_1",
        user_id="user_1",
        profile={},
        data_mode=DataMode.DEMO
    )
    
    result = await agent.run(request, {})
    
    assert result.status == "success"
    assert result.fallback_occurred is False
    assert result.requested_provider == "success_provider"
    assert result.actual_provider == "success_provider"
    assert result.failure_reason is None
    assert result.latencyMs >= 0
