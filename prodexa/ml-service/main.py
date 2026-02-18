from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def health():
    return {"status": "ML service running successfully."}
