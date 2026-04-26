import asyncio
import random
from datetime import datetime
import httpx

class DummyDataGenerator:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.panel_ids = [f"SP-{i:03d}" for i in range(1, 11)]  # SP-001 to SP-010
        
    async def generate_panel_data(self):
        """Generate realistic dummy data for all panels"""
        async with httpx.AsyncClient() as client:
            while True:
                for panel_id in self.panel_ids:
                    # Generate realistic solar data
                    hour = datetime.now().hour
                    
                    # Simulate day/night cycle
                    if 6 <= hour <= 18:  # Daytime
                        voltage = random.uniform(20, 28)
                        current = random.uniform(6, 10)
                        irradiance = random.uniform(400, 1000)
                    else:  # Nighttime
                        voltage = random.uniform(0, 2)
                        current = random.uniform(0, 0.5)
                        irradiance = 0
                    
                    temperature = random.uniform(20, 70)
                    
                    data = {
                        "voltage": round(voltage, 2),
                        "current": round(current, 2),
                        "temperature": round(temperature, 2),
                        "irradiance": round(irradiance, 2)
                    }
                    
                    try:
                        response = await client.post(
                            f"{self.base_url}/api/solar/panels/{panel_id}/data",
                            json=data
                        )
                        print(f"Generated data for {panel_id}: {response.status_code}")
                    except Exception as e:
                        print(f"Error connecting to backend at {self.base_url}. Is the server running? ({e})")
                        break # Stop trying panels for this cycle if server is down
                
                # Wait 5 seconds between generations
                await asyncio.sleep(5)

# Usage: Run this separately to continuously generate dummy data
if __name__ == "__main__":
    generator = DummyDataGenerator()
    asyncio.run(generator.generate_panel_data())
