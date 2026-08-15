import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from providers.demo_provider import DemoProvider
from providers.gemini_provider import GeminiProvider
from providers.openai_provider import OpenAIProvider
from orchestrator import Orchestrator
from routes.health import router as health_router
from routes.agents import router as agents_router
from schemas.agent_schemas import AnalysisResponse
from simulation.simulation_engine import SimulationEngine
from pydantic import BaseModel
from typing import Dict, Any
from agents.copilot_agent import CopilotAgent
from schemas.copilot_schemas import CopilotRequest, CopilotResponse


class SimulationRequest(BaseModel):
    base_analysis: AnalysisResponse
    scenario: Dict[str, Any]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize provider
    if settings.demo_mode:
        provider = DemoProvider()
    elif settings.gemini_api_key:
        provider = GeminiProvider(settings.gemini_api_key)
    elif settings.openai_api_key:
        provider = OpenAIProvider(settings.openai_api_key)
    else:
        provider = DemoProvider()
    
    app.state.provider = provider
    app.state.orchestrator = Orchestrator(provider)
    
    logger.info(f"Starting Agent Service. Active provider: {provider.get_name()}, Demo Mode: {settings.demo_mode}")
    yield
    # Cleanup if needed

app = FastAPI(title="Career Command Center — Agent Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(agents_router, prefix="/analysis", tags=["analysis"])

@app.post("/api/simulations", tags=["simulations"])
async def run_simulation_endpoint(request: SimulationRequest):
    engine = SimulationEngine()
    return engine.run_simulation(request.base_analysis, request.scenario)

@app.post("/api/copilot/message", response_model=CopilotResponse, tags=["copilot"])
async def copilot_message(request: CopilotRequest):
    agent = CopilotAgent(app.state.provider)
    return agent.run(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)
