from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class PanelStatus(str, Enum):
    NORMAL = "normal"
    WARNING = "warning"
    FAULT = "fault"

class SolarPanelData(BaseModel):
    id: str
    timestamp: datetime
    voltage: float
    current: float
    power: float
    temperature: float
    irradiance: float
    status: PanelStatus
    faults: List[str] = []

class SolarPanelCreate(BaseModel):
    voltage: float
    current: float
    temperature: float
    irradiance: float

class FaultPrediction(BaseModel):
    panel_id: str
    prediction: str
    confidence: float
    recommendations: List[str]

class EfficiencyReport(BaseModel):
    date_range: str
    average_efficiency: float
    total_energy: float
    comparison_previous: float
