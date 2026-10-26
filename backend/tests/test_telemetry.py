from fastapi.testclient import TestClient

from app.main import app
from app.services.telemetry_service import telemetry_service


client = TestClient(app)


def setup_function() -> None:
    telemetry_service._telemetry.clear()


def test_telemetry_is_accepted_and_queryable() -> None:
    payload = {
        "device_id": "GAS-001",
        "sensor": "MQ-2",
        "value": 428,
        "timestamp": "2026-10-26T12:30:00Z",
    }

    response = client.post("/api/v1/telemetry", json=payload)

    assert response.status_code == 202
    accepted = response.json()
    assert accepted["status"] == "accepted"
    assert accepted["data"]["device_id"] == payload["device_id"]
    assert accepted["data"]["sensor"] == payload["sensor"]
    assert accepted["data"]["value"] == payload["value"]
    assert accepted["data"]["timestamp"].startswith("2026-10-26T12:30:00")
    query = client.get("/api/v1/devices/GAS-001/telemetry")
    assert query.status_code == 200
    queried = query.json()["data"]
    assert len(queried) == 1
    assert queried[0]["value"] == payload["value"]


def test_telemetry_rejects_negative_raw_value() -> None:
    response = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "GAS-001",
            "sensor": "MQ-2",
            "value": -1,
            "timestamp": "2026-10-26T12:30:00Z",
        },
    )

    assert response.status_code == 422


def test_device_endpoints_return_device_and_unknown_device_is_404() -> None:
    devices_response = client.get("/api/v1/devices")
    assert devices_response.status_code == 200
    assert devices_response.json()["data"][0]["device_id"] == "GAS-001"

    detail_response = client.get("/api/v1/devices/GAS-001")
    assert detail_response.status_code == 200
    assert detail_response.json()["device"]["name"] == "Gas Monitor 001"
    assert detail_response.json()["latest_telemetry"] is None

    unknown_response = client.get("/api/v1/devices/UNKNOWN")
    assert unknown_response.status_code == 404
