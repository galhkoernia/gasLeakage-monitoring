from datetime import datetime
from typing import Literal

from pydantic import BaseModel

from app.schemas.telemetry import Telemetry


class Device(BaseModel):
    device_id: str
    name: str
    status: Literal["online", "offline"]
    last_seen: datetime | None = None


class DeviceListResponse(BaseModel):
    data: list[Device]


class DeviceDetailResponse(BaseModel):
    device: Device
    latest_telemetry: Telemetry | None
