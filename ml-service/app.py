from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

# Load the full pipeline (preprocessor + LightGBM)
model = joblib.load("model/used_car_lgbm_pipeline.pkl")

app = FastAPI(title="Used Car Price Model")

# Input schema
class CarFeatures(BaseModel):
    # Numeric
    year: int
    mileage: float
    mpg_avg: float
    engine_size_l: float
    hp: float
    car_age: float

    # Categorical
    manufacturer: str
    model: str
    transmission: str
    drivetrain: str
    fuel_type: str
    exterior_color: str

    # These were categorical in training, values are 0/1.
    accidents_or_damage: int
    one_owner: int
    personal_use_only: int

    # Feature engineering
    model_variant: str
    model_engine: str
    model_drivetrain: str
    model_full: str


class PredictionResponse(BaseModel):
    predicted_price: float


@app.post("/predict", response_model=PredictionResponse)
def predict(car: CarFeatures):
    # Convert to DataFrame with a single row
    data = pd.DataFrame([car.dict()])

    # Run through pipeline (preprocessing + LightGBM)
    pred = model.predict(data)[0]

    return PredictionResponse(predicted_price=float(pred))
