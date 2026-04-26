from fastapi import APIRouter
from models.solar_models import FaultPrediction
import random
from typing import List

router = APIRouter()

@router.get("/predict/{panel_id}", response_model=FaultPrediction)
async def predict_fault(panel_id: str):
    """Predict potential faults using ML model"""
    # Dummy ML predictions (replace with actual model)
    predictions = [
        "normal_operation",
        "potential_dust_accumulation",
        "possible_panel_degradation",
        "maintenance_required_soon",
        "imminent_failure_risk"
    ]
    
    recommendations = [
        "Clean solar panels regularly",
        "Check electrical connections",
        "Monitor temperature trends",
        "Schedule preventive maintenance"
    ]
    
    prediction = random.choice(predictions)
    confidence = round(random.uniform(0.7, 0.95), 2)
    
    return FaultPrediction(
        panel_id=panel_id,
        prediction=prediction,
        confidence=confidence,
        recommendations=recommendations[:random.randint(1, 3)]
    )

@router.get("/efficiency/trend")
async def get_efficiency_trend(days: int = 30):
    """Get efficiency trend data"""
    # Generate dummy efficiency data
    trend_data = []
    base_efficiency = 0.85
    
    for i in range(days):
        date = f"2024-01-{i+1:02d}"
        efficiency = base_efficiency + random.uniform(-0.1, 0.05)
        trend_data.append({
            "date": date,
            "efficiency": max(0.1, efficiency),  # Ensure positive values
            "energy_produced": round(efficiency * 1000, 2)  # kWh
        })
    
    return trend_data
