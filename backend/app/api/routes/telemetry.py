from fastapi import APIRouter

from app.schemas.telemetry import Telemetry, TelemetryAcceptedResponse
from app.services.telemetry_service import telemetry_service

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.post(
    "",
    response_model=TelemetryAcceptedResponse,
    status_code=202,
    summary="Accept a raw sensor reading",
)
def ingest_telemetry(payload: Telemetry) -> TelemetryAcceptedResponse:
    accepted = telemetry_service.record_telemetry(payload)
    return TelemetryAcceptedResponse(status="accepted", data=accepted)
