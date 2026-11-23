import os
from dataclasses import dataclass
from pathlib import Path


_DEFAULT_CSV_PATH = Path(__file__).resolve().parents[2] / "data" / "telemetry.csv"


def _read_origins() -> tuple[str, ...]:
    configured = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    )
    return tuple(origin.strip() for origin in configured.split(",") if origin.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "GasMonitor Backend")
    api_prefix: str = os.getenv("API_PREFIX", "/api/v1")
    cors_origins: tuple[str, ...] = _read_origins()
    telemetry_csv_path: Path = Path(
        os.getenv("TELEMETRY_CSV_PATH", str(_DEFAULT_CSV_PATH))
    )


settings = Settings()
