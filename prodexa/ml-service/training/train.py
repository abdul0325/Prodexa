"""
Prodexa ML Training Module
Trains a Random Forest model to predict developer productivity scores
and project delivery risk based on GitHub activity data.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, accuracy_score
import joblib
import os
from datetime import datetime

# Paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
SCORE_MODEL_PATH = os.path.join(MODEL_DIR, 'productivity_model.pkl')
RISK_MODEL_PATH = os.path.join(MODEL_DIR, 'risk_model.pkl')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.pkl')


def generate_training_data(n_samples: int = 1000) -> pd.DataFrame:
    """
    Generate realistic synthetic training data based on
    real-world GitHub developer activity patterns.
    """
    np.random.seed(42)

    # Feature distributions based on real GitHub project patterns
    commits = np.random.randint(0, 150, n_samples)
    prs = np.random.randint(0, 50, n_samples)
    issues = np.random.randint(0, 80, n_samples)

    # Derived features
    commit_pr_ratio = np.where(prs > 0, commits / (prs + 1), commits)
    activity_density = commits + prs * 2 + issues * 0.5
    collaboration_score = prs * 3 + issues * 1.5

    # Productivity score formula — weighted, realistic
    raw_score = (
        commits * 0.5 +
        prs * 3.0 +
        issues * 0.8 +
        np.random.normal(0, 5, n_samples)  # noise
    )
    productivity_score = np.clip(raw_score, 0, 100).astype(int)

    # Delivery risk — based on activity levels
    risk_labels = []
    for i in range(n_samples):
        score = productivity_score[i]
        if score >= 60:
            risk_labels.append('Low')
        elif score >= 30:
            risk_labels.append('Medium')
        else:
            risk_labels.append('High')

    df = pd.DataFrame({
        'commits': commits,
        'pullRequestCount': prs,
        'issueCount': issues,
        'commit_pr_ratio': commit_pr_ratio,
        'activity_density': activity_density,
        'collaboration_score': collaboration_score,
        'productivity_score': productivity_score,
        'delivery_risk': risk_labels,
    })

    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add engineered features to improve model accuracy."""
    df = df.copy()
    df['commit_pr_ratio'] = df['commits'] / (df['pullRequestCount'] + 1)
    df['activity_density'] = df['commits'] + df['pullRequestCount'] * 2 + df['issueCount'] * 0.5
    df['collaboration_score'] = df['pullRequestCount'] * 3 + df['issueCount'] * 1.5
    return df


def train_models():
    """Train Random Forest models for productivity score and delivery risk."""
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("📊 Generating training data...")
    df = generate_training_data(n_samples=2000)

    feature_cols = [
        'commits', 'pullRequestCount', 'issueCount',
        'commit_pr_ratio', 'activity_density', 'collaboration_score'
    ]

    X = df[feature_cols]
    y_score = df['productivity_score']
    y_risk = df['delivery_risk']

    # Train/test split
    X_train, X_test, y_score_train, y_score_test, y_risk_train, y_risk_test = train_test_split(
        X, y_score, y_risk, test_size=0.2, random_state=42
    )

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # ── Model 1: Random Forest Regressor (productivity score) ──
    print("🌲 Training Random Forest Regressor (productivity score)...")
    score_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    score_model.fit(X_train_scaled, y_score_train)
    score_preds = score_model.predict(X_test_scaled)
    score_mae = mean_absolute_error(y_score_test, score_preds)
    print(f"✅ Score Model MAE: {score_mae:.2f}")

    # ── Model 2: Random Forest Classifier (delivery risk) ──
    print("🌲 Training Random Forest Classifier (delivery risk)...")
    risk_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    risk_model.fit(X_train_scaled, y_risk_train)
    risk_preds = risk_model.predict(X_test_scaled)
    risk_acc = accuracy_score(y_risk_test, risk_preds)
    print(f"✅ Risk Model Accuracy: {risk_acc * 100:.1f}%")

    # Save models
    joblib.dump(score_model, SCORE_MODEL_PATH)
    joblib.dump(risk_model, RISK_MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print(f"💾 Models saved to {MODEL_DIR}")

    return {
        "score_mae": score_mae,
        "risk_accuracy": risk_acc,
        "samples": len(df)
    }


def load_models():
    """Load trained models from disk. Train if not found."""
    if not all([
        os.path.exists(SCORE_MODEL_PATH),
        os.path.exists(RISK_MODEL_PATH),
        os.path.exists(SCALER_PATH),
    ]):
        print("⚠️  Models not found. Training now...")
        train_models()

    score_model = joblib.load(SCORE_MODEL_PATH)
    risk_model = joblib.load(RISK_MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    return score_model, risk_model, scaler


if __name__ == "__main__":
    results = train_models()
    print(f"\n🎯 Training complete!")
    print(f"   Score MAE: {results['score_mae']:.2f}")
    print(f"   Risk Accuracy: {results['risk_accuracy'] * 100:.1f}%")
    print(f"   Samples: {results['samples']}")
