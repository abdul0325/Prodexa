"""
Prodexa ML Service

Behavior-aware engineering intelligence
ML microservice powered by FastAPI.

Responsibilities:
- model loading
- inference
- prediction serving
- engineering intelligence forecasting

Called by NestJS backend.
"""

import os
import uvicorn

from dotenv import load_dotenv

from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from routers.routes import router

# ─────────────────────────────────────
# ENV
# ─────────────────────────────────────

load_dotenv()

# ─────────────────────────────────────
# APP
# ─────────────────────────────────────

app = FastAPI(
    title="Prodexa ML Service",
    description=("Behavior-aware engineering " "intelligence prediction engine"),
    version="2.0.0",
)

# ─────────────────────────────────────
# CORS
# ─────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("BACKEND_URL"),
        os.getenv("BACKEND_URL"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────
# ROUTES
# ─────────────────────────────────────

app.include_router(
    router,
    prefix="",
)

# ─────────────────────────────────────
# STARTUP
# ─────────────────────────────────────


@app.on_event("startup")
async def startup_event():
    """
    Initialize ML models on startup.
    Auto-trains if models are missing.
    """

    print("\n🚀 Starting Prodexa " "Engineering Intelligence ML Service...\n")

    try:

        from training.train import (
            load_models,
        )

        (
            health_model,
            risk_model,
            scaler,
        ) = load_models()

        print(
            "✅ Engineering Health " "Model loaded",
        )

        print(
            "✅ Delivery Risk " "Model loaded",
        )

        print(
            "✅ Feature Scaler loaded",
        )

    except Exception as error:

        print(
            "❌ ML startup failed:",
        )

        print(error)

        raise error

    print(
        "\n📡 ML Service running " "on http://localhost:5000",
    )

    print(
        "🧠 Behavior-aware engineering " "intelligence active\n",
    )


# ─────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────


@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "service": "prodexa-ml-service",
        "version": "2.0.0",
        "models": [
            "engineering-health",
            "delivery-risk",
        ],
        "capabilities": [
            "engineering-health",
            "delivery-risk",
            "behavior-analysis",
            "risk-forecasting",
            "hotspot-analysis",
            "engineering-intelligence",
        ],
    }


# ─────────────────────────────────────
# MAIN
# ─────────────────────────────────────

if __name__ == "__main__":

    port = int(
        os.getenv(
            "ML_PORT",
            5000,
        )
    )

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )
