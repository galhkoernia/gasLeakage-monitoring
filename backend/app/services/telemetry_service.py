import csv
from datetime import datetime, timezone
from pathlib import Path

from app.core.config import settings

from app.schemas.device import Device
from app.schemas.telemetry import Telemetry


class TelemetryService:
    """Owns the temporary in-memory device and telemetry state."""

    def __init__(self) -> None:
        self._csv_path = settings.telemetry_csv_path
        self._devices: dict[str, Device] = {
            "GAS-001": Device(
                device_id="GAS-001",
                name="Gas Monitor 001",
                status="offline",
            )
        }
        self._telemetry: dict[str, list[Telemetry]] = {}

    def list_devices(self) -> list[Device]:
        return list(self._devices.values())

    def get_device(self, device_id: str) -> Device | None:
        return self._devices.get(device_id)

    def record_telemetry(self, telemetry: Telemetry) -> Telemetry:
        self._append_csv(telemetry)
        device = self._devices.get(telemetry.device_id)
        if device is None:
            device = Device(
                device_id=telemetry.device_id,
                name=telemetry.device_id,
                status="online",
            )
        self._devices[telemetry.device_id] = device.model_copy(
            update={"status": "online", "last_seen": datetime.now(timezone.utc)}
        )
        self._telemetry.setdefault(telemetry.device_id, []).append(telemetry)
        return telemetry

    def _append_csv(self, telemetry: Telemetry) -> None:
        self._csv_path.parent.mkdir(parents=True, exist_ok=True)
        write_header = not self._csv_path.exists() or self._csv_path.stat().st_size == 0
        with self._csv_path.open("a", newline="", encoding="utf-8") as csv_file:
            writer = csv.DictWriter(
                csv_file,
                fieldnames=("device_id", "sensor", "value", "gas_status", "timestamp"),
            )
            if write_header:
                writer.writeheader()
            writer.writerow(telemetry.model_dump(mode="json"))

    def get_csv_path(self) -> Path:
        return self._csv_path

    def get_latest_telemetry(self, device_id: str) -> Telemetry | None:
        records = self._telemetry.get(device_id, [])
        return records[-1] if records else None

    def list_telemetry(self, device_id: str, limit: int) -> list[Telemetry]:
        records = self._telemetry.get(device_id, [])
        
        # Proses penyerapan menambahkan data bacaan, jadi balikan 
        # potongan yang dipilih agar data terbaru muncul lebih dulu.
        return list(reversed(records[-limit:]))


telemetry_service = TelemetryService()
