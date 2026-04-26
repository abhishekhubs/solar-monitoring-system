from fastapi import APIRouter
from api.solar_routes import panels_data, initialize_panels_if_empty
import random

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats():
    """Get high-level dashboard statistics"""
    initialize_panels_if_empty()
    panels = list(panels_data.values())
    
    if not panels:
        return {
            "total_energy_today": 0,
            "active_panels": 0,
            "faulty_panels": 0,
            "system_efficiency": 0,
            "peak_power": 0
        }
    
    total_power = sum(p.power for p in panels)
    faulty_count = sum(1 for p in panels if p.status == "fault")
    active_count = len(panels)
    avg_efficiency = sum(p.power / (p.irradiance * 2 + 1) for p in panels if p.irradiance > 0) / active_count if active_count > 0 else 0
    
    return {
        "total_energy_today": round(total_power / 1000 * 5, 2), # Simulated kWh
        "active_panels": active_count,
        "faulty_panels": faulty_count,
        "system_efficiency": round(min(0.98, max(0.6, avg_efficiency)), 2),
        "peak_power": round(max(p.power for p in panels), 2)
    }
