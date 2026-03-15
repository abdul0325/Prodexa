from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ─────────────────────────────────────────────
# REQUEST SCHEMAS (what NestJS sends to us)
# ─────────────────────────────────────────────

class DeveloperInput(BaseModel):
    developerLogin: str
    commits: int
    pullRequestCount: int
    issueCount: int
    productivityScore: int
    activityTimestamp: Optional[str] = None


class PredictRequest(BaseModel):
    projectId: str
    projectName: str
    developers: List[DeveloperInput]


# ─────────────────────────────────────────────
# RESPONSE SCHEMAS (what we send back to NestJS)
# ─────────────────────────────────────────────

class DeveloperPrediction(BaseModel):
    developerLogin: str
    commits: int
    pullRequestCount: int
    issueCount: int
    currentScore: int
    predictedScore: float
    trend: str          # "improving", "declining", "stable"
    riskLevel: str      # "Low", "Medium", "High"


class PredictResponse(BaseModel):
    projectId: str
    projectScore: float
    deliveryRisk: str       # "Low", "Medium", "High"
    workloadForecast: float
    teamHealthStatus: str   # "Excellent", "Good", "Moderate", "Risky"
    developers: List[DeveloperPrediction]
    generatedAt: str


# ─────────────────────────────────────────────
# TRAINING SCHEMAS
# ─────────────────────────────────────────────

class TrainResponse(BaseModel):
    message: str
    accuracy: float
    samples_trained: int
    model_version: str
