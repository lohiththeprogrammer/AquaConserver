"""
AquaTech · Version 1.0 Backend API
FastAPI REST + WebSocket Telemetry Hub
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import asyncio
import json

app = FastAPI(
    title="AquaTech API",
    description="Unified API & Telemetry Gateway for CoolDrop and Sewage Water Purification models",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory operational cache
state = {
    "cooldrop": {
        "device_id": "ESP32-CD-01",
        "tank_level_pct": 57.1,
        "volume_liters": 142.8,
        "flow_rate_lph": 6.4,
        "water_temp_c": 19.8,
        "efficiency_pct": 92.4,
        "leak_detected": False,
        "status": "online",
        "timestamp": datetime.datetime.utcnow().isoformat()
    },
    "purification": {
        "device_id": "ESP32-PUR-02",
        "current_stage": "filtration",
        "incoming_liters": 215.0,
        "outgoing_liters": 189.2,
        "flow_rate_lpm": 2.1,
        "ph": 7.24,
        "turbidity_ntu": 0.88,
        "water_temp_c": 22.4,
        "conductivity_us": 312,
        "recovery_pct": 88.0,
        "status": "online",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
}

class DeviceRegistration(BaseModel):
    device_id: str
    name: str
    subsystem: str
    mac_address: Optional[str] = "24:0A:C4:88:2E:1A"
    mqtt_topic: str

class ExperimentPayload(BaseModel):
    name: str
    acCondensationRate: float
    wastewaterInflow: float
    filterType: str

@app.get("/")
def root():
    return {"platform": "AquaTech", "status": "online", "version": "1.0.0"}

@app.get("/api/dashboard")
def get_dashboard():
    total_recovered = state["cooldrop"]["volume_liters"] + state["purification"]["outgoing_liters"]
    water_reuse_avail = (state["cooldrop"]["volume_liters"] * 0.95) + (state["purification"]["outgoing_liters"] * 0.92)
    return {
        "total_water_recovered_l": round(total_recovered, 1),
        "cooldrop_collection_l": round(state["cooldrop"]["volume_liters"], 1),
        "wastewater_treated_l": round(state["purification"]["outgoing_liters"], 1),
        "water_available_reuse_l": round(water_reuse_avail, 1),
        "system_health": {
            "cooldrop": state["cooldrop"]["status"],
            "purification": state["purification"]["status"]
        }
    }

@app.get("/api/devices")
def list_devices():
    return [
        {
            "device_id": "ESP32-CD-01",
            "name": "CoolDrop ESP32 Master Hub",
            "type": "cooldrop",
            "status": state["cooldrop"]["status"],
            "ip": "192.168.1.104",
            "topic": "aquatech/cooldrop/sensors"
        },
        {
            "device_id": "ESP32-PUR-02",
            "name": "Purification Process Unit",
            "type": "purification",
            "status": state["purification"]["status"],
            "ip": "192.168.1.105",
            "topic": "aquatech/purification/sensors"
        }
    ]

@app.get("/api/cooldrop/latest")
def get_cooldrop_latest():
    return state["cooldrop"]

@app.get("/api/purification/latest")
def get_purification_latest():
    return state["purification"]

@app.get("/api/water/summary")
def get_water_summary():
    return {
        "cooldrop_storage_capacity": 250,
        "cooldrop_current_volume": state["cooldrop"]["volume_liters"],
        "purification_storage_capacity": 300,
        "purification_current_volume": state["purification"]["outgoing_liters"],
        "approved_allocations": [
            {"category": "Category A", "application": "Botanical Irrigation", "volume_l": 160.0},
            {"category": "Category B", "application": "Toilet Flushing", "volume_l": 140.0},
            {"category": "Category C", "application": "Cleaning Utilities", "volume_l": 65.0},
            {"category": "Restricted", "application": "Drinking/Food Prep", "volume_l": 0.0}
        ]
    }

@app.get("/api/analytics")
def get_analytics():
    tot_rec = state["cooldrop"]["volume_liters"] + state["purification"]["outgoing_liters"]
    return {
        "recovery_percentage": 88.4,
        "energy_intensity_kwh_per_m3": 0.16,
        "reuse_rate_percentage": 78.5,
        "total_water_recovered_l": round(tot_rec, 1)
    }

@app.get("/api/alerts")
def get_alerts():
    return [
        {
            "id": "ANOM-2026-08",
            "subsystem": "CoolDrop",
            "severity": "medium",
            "observation": "CoolDrop condensate collection rate dropped 28% relative to psychrometric baseline."
        }
    ]

@app.post("/api/experiments")
def save_experiment(exp: ExperimentPayload):
    return {"status": "saved", "experiment_id": f"EXP-{int(datetime.datetime.utcnow().timestamp())}", "payload": exp}

@app.post("/api/devices/register")
def register_device(dev: DeviceRegistration):
    return {"status": "success", "message": f"Device {dev.device_id} registered on topic {dev.mqtt_topic}"}

# WebSocket for Live Telemetry streaming
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            payload = {
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "cooldrop": state["cooldrop"],
                "purification": state["purification"]
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2.5)
    except WebSocketDisconnect:
        pass
