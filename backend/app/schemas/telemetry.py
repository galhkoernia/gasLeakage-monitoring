from datetime import datetime, timezone

from pydantic import BaseModel, Field


class Telemetry(BaseModel):
    """Raw sensor reading; value is not a calibrated gas concentration."""

    device_id: str = Field(min_length=1)
    sensor: str = Field(min_length=1)
    value: int = Field(ge=0, description="Raw MQ-2 sensor value")
    gas_status: int | None = Field(default=None, ge=0, le=1)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TelemetryAcceptedResponse(BaseModel):
    status: str
    data: Telemetry


class TelemetryListResponse(BaseModel):
    data: list[Telemetry]
