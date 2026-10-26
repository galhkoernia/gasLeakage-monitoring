from app.schemas.device import Device
from app.schemas.telemetry import Telemetry


class TelemetryService:
    """Owns the temporary in-memory device and telemetry state."""

    def __init__(self) -> None:
        self._devices: dict[str, Device] = {
            "GAS-001": Device(
                device_id="GAS-001",
                name="Gas Monitor 001",
                status="online",
            )
        }
        self._telemetry: dict[str, list[Telemetry]] = {}

    def list_devices(self) -> list[Device]:
        return list(self._devices.values())

    def get_device(self, device_id: str) -> Device | None:
        return self._devices.get(device_id)

    def record_telemetry(self, telemetry: Telemetry) -> Telemetry:
        self._telemetry.setdefault(telemetry.device_id, []).append(telemetry)
        return telemetry

    def get_latest_telemetry(self, device_id: str) -> Telemetry | None:
        records = self._telemetry.get(device_id, [])
        return records[-1] if records else None

    def list_telemetry(self, device_id: str, limit: int) -> list[Telemetry]:
        records = self._telemetry.get(device_id, [])
        
        # Proses penyerapan menambahkan data bacaan, jadi balikan 
        # potongan yang dipilih agar data terbaru muncul lebih dulu.
        return list(reversed(records[-limit:]))


telemetry_service = TelemetryService()
