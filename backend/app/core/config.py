import os
from dataclasses import dataclass


def _read_origins() -> tuple[str, ...]:
    configured = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    return tuple(origin.strip() for origin in configured.split(",") if origin.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "GasMonitor Backend")
    api_prefix: str = os.getenv("API_PREFIX", "/api/v1")
    cors_origins: tuple[str, ...] = _read_origins()


settings = Settings()
