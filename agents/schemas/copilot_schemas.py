from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class CopilotIntent(str, Enum):
    CAREER_QUESTION = "CAREER_QUESTION"
    SKILL_QUESTION = "SKILL_QUESTION"
    LEARNING_QUESTION = "LEARNING_QUESTION"
    SIMULATION_QUESTION = "SIMULATION_QUESTION"
    PROGRESS_QUESTION = "PROGRESS_QUESTION"
    EVIDENCE_QUESTION = "EVIDENCE_QUESTION"
    GENERAL = "GENERAL"

class DataMode(str, Enum):
    LIVE = "LIVE"
    DEMO = "DEMO"
    PUBLIC_DATA = "PUBLIC_DATA"
    CURATED = "CURATED"
    MIXED = "MIXED"

class EvidenceRef(BaseModel):
    claim: str
    source: Optional[str] = None
    status: str  # VERIFIED | DATA_UNAVAILABLE | DEMO_SYNTHETIC | UNVERIFIED
    confidence: Optional[float] = None

class SuggestedAction(BaseModel):
    action: str
    description: str
    requires_confirmation: bool = True
    api_endpoint: Optional[str] = None  # Node endpoint for confirmation flow

class CopilotRequest(BaseModel):
    user_id: str
    message: str  # Sanitized by Node.js before reaching here
    intent: str  # Pre-detected by Node.js
    context: Dict[str, Any]  # Pre-fetched structured data — NOT raw DB objects
    tools_results: Dict[str, Any] = Field(default_factory=dict)  # Results from Node tool execution
    conversation_history: List[Dict[str, str]] = Field(default_factory=list)  # Last 10 turns max

class CopilotResponse(BaseModel):
    answer: str
    intent: CopilotIntent
    data_used: List[str] = Field(default_factory=list)  # Data source names referenced
    recommendations: List[str] = Field(default_factory=list)
    actions: List[SuggestedAction] = Field(default_factory=list)  # Require user confirmation
    evidence: List[EvidenceRef] = Field(default_factory=list)
    confidence: float = Field(ge=0.0, le=1.0)
    data_mode: DataMode
    limitations: List[str] = Field(default_factory=list)
    disclaimer: str = "System-generated career intelligence. Verify with qualified career advisors."
