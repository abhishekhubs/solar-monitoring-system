from fastapi import APIRouter, HTTPException
from typing import List
import random
from datetime import datetime, timedelta
from models.solar_models import SolarPanelData, SolarPanelCreate, PanelStatus

router = APIRouter()

# In-memory storage (replace with database in production)
panels_data = {}
panels_history = {}

@router.post("/panels/{panel_id}/data", response_model=SolarPanelData)
async def add_panel_data(panel_id: str, data: SolarPanelCreate):
    """Add new solar panel reading"""
    # Generate faults based on data
    faults = detect_faults(data)
    status = determine_status(faults)
    
    panel_data = SolarPanelData(
        id=panel_id,
        timestamp=datetime.utcnow(),
        voltage=data.voltage,
        current=data.current,
        power=data.voltage * data.current,
        temperature=data.temperature,
        irradiance=data.irradiance,
        status=status,
        faults=faults
    )
    
    panels_data[panel_id] = panel_data
    
    # Store in history (limit to last 100 entries to prevent memory leak)
    if panel_id not in panels_history:
        panels_history[panel_id] = []
    
    panels_history[panel_id].append(panel_data)
    
    # Keep only the latest 100 readings
    if len(panels_history[panel_id]) > 100:
        panels_history[panel_id] = panels_history[panel_id][-100:]
    
    return panel_data

@router.get("/panels/{panel_id}", response_model=SolarPanelData)
async def get_panel_data(panel_id: str):
    """Get latest data for a specific panel"""
    if panel_id not in panels_data:
        raise HTTPException(status_code=404, detail="Panel not found")
    return panels_data[panel_id]

@router.get("/panels", response_model=List[SolarPanelData])
async def get_all_panels():
    """Get all panels data"""
    return list(panels_data.values())

@router.get("/panels/{panel_id}/history", response_model=List[SolarPanelData])
async def get_panel_history(panel_id: str, hours: int = 24):
    """Get panel history for specified hours"""
    if panel_id not in panels_history:
        return []
    
    cutoff_time = datetime.utcnow() - timedelta(hours=hours)
    filtered_data = [
        data for data in panels_history[panel_id] 
        if data.timestamp >= cutoff_time
    ]
    return filtered_data

def detect_faults(data: SolarPanelCreate) -> List[str]:
    """Simple fault detection logic"""
    faults = []
    
    if data.voltage < 18:  # Low voltage threshold
        faults.append("low_voltage")
    
    if data.voltage > 30:  # High voltage threshold
        faults.append("high_voltage")
        
    if data.current > 12:  # High current
        faults.append("high_current")
        
    if data.temperature > 65:  # Overheating
        faults.append("overheating")
        
    if data.irradiance < 200 and data.voltage > 20:  # Shading
        faults.append("shading_detected")
        
    return faults

def determine_status(faults: List[str]) -> PanelStatus:
    """Determine panel status based on faults"""
    if len(faults) == 0:
        return PanelStatus.NORMAL
    elif len(faults) <= 2:
        return PanelStatus.WARNING
    else:
        return PanelStatus.FAULT
