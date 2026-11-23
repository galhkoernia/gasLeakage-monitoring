from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

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


@router.get(
    "/export",
    response_class=FileResponse,
    summary="Download telemetry CSV backup",
)
def download_telemetry_csv() -> FileResponse:
    path = telemetry_service.get_csv_path()
    if not path.is_file():
        raise HTTPException(
            status_code=404, detail="No telemetry CSV is available yet"
        )
    return FileResponse(path, media_type="text/csv", filename="telemetry.csv")
