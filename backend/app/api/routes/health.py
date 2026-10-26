from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str


@router.get("/health", response_model=HealthResponse, summary="Check backend health")
def get_health() -> HealthResponse:
    return HealthResponse(status="ok", service="gas-monitor-backend")
