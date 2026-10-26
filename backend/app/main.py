from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import devices, health, telemetry
from app.core.config import settings


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        description="Basic versioned API for GasMonitor raw MQ-2 telemetry.",
        version="0.1.0",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )
    application.include_router(
        health.router, prefix=settings.api_prefix, tags=["health"]
    )
    application.include_router(devices.router, prefix=settings.api_prefix)
    application.include_router(telemetry.router, prefix=settings.api_prefix)
    return application


app = create_app()
