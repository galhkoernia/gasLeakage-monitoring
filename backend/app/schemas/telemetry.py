from datetime import datetime

from pydantic import BaseModel, Field


class Telemetry(BaseModel):
    """Raw sensor reading; value is not a calibrated gas concentration."""

    device_id: str = Field(min_length=1)
    sensor: str = Field(min_length=1)
    value: int = Field(ge=0, description="Raw MQ-2 sensor value")
    timestamp: datetime


class TelemetryAcceptedResponse(BaseModel):
    status: str
    data: Telemetry


class TelemetryListResponse(BaseModel):
    data: list[Telemetry]
