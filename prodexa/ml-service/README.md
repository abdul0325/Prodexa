# Prodexa ML Service

Random Forest-based productivity prediction microservice built with FastAPI.

## Setup

### Step 1 — Create virtual environment
```bash
cd prodexa/ml-service
python -m venv venv
```

### Step 2 — Activate virtual environment
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Step 3 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Train the models
```bash
python training/train.py
```

### Step 5 — Start the service
```bash
python main.py
```

Service runs on: http://localhost:5000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /model-info | Model details |
| POST | /predict | Run ML prediction |
| POST | /train | Retrain models |

---

## Sample Request to /predict

```json
{
  "projectId": "abc-123",
  "projectName": "My Project",
  "developers": [
    {
      "developerLogin": "john",
      "commits": 34,
      "pullRequestCount": 5,
      "issueCount": 2,
      "productivityScore": 60
    }
  ]
}
```

## Sample Response

```json
{
  "projectId": "abc-123",
  "projectScore": 72.5,
  "deliveryRisk": "Low",
  "workloadForecast": 15.8,
  "teamHealthStatus": "Good",
  "developers": [
    {
      "developerLogin": "john",
      "commits": 34,
      "pullRequestCount": 5,
      "issueCount": 2,
      "currentScore": 60,
      "predictedScore": 74.3,
      "trend": "improving",
      "riskLevel": "Low"
    }
  ],
  "generatedAt": "2026-03-14T10:00:00"
}
```
