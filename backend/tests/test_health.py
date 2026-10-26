from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_returns_service_status() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "gas-monitor-backend"}


def test_openapi_documentation_is_available() -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    assert "/api/v1/telemetry" in response.json()["paths"]
