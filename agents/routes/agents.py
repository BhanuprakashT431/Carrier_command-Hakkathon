from fastapi import APIRouter, Request, HTTPException
from schemas.agent_schemas import AnalysisRequest, AnalysisResponse
from orchestrator import Orchestrator

router = APIRouter()

@router.post("/run", response_model=AnalysisResponse)
async def run_analysis(request: AnalysisRequest, fastapi_req: Request):
    try:
        orchestrator: Orchestrator = fastapi_req.app.state.orchestrator
        response = await orchestrator.run_analysis(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{analysis_id}/status")
async def get_status(analysis_id: str):
    return {"analysis_id": analysis_id, "status": "processing"}

from schemas.agent_schemas import ResumeIntelligenceRequest, ResumeIntelligenceResponse
import json

@router.post("/resume", response_model=ResumeIntelligenceResponse)
async def analyze_resume(request: ResumeIntelligenceRequest, fastapi_req: Request):
    try:
        provider = fastapi_req.app.state.provider
        
        # System prompt indicating resume intelligence
        system_prompt = "You are a resume intelligence agent. Extract facts, infer strengths, and score the resume."
        user_content = f"User ID: {request.user_id}\nResume Text:\n{request.resume_text}"
        
        # Generate full schema for Gemini
        response_schema = ResumeIntelligenceResponse.model_json_schema()
        
        raw_response = await provider.generate(
            system_prompt=system_prompt,
            user_content=user_content,
            response_schema=response_schema
        )
        
        import re
        # Clean markdown code blocks if the model wrapped the JSON
        cleaned_response = re.sub(r'```(?:json)?\n?(.*?)\n?```', r'\1', raw_response, flags=re.DOTALL).strip()
        
        parsed_response = json.loads(cleaned_response)
        
        # Ensure it works for DemoProvider hack if needed, or just let Pydantic handle it
        return ResumeIntelligenceResponse(**parsed_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
