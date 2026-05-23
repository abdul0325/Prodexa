"""
Prodexa Engineering Intelligence
Predictor
"""

import numpy as np
import pandas as pd

from datetime import datetime

from training.train import (
    load_models,
    engineer_features,
)

# ─────────────────────────────────────
# LOAD MODELS
# ─────────────────────────────────────

health_model, risk_model, scaler = (
    load_models()
)

# ─────────────────────────────────────
# RISK LABELS
# ─────────────────────────────────────

RISK_LABELS = {

    0: "LOW",

    1: "MEDIUM",

    2: "HIGH",
}

# ─────────────────────────────────────
# PREDICT PROJECT
# ─────────────────────────────────────

def predict_project(
    project_id: str,
    project_name: str,
    features,
):

    # BUILD DATAFRAME

    df = pd.DataFrame([{

        'totalCommits':
            features.totalCommits,

        'totalPRs':
            features.totalPRs,

        'avgImpactScore':
            features.avgImpactScore,

        'avgRiskScore':
            features.avgRiskScore,

        'avgMeaningfulness':
            features.avgMeaningfulness,

        'riskyCommits':
            features.riskyCommits,

        'highImpactCommits':
            features.highImpactCommits,

        'lowValueCommits':
            features.lowValueCommits,

        'noiseRatio':
            features.noiseRatio,

        'testingRatio':
            features.testingRatio,

        'backendChanges':
            features.backendChanges,

        'frontendChanges':
            features.frontendChanges,

        'infraChanges':
            features.infraChanges,

        'securityChanges':
            features.securityChanges,

        'hotspotCount':
            features.hotspotCount,
    }])

    # FEATURE ENGINEERING

    df = engineer_features(df)

    feature_cols = [

        'totalCommits',

        'totalPRs',

        'avgImpactScore',

        'avgRiskScore',

        'avgMeaningfulness',

        'riskyCommits',

        'highImpactCommits',

        'lowValueCommits',

        'noiseRatio',

        'testingRatio',

        'backendChanges',

        'frontendChanges',

        'infraChanges',

        'securityChanges',

        'hotspotCount',

        'stability_score',

        'engineering_discipline',

        'risk_pressure',

        'backend_volatility',

        'infra_pressure',
    ]

    # SCALE

    X = scaler.transform(
        df[feature_cols]
    )

    # PREDICT

    predicted_health = float(

        np.clip(

            health_model.predict(X)[0],

            0,

            100,
        )
    )

    predicted_risk = int(
        risk_model.predict(X)[0]
    )

    # EXPLAINABILITY

    reasons = []

    if features.noiseRatio >= 0.4:

        reasons.append(
            (
                "High low-value "
                "engineering activity detected"
            )
        )

    if features.hotspotCount >= 5:

        reasons.append(
            (
                "Subsystem instability "
                "is increasing"
            )
        )

    if features.testingRatio <= 0.1:

        reasons.append(
            (
                "Testing activity remains low"
            )
        )

    if features.avgRiskScore >= 70:

        reasons.append(
            (
                "High engineering "
                "risk pressure detected"
            )
        )

    if features.backendChanges >= 20:

        reasons.append(
            (
                "Heavy backend "
                "modification activity"
            )
        )

    # HEALTH STATUS

    if predicted_health >= 80:

        health_status = "EXCELLENT"

    elif predicted_health >= 60:

        health_status = "GOOD"

    elif predicted_health >= 40:

        health_status = "MODERATE"

    else:

        health_status = "RISKY"

    # CONFIDENCE

    confidence = float(

        min(

            0.95,

            max(
                0.55,

                1 -
                (
                    features.noiseRatio
                    * 0.5
                ),
            ),
        )
    )

    # RESPONSE

    return {

        "projectId":
            project_id,

        "projectName":
            project_name,

        "projectScore":
            round(
                predicted_health,
                2,
            ),

        "deliveryRisk":
            RISK_LABELS[
                predicted_risk
            ],

        "teamHealthStatus":
            health_status,

        "forecastConfidence":
            round(
                confidence,
                2,
            ),

        "reasons":
            reasons,

        "signals": {

            "avgImpactScore":
                features.avgImpactScore,

            "avgRiskScore":
                features.avgRiskScore,

            "noiseRatio":
                features.noiseRatio,

            "testingRatio":
                features.testingRatio,

            "hotspotCount":
                features.hotspotCount,
        },

        "generatedAt":
            datetime.utcnow()
            .isoformat(),
    }