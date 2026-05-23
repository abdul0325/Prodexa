from pydantic import BaseModel
from typing import List, Dict, Any


# ─────────────────────────────────────
# FEATURE VECTOR
# ─────────────────────────────────────

class ProjectFeatures(BaseModel):

    totalCommits: int

    totalPRs: int

    avgImpactScore: float

    avgRiskScore: float

    avgMeaningfulness: float

    riskyCommits: int

    highImpactCommits: int

    lowValueCommits: int

    noiseRatio: float

    testingRatio: float

    backendChanges: int

    frontendChanges: int

    infraChanges: int

    securityChanges: int

    hotspotCount: int


# ─────────────────────────────────────
# REQUEST
# ─────────────────────────────────────

class PredictRequest(BaseModel):

    projectId: str

    projectName: str

    features: ProjectFeatures


# ─────────────────────────────────────
# RESPONSE
# ─────────────────────────────────────

class PredictResponse(BaseModel):

    projectId: str

    projectName: str

    projectScore: float

    deliveryRisk: str

    teamHealthStatus: str

    forecastConfidence: float

    reasons: List[str]

    signals: Dict[str, Any]

    generatedAt: str


# ─────────────────────────────────────
# TRAINING RESPONSE
# ─────────────────────────────────────

class TrainResponse(BaseModel):

    message: str

    risk_accuracy: float

    engineering_health_mae: float

    samples_trained: int

    model_version: str