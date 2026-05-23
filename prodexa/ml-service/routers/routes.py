from fastapi import (
    APIRouter,
    HTTPException,
)

from datetime import datetime

from schemas.predict import (
    PredictRequest,
)

from routers.predictor import (
    predict_project,
)

from training.train import (
    train_models,
)

router = APIRouter()

# ─────────────────────────────────────
# PREDICT
# ─────────────────────────────────────


@router.post("/predict")
async def predict(
    request: PredictRequest,
):

    """
    Main engineering intelligence
    prediction endpoint.
    """

    try:

        result = predict_project(

            project_id=
                request.projectId,

            project_name=
                request.projectName,

            features=
                request.features,
        )

        return result

    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=
                (
                    f"Prediction failed: "
                    f"{str(error)}"
                ),
        )

# ─────────────────────────────────────
# TRAIN
# ─────────────────────────────────────


@router.post("/train")
async def retrain():

    """
    Retrain engineering
    intelligence models.
    """

    try:

        results = train_models()

        return {

            "message":
                (
                    "Models retrained "
                    "successfully"
                ),

            "risk_accuracy":
                round(
                    results[
                        "risk_accuracy"
                    ] * 100,
                    2,
                ),

            "engineering_health_mae":
                round(
                    results[
                        "engineering_health_mae"
                    ],
                    2,
                ),

            "samples_trained":
                results["samples"],

            "model_version":
                datetime.utcnow()
                .strftime(
                    "%Y%m%d_%H%M%S"
                ),
        }

    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=
                (
                    f"Training failed: "
                    f"{str(error)}"
                ),
        )

# ─────────────────────────────────────
# HEALTH
# ─────────────────────────────────────


@router.get("/health")
async def health_check():

    return {

        "status": "ok",

        "service":
            "Prodexa ML Service",

        "timestamp":
            datetime.utcnow()
            .isoformat(),

        "capabilities": [

            "engineering-health",

            "delivery-risk",

            "behavior-analysis",

            "risk-forecasting",

            "hotspot-analysis",
        ],
    }

# ─────────────────────────────────────
# MODEL INFO
# ─────────────────────────────────────


@router.get("/model-info")
async def model_info():

    import os

    model_dir = os.path.join(
        os.path.dirname(__file__),
        '..',
        'models',
    )

    models_exist = all([

        os.path.exists(
            os.path.join(
                model_dir,
                'engineering_health_model.pkl',
            )
        ),

        os.path.exists(
            os.path.join(
                model_dir,
                'delivery_risk_model.pkl',
            )
        ),

        os.path.exists(
            os.path.join(
                model_dir,
                'scaler.pkl',
            )
        ),
    ])

    return {

        "models_loaded":
            models_exist,

        "engineering_model":
            (
                "RandomForestRegressor"
            ),

        "risk_model":
            (
                "RandomForestClassifier"
            ),

        "features": [

            "avgImpactScore",

            "avgRiskScore",

            "noiseRatio",

            "testingRatio",

            "hotspotCount",

            "backendChanges",

            "infraChanges",
        ],

        "outputs": [

            "engineeringHealth",

            "deliveryRisk",

            "forecastConfidence",

            "explainability",
        ],
    }