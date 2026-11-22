# GasMonitor Backend

This is the initial FastAPI foundation for accepting and querying raw MQ-2 telemetry. It exposes a small device catalog and health endpoint. Telemetry and device data live in process memory and are lost when the process restarts. PostgreSQL is intentionally not implemented.

## Setup

From the `backend/` directory, create and activate a virtual environment:

```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

Install the application and development dependencies:

```bash
python -m pip install -e ".[dev]"
```

## Run

From `backend/`:

```bash
uvicorn app.main:app --reload
```

To make the API reachable by an ESP32 on the same LAN, run instead:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The local frontend runs at `http://localhost:5173`; the API base is
`http://localhost:8000/api/v1`. For browser access from another LAN origin,
set `CORS_ORIGINS` to that frontend origin. ESP32 can later POST JSON telemetry
to `/api/v1/telemetry` using the computer's LAN IP. Telemetry and device state
remain in memory and are cleared when the backend restarts.

Interactive API documentation is at `http://localhost:8000/docs`; ReDoc is at `http://localhost:8000/redoc`.

## Tests

```bash
pytest
```

## Endpoints

All application endpoints use `/api/v1`:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/health` | Basic service health |
| GET | `/api/v1/devices` | List the in-memory devices |
| GET | `/api/v1/devices/{device_id}` | Get a device and its latest telemetry |
| GET | `/api/v1/devices/{device_id}/telemetry?limit=100` | Get recent in-memory telemetry |
| POST | `/api/v1/telemetry` | Validate and accept a raw sensor reading |

The `value` field is the raw MQ-2 sensor value, not a calibrated concentration or ppm measurement. The default CORS origin is `http://localhost:5173`; `APP_NAME`, `API_PREFIX`, and comma-separated `CORS_ORIGINS` can be set through the environment.
