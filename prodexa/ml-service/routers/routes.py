from fastapi import APIRouter, HTTPException
from schemas.predict import PredictRequest, PredictResponse, TrainResponse
from routers.predictor import predict_project
from training.train import train_models
from datetime import datetime

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """
    Main prediction endpoint.
    Called by NestJS after project analysis completes.
    Receives developer activity data and returns ML predictions.
    """
    try:
        result = predict_project(
            project_id=request.projectId,
            project_name=request.projectName,
            developers=request.developers,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/train", response_model=TrainResponse)
async def retrain():
    """
    Retrain the Random Forest models with fresh synthetic data.
    Call this endpoint to refresh model weights.
    """
    try:
        results = train_models()
        return TrainResponse(
            message="Models retrained successfully",
            accuracy=round(results["risk_accuracy"] * 100, 2),
            samples_trained=results["samples"],
            model_version=datetime.utcnow().strftime("%Y%m%d_%H%M%S"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint — used by NestJS to verify ML service is up."""
    return {
        "status": "ok",
        "service": "Prodexa ML Service",
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/model-info")
async def model_info():
    """Returns info about the currently loaded models."""
    import os
    model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    models_exist = all([
        os.path.exists(os.path.join(model_dir, 'productivity_model.pkl')),
        os.path.exists(os.path.join(model_dir, 'risk_model.pkl')),
        os.path.exists(os.path.join(model_dir, 'scaler.pkl')),
    ])
    return {
        "models_loaded": models_exist,
        "score_model": "RandomForestRegressor (n_estimators=100)",
        "risk_model": "RandomForestClassifier (n_estimators=100)",
        "features": ["commits", "pullRequestCount", "issueCount", "commit_pr_ratio", "activity_density", "collaboration_score"],
        "outputs": ["predictedScore (0-100)", "deliveryRisk (Low/Medium/High)", "trend (improving/stable/declining)"],
    }
