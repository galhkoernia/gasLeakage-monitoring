from fastapi import APIRouter, HTTPException

from app.schemas.device import DeviceDetailResponse, DeviceListResponse
from app.schemas.telemetry import TelemetryListResponse
from app.services.telemetry_service import telemetry_service

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("", response_model=DeviceListResponse, summary="List known devices")
def list_devices() -> DeviceListResponse:
    return DeviceListResponse(data=telemetry_service.list_devices())


@router.get("/{device_id}", response_model=DeviceDetailResponse, summary="Get a device")
def get_device(device_id: str) -> DeviceDetailResponse:
    device = telemetry_service.get_device(device_id)
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return DeviceDetailResponse(
        device=device,
        latest_telemetry=telemetry_service.get_latest_telemetry(device_id),
    )


@router.get(
    "/{device_id}/telemetry",
    response_model=TelemetryListResponse,
    summary="List a device's in-memory telemetry",
)
def list_device_telemetry(device_id: str, limit: int = 100) -> TelemetryListResponse:
    if telemetry_service.get_device(device_id) is None:
        raise HTTPException(status_code=404, detail="Device not found")
    if limit < 1 or limit > 1000:
        raise HTTPException(status_code=422, detail="limit must be between 1 and 1000")
    return TelemetryListResponse(
        data=telemetry_service.list_telemetry(device_id, limit)
    )
