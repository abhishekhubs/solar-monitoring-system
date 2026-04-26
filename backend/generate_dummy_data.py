import requests
import random
import time
from datetime import datetime

def generate_dummy_data():
    base_url = "http://localhost:8000"
    panel_ids = [f"SP-{i:03d}" for i in range(1, 6)]
    
    while True:
        for panel_id in panel_ids:
            # Generate realistic solar data
            hour = datetime.now().hour
            
            if 6 <= hour <= 18:  # Daytime
                voltage = round(random.uniform(20, 28), 2)
                current = round(random.uniform(6, 10), 2)
                irradiance = round(random.uniform(400, 1000), 2)
            else:  # Nighttime
                voltage = round(random.uniform(0, 2), 2)
                current = round(random.uniform(0, 0.5), 2)
                irradiance = 0
            
            temperature = round(random.uniform(20, 70), 2)
            
            data = {
                "voltage": voltage,
                "current": current,
                "temperature": temperature,
                "irradiance": irradiance
            }
            
            try:
                response = requests.post(
                    f"{base_url}/api/solar/panels/{panel_id}/data",
                    json=data
                )
                print(f"✓ Generated data for {panel_id}")
            except Exception as e:
                print(f"✗ Error for {panel_id}: {e}")
        
        time.sleep(30)  # Generate new data every 30 seconds

if __name__ == "__main__":
    generate_dummy_data()
