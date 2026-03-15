"""
Prodexa ML Predictor
Uses trained Random Forest models to predict:
- Developer productivity scores
- Project delivery risk
- Workload forecast
"""

import numpy as np
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from training.train import load_models, engineer_features
from schemas.predict import DeveloperInput, DeveloperPrediction, PredictResponse


# Load models once at startup
score_model, risk_model, scaler = load_models()


def predict_developer(dev: DeveloperInput) -> DeveloperPrediction:
    """Predict productivity score and risk for a single developer."""

    # Build feature dataframe
    df = pd.DataFrame([{
        'commits': dev.commits,
        'pullRequestCount': dev.pullRequestCount,
        'issueCount': dev.issueCount,
    }])

    # Engineer features
    df = engineer_features(df)

    feature_cols = [
        'commits', 'pullRequestCount', 'issueCount',
        'commit_pr_ratio', 'activity_density', 'collaboration_score'
    ]

    X = scaler.transform(df[feature_cols])

    # Predict score
    predicted_score = float(np.clip(score_model.predict(X)[0], 0, 100))

    # Predict risk
    predicted_risk = risk_model.predict(X)[0]  # "Low", "Medium", "High"

    # Calculate trend by comparing predicted vs current
    diff = predicted_score - dev.productivityScore
    if diff > 5:
        trend = "improving"
    elif diff < -5:
        trend = "declining"
    else:
        trend = "stable"

    return DeveloperPrediction(
        developerLogin=dev.developerLogin,
        commits=dev.commits,
        pullRequestCount=dev.pullRequestCount,
        issueCount=dev.issueCount,
        currentScore=dev.productivityScore,
        predictedScore=round(predicted_score, 2),
        trend=trend,
        riskLevel=predicted_risk,
    )


def predict_project(project_id: str, project_name: str, developers: List[DeveloperInput]) -> PredictResponse:
    """Predict overall project health from all developer activities."""

    if not developers:
        return PredictResponse(
            projectId=project_id,
            projectScore=0.0,
            deliveryRisk="High",
            workloadForecast=0.0,
            teamHealthStatus="Risky",
            developers=[],
            generatedAt=datetime.utcnow().isoformat(),
        )

    # Predict per developer
    dev_predictions = [predict_developer(dev) for dev in developers]

    # Aggregate project-level metrics
    total_commits = sum(d.commits for d in developers)
    total_prs = sum(d.pullRequestCount for d in developers)
    total_issues = sum(d.issueCount for d in developers)
    avg_predicted_score = np.mean([d.predictedScore for d in dev_predictions])

    # Project-level feature vector (team aggregates)
    project_df = pd.DataFrame([{
        'commits': total_commits,
        'pullRequestCount': total_prs,
        'issueCount': total_issues,
    }])
    project_df = engineer_features(project_df)

    feature_cols = [
        'commits', 'pullRequestCount', 'issueCount',
        'commit_pr_ratio', 'activity_density', 'collaboration_score'
    ]

    X_project = scaler.transform(project_df[feature_cols])
    project_score = float(np.clip(score_model.predict(X_project)[0], 0, 100))
    project_risk = risk_model.predict(X_project)[0]

    # Workload forecast = weighted average of predicted scores
    workload_forecast = float(
        total_commits * 0.4 + total_prs * 0.4 + len(developers) * 0.2
    )

    # Team health status
    if project_score >= 75:
        health_status = "Excellent"
    elif project_score >= 50:
        health_status = "Good"
    elif project_score >= 25:
        health_status = "Moderate"
    else:
        health_status = "Risky"

    return PredictResponse(
        projectId=project_id,
        projectScore=round(project_score, 2),
        deliveryRisk=project_risk,
        workloadForecast=round(workload_forecast, 2),
        teamHealthStatus=health_status,
        developers=dev_predictions,
        generatedAt=datetime.utcnow().isoformat(),
    )
