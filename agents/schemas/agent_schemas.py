from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DataMode(str, Enum):
    LIVE = 'live'
    DEMO = 'demo'
    PUBLIC_DATA = 'public_data'
    CURATED = 'curated'

class EvidenceStrength(str, Enum):
    STRONG = 'strong'
    MODERATE = 'moderate'
    WEAK = 'weak'
    NONE = 'none'

class AgentStatus(str, Enum):
    SUCCESS = 'success'
    PARTIAL = 'partial'
    FAILED = 'failed'

class ScenarioResult(str, Enum):
    SURVIVED = 'survived'
    PARTIAL = 'partial'
    FAILED = 'failed'

class EvidenceItem(BaseModel):
    claim: str
    source: Optional[str] = None
    source_date: Optional[str] = None
    source_type: Optional[str] = None
    confidence: Optional[float] = None
    is_supported: bool
    data_mode: DataMode

class AgentOutput(BaseModel):
    agent_id: str
    agent_name: str
    analysis_id: str
    status: AgentStatus
    confidence: float
    evidence_strength: EvidenceStrength
    findings: List[Dict[str, Any]] = Field(default_factory=list)
    recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    risks: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    uncertainties: List[str] = Field(default_factory=list)
    next_actions: List[str] = Field(default_factory=list)
    processing_time_ms: int
    model_used: str
    requested_provider: str = ""
    actual_provider: str = ""
    fallback_occurred: bool = False
    failure_reason: Optional[str] = None
    latencyMs: int = 0
    tools_used: List[str] = Field(default_factory=list)
    data_mode: DataMode
    score_disclaimer: str = 'System-generated decision-support metrics based on configured scoring formulas. Not scientific probability assessments.'

class AnalysisRequest(BaseModel):
    analysis_id: str
    user_id: str
    profile: Dict[str, Any]
    data_mode: DataMode = DataMode.DEMO

class FinalDecision(BaseModel):
    original_suitability_score: float = 0.0
    stress_adjusted_score: float = 0.0
    risk_score: float = 0.0
    stress_test_robustness: float = 0.0
    recommendation_stability: float = 0.0
    evidence_coverage: float = 0.0
    unsupported_claim_rate: float = 0.0
    overall_confidence: float = 0.0

class AnalysisResponse(BaseModel):
    analysis_id: str
    status: str
    data_mode: DataMode
    agents_completed: List[str] = Field(default_factory=list)
    overall_confidence: Optional[float] = None
    message: str
    final_decision: Optional[FinalDecision] = None
    agent_data: Dict[str, Any] = Field(default_factory=dict)

class ResumeExtractedFacts(BaseModel):
    education: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)

class ResumeInferences(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    potential_career_alignment: List[str] = Field(default_factory=list)
    potential_skill_gaps: List[str] = Field(default_factory=list)

class ResumeScores(BaseModel):
    technical_skills: int = 0
    projects: int = 0
    experience: int = 0
    certifications: int = 0
    achievements: int = 0
    ats_compatibility: int = 0
    career_alignment: int = 0
    overall: int = 0

class ResumeIntelligenceResponse(BaseModel):
    status: str
    data_mode: str
    extracted_facts: ResumeExtractedFacts
    inferences: ResumeInferences
    scores: ResumeScores
    missing_keywords: List[str] = Field(default_factory=list)
    evidence: List[dict] = Field(default_factory=list)
    confidence: float
    uncertainties: List[str] = Field(default_factory=list)
    score_disclaimer: str = "System-generated decision-support score. Not a scientific probability assessment."

class ResumeIntelligenceRequest(BaseModel):
    user_id: str
    resume_text: str
    data_mode: str = "demo"

class ProfileAgentOutput(AgentOutput):
    pass

class CareerAgentOutput(AgentOutput):
    career: str = "Unknown"
    SkillMatch: float = 0.0
    InterestMatch: float = 0.0
    GoalMatch: float = 0.0
    MarketOpportunity: float = 0.0
    LearningFeasibility: float = 0.0
    ExperienceAlignment: float = 0.0
    final_score: float = 0.0
    alternatives: List[Dict[str, Any]] = Field(default_factory=list)

class SkillGapAgentOutput(AgentOutput):
    gaps: List[Dict[str, Any]] = Field(default_factory=list)

class MarketAgentOutput(AgentOutput):
    pass

class RiskAgentOutput(AgentOutput):
    pass

class RoadmapStep(BaseModel):
    timeframe: str
    focus: str
    milestones: List[str] = Field(default_factory=list)

class LearningAgentOutput(AgentOutput):
    career: str = "Unknown"
    day30_plan: Dict[str, Any] = Field(default_factory=dict)
    day60_plan: Dict[str, Any] = Field(default_factory=dict)
    day90_plan: Dict[str, Any] = Field(default_factory=dict)
    month6_plan: Dict[str, Any] = Field(default_factory=dict)
    resources: List[Dict[str, Any]] = Field(default_factory=list)
    total_duration: str = ""
    roadmap: List[RoadmapStep] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)

class ScenarioEvaluation(BaseModel):
    scenario_name: str
    vulnerability_identified: str
    impact_severity: str
    mitigation_strategy: str
    scenario_survived: ScenarioResult
    delta_score: float = 0.0

class AdversarialAgentOutput(AgentOutput):
    scenarios: List[ScenarioEvaluation] = Field(default_factory=list)

class EvidenceStatus(str, Enum):
    VERIFIED = 'VERIFIED'
    UNVERIFIED = 'UNVERIFIED'
    CONTRADICTED = 'CONTRADICTED'
    DATA_UNAVAILABLE = 'DATA_UNAVAILABLE'
    DEMO_SYNTHETIC = 'DEMO_SYNTHETIC'

class EvidenceVerification(BaseModel):
    claim: str
    status: EvidenceStatus
    explanation: str

class EvidenceAgentOutput(AgentOutput):
    verifications: List[EvidenceVerification] = Field(default_factory=list)
