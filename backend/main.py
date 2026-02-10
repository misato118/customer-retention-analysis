from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'src', 'churn_model.pkl')

model = joblib.load(model_path)

class CustomerData(BaseModel):
  tenure: int
  monthly_charges: float
  total_charges: float
  contract_type: int

@app.get("/")
def home():
  return {"message": "Churn Prediction API is live!"}

@app.post("/predict")
def churn_prediction(data: CustomerData):
  features = [[
    data.tenure,
    data.monthly_charges,
    data.total_charges,
    data.contract_type
  ]]

  prediction = model.predict(features)
  probability = model.predict_proba(features)[0][1]

  return {
    "prediction": int(prediction[0]),
    "churn_probability": float(probability),
    "message": "High Risk of Churn" if prediction[0] == 1 else "Customer is Safe"
  }