# GasMonitor

GasMonitor is an ESP32-based gas leakage detection and monitoring system designed around an MQ-2 gas sensor.

The system has two operational paths:

1. Local safety path — ESP32 evaluates the sensor state and drives the local LED/buzzer alarm.
2. Monitoring path — ESP32 telemetry is intended to be transmitted to a backend and visualized through a web dashboard.

The current development phase connects the dashboard to a local FastAPI backend. Device and telemetry state remains in memory.

## Project Status

**Current phase:** Local frontend/backend integration
**Current data source:** FastAPI for devices and telemetry; temporary mock data for alarms
**Hardware integration:** ESP32 firmware integration is a later step

The dashboard reads devices and telemetry from FastAPI. The backend uses in-memory storage; data is lost when the process stops.

## Product Goal

GasMonitor provides a clear monitoring interface for:

- Current gas sensor state
- MQ-2 raw sensor value
- Gas telemetry trends
- Device connectivity
- Alarm events
- Device information
- Historical telemetry
- Detection configuration

The dashboard is a monitoring interface, not the primary safety mechanism.

Local hardware alarms remain independent of the web application.

## Technology Direction

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Lucide React
- Apache ECharts

### Backend

- Python
- FastAPI
- Pydantic
- In-memory device and telemetry state

### Communication

ESP32 → Backend:

- HTTP/JSON

Backend → Frontend:

- REST/JSON
- Frontend polls REST endpoints every 2 seconds

ESP32 firmware integration and persistent storage remain future scope.

## Repository Structure

```text
gas-monitor/
├── README.md
├── docs/
│   ├── PRD.md
│   ├── DESIGN-SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── DATA-MODEL.md
│   ├── FRONTEND-ARCHITECTURE.md
│   ├── API-CONTRACT.md
│   ├── PROJECT-LOCK.md
│   ├── DEVELOPMENT-GUIDE.md
│   └── ROADMAP.md
│
├── frontend/
├── backend/       # future
├── firmware/      # future
└── docker-compose.yml
```

## Current Frontend Scope

The frontend currently provides:

- Dashboard
- Device overview
- Device detail
- Telemetry
- Alarm history
- Settings
- About

Device and telemetry views use the backend API. Alarm events remain temporary mock data until an alarm endpoint is added.

## Local Development

- Frontend: `http://localhost:5173` (`cd frontend && npm run dev`)
- Backend/API: `http://localhost:8000` and `http://localhost:8000/api/v1`
- Copy `frontend/.env.example` to `frontend/.env.local` to configure the API URL.
- From `backend/`, run `uvicorn app.main:app --host 0.0.0.0 --port 8000` for LAN access.
- Set frontend `VITE_API_BASE_URL` when the backend is reached at a different host, for example `http://192.168.1.10:8000`.
- ESP32 will later POST MQ-2 telemetry to `/api/v1/telemetry` over the local LAN.

The mock data must be isolated from presentation components.

## Important Sensor Note

MQ-2 is treated as a gas sensor whose current frontend representation is a raw sensor value.

The frontend must not claim that raw MQ-2 readings are calibrated gas concentrations in ppm.

A future calibration layer may convert raw sensor measurements into an estimated concentration, but such conversion requires a defined calibration methodology.

## Design Philosophy

GasMonitor uses a modern industrial monitoring visual language.

The interface should be:

- precise
- calm
- technical
- readable
- restrained
- professional

The interface must not resemble an AI dashboard or generic AI-generated SaaS template.

Avoid:

- excessive gradients
- neon effects
- glassmorphism
- excessive blur
- decorative 3D elements
- animated backgrounds
- excessive rounded cards
- unnecessary visual effects
- oversized typography
- decorative elements without functional meaning

Visual hierarchy and operational clarity take priority over visual novelty.

## Development Principle

The project follows a separation-of-concerns architecture.

Frontend UI must not contain backend implementation.

Mock data must not be embedded directly inside visual components.

Future backend integration must occur through a dedicated data-access layer.

## Documentation

Read the following documents before making architectural changes:

- `docs/PROJECT-LOCK.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/FRONTEND-ARCHITECTURE.md`
- `docs/API-CONTRACT.md`

`PROJECT-LOCK.md` has the highest authority over project scope and technical decisions.
