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
import logging

logger = logging.getLogger(__name__)

@router.post("/resume", response_model=ResumeIntelligenceResponse)
async def analyze_resume(request: ResumeIntelligenceRequest, fastapi_req: Request):
    try:
        provider = fastapi_req.app.state.provider
        
        system_prompt = (
            "You are an expert Resume Intelligence Agent in the Career Command Center platform. "
            "Analyze the provided resume text thoroughly and extract REAL factual information from it. "
            "Never invent fake or demo data if resume content is present. "
            "Extract actual skills, education history, work experience, projects, certifications, and technologies directly mentioned in the resume. "
            "Infer strengths, potential career alignments, and potential skill gaps based on the actual resume text. "
            "Compute realistic evaluation scores between 0 and 100 for each dimension."
        )
        
        user_content = f"Resume Text to Analyze:\n{request.resume_text}"
        
        example_schema = {
            "status": "success",
            "data_mode": request.data_mode or "live",
            "extracted_facts": {
                "education": ["Degree, Major, Institution, Year"],
                "skills": ["Skill 1", "Skill 2"],
                "projects": ["Project Name - Description"],
                "experience": ["Job Title at Company (Dates) - Description"],
                "certifications": ["Certification Name"],
                "achievements": ["Achievement or Award"],
                "technologies": ["Tool / Tech 1", "Tech 2"]
            },
            "inferences": {
                "strengths": ["Strength 1 based on resume"],
                "potential_career_alignment": ["Target Role 1", "Target Role 2"],
                "potential_skill_gaps": ["Skill gap for target roles"]
            },
            "scores": {
                "technical_skills": 85,
                "projects": 80,
                "experience": 75,
                "certifications": 70,
                "achievements": 65,
                "ats_compatibility": 88,
                "career_alignment": 82,
                "overall": 80
            },
            "missing_keywords": ["Keyword 1", "Keyword 2"],
            "evidence": [{"claim": "Direct factual claim extracted from resume", "confidence": 0.95}],
            "confidence": 0.92,
            "uncertainties": [],
            "score_disclaimer": "System-generated decision-support score. Not a scientific probability assessment."
        }
        
        raw_response = await provider.generate(
            system_prompt=system_prompt,
            user_content=user_content,
            response_schema=example_schema
        )
        
        import re
        cleaned_response = re.sub(r'```(?:json)?\n?(.*?)\n?```', r'\1', raw_response, flags=re.DOTALL).strip()
        
        # Extract JSON substring if surrounded by extra text
        if '{' in cleaned_response and '}' in cleaned_response:
            start = cleaned_response.find('{')
            end = cleaned_response.rfind('}')
            cleaned_response = cleaned_response[start:end+1]
            
        parsed_response = json.loads(cleaned_response)
        
        # Ensure status and data_mode are present
        if 'status' not in parsed_response:
            parsed_response['status'] = 'success'
        if 'data_mode' not in parsed_response:
            parsed_response['data_mode'] = request.data_mode or 'live'
            
        return ResumeIntelligenceResponse(**parsed_response)
    except Exception as e:
        logger.error(f"Error in analyze_resume: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

