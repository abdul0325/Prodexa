"""
Prodexa ML Service
FastAPI microservice for AI-powered project productivity analysis.
Called by NestJS backend after GitHub data collection.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.routes import router
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Prodexa ML Service",
    description="Random Forest-based productivity prediction for GitHub projects",
    version="1.0.0",
)

# CORS — allow NestJS backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("BACKEND_URL", "http://localhost:3001"),
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router, prefix="")


@app.on_event("startup")
async def startup_event():
    """Auto-train models on startup if they don't exist."""
    from training.train import load_models
    print("🚀 Prodexa ML Service starting...")
    load_models()  # trains if models don't exist
    print("✅ Models ready")
    print("📡 ML Service running on http://localhost:5000")


if __name__ == "__main__":
    port = int(os.getenv("ML_PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
