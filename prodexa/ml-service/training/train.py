from dotenv import load_dotenv
import os
import joblib
import requests
import pandas as pd

from sklearn.ensemble import (
    RandomForestRegressor,
    RandomForestClassifier,
)

from sklearn.model_selection import (
    train_test_split,
)

from sklearn.preprocessing import (
    StandardScaler,
)

from sklearn.metrics import (
    mean_absolute_error,
    accuracy_score,
)

load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".env",
    )
)

# PATHS

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
)

ENGINEERING_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "engineering_health_model.pkl",
)

RISK_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "delivery_risk_model.pkl",
)

SCALER_PATH = os.path.join(
    MODEL_DIR,
    "scaler.pkl",
)

# DATASET SOURCE

BACKEND_DATASET_URL = f"{os.getenv('BACKEND_URL')}/ml/dataset"
print("BACKEND_URL =", os.getenv("BACKEND_URL"))
print("DATASET_URL =", BACKEND_DATASET_URL)

# FETCH REAL DATASET

def fetch_real_dataset():

    print(
        "📡 Fetching engineering dataset " "from backend...",
    )

    response = requests.get(
        BACKEND_DATASET_URL,
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    df = pd.DataFrame(data)

    print(
        f"Dataset loaded: " f"{len(df)} samples",
    )

    return df


# FEATURE ENGINEERING

def engineer_features(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = df.copy()

    # Stability signal

    df["stability_score"] = 100 - df["avgRiskScore"]

    # Engineering discipline

    df["engineering_discipline"] = (df["testingRatio"] * 100) - (df["noiseRatio"] * 100)

    # Risk pressure

    df["risk_pressure"] = df["hotspotCount"] * df["avgRiskScore"]

    # Backend volatility

    df["backend_volatility"] = df["backendChanges"] * df["avgRiskScore"]

    # Infra criticality

    df["infra_pressure"] = df["infraChanges"] * df["avgRiskScore"]

    return df


# TRAIN MODELS

def train_models():

    os.makedirs(
        MODEL_DIR,
        exist_ok=True,
    )

    print(
        "📊 Loading real engineering " "telemetry...",
    )

    df = fetch_real_dataset()

    df = engineer_features(df)

    # FEATURES

    feature_cols = [
        "totalCommits",
        "totalPRs",
        "avgImpactScore",
        "avgRiskScore",
        "avgMeaningfulness",
        "riskyCommits",
        "highImpactCommits",
        "lowValueCommits",
        "noiseRatio",
        "testingRatio",
        "backendChanges",
        "frontendChanges",
        "infraChanges",
        "securityChanges",
        "hotspotCount",
        "stability_score",
        "engineering_discipline",
        "risk_pressure",
        "backend_volatility",
        "infra_pressure",
        "hotspotRatio",
        "testingCoverage",
        "backendRiskRatio",
    ]

    X = df[feature_cols]

    # TARGETS

    y_health = df["label_engineeringHealth"]

    y_risk = df["label_deliveryRisk"]

    # TRAIN / TEST SPLIT

    if len(df) < 5:

        print("Small dataset detected. " "Using full dataset for training.")

        X_train = X
        X_test = X

        y_health_train = y_health
        y_health_test = y_health

        y_risk_train = y_risk
        y_risk_test = y_risk

    else:

        (
            X_train,
            X_test,
            y_health_train,
            y_health_test,
            y_risk_train,
            y_risk_test,
        ) = train_test_split(
            X,
            y_health,
            y_risk,
            test_size=0.2,
            random_state=42,
        )

    # SCALE FEATURES

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(
        X_train,
    )

    X_test_scaled = scaler.transform(
        X_test,
    )

    # MODEL 1
    # Engineering Health Regressor

    print(
        "🌲 Training Engineering " "Health Model...",
    )

    health_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
    )

    health_model.fit(
        X_train_scaled,
        y_health_train,
    )

    health_preds = health_model.predict(
        X_test_scaled,
    )

    health_mae = mean_absolute_error(
        y_health_test,
        health_preds,
    )

    print(
        f"Engineering Health " f"MAE: {health_mae:.2f}",
    )

    # MODEL 2
    # Delivery Risk Classifier

    print(
        "🌲 Training Delivery " "Risk Model...",
    )

    risk_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
    )

    risk_model.fit(
        X_train_scaled,
        y_risk_train,
    )

    risk_preds = risk_model.predict(
        X_test_scaled,
    )

    risk_accuracy = accuracy_score(
        y_risk_test,
        risk_preds,
    )

    print(
        f"Delivery Risk Accuracy: " f"{risk_accuracy * 100:.1f}%",
    )

    # SAVE MODELS

    joblib.dump(
        health_model,
        ENGINEERING_MODEL_PATH,
    )

    joblib.dump(
        risk_model,
        RISK_MODEL_PATH,
    )

    joblib.dump(
        scaler,
        SCALER_PATH,
    )

    print(
        f"💾 Models saved to " f"{MODEL_DIR}",
    )

    # FEATURE IMPORTANCE

    importance_df = pd.DataFrame(
        {
            "feature": feature_cols,
            "importance": health_model.feature_importances_,
        }
    )

    importance_df = importance_df.sort_values(
        by="importance",
        ascending=False,
    )

    print(
        "\n📈 TOP ENGINEERING " "SIGNALS:",
    )

    print(
        importance_df.head(10),
    )

    return {
        "engineering_health_mae": health_mae,
        "risk_accuracy": risk_accuracy,
        "samples": len(df),
    }

# LOAD MODELS

def load_models():

    if not all(
        [
            os.path.exists(
                ENGINEERING_MODEL_PATH,
            ),
            os.path.exists(
                RISK_MODEL_PATH,
            ),
            os.path.exists(
                SCALER_PATH,
            ),
        ]
    ):

        print(
            "Models not found. " "Training now...",
        )

        train_models()

    health_model = joblib.load(
        ENGINEERING_MODEL_PATH,
    )

    risk_model = joblib.load(
        RISK_MODEL_PATH,
    )

    scaler = joblib.load(
        SCALER_PATH,
    )

    return (
        health_model,
        risk_model,
        scaler,
    )

# MAIN

if __name__ == "__main__":

    results = train_models()

    print("\nTraining complete!")

    print(
        f"   Engineering Health MAE: " f'{results["engineering_health_mae"]:.2f}',
    )

    print(
        f"   Delivery Risk Accuracy: " f'{results["risk_accuracy"] * 100:.1f}%',
    )

    print(
        f"   Samples: " f'{results["samples"]}',
    )
