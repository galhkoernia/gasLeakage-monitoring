# GasMonitor System Architecture

## 1. Architecture Overview

GasMonitor is designed as a modular monitoring system consisting of three primary layers:

```text
┌──────────────────────┐
│      ESP32           │
│ Sensor Acquisition   │
│ Local Safety Logic   │
└──────────┬───────────┘
           │
           │ HTTP / JSON
           ▼
┌──────────────────────┐
│      FastAPI         │
│ Ingestion & API      │
│ Validation           │
│ Processing           │
└──────────┬───────────┘
           │
           ├──────────────► PostgreSQL
           │
           │ REST / SSE
           ▼
┌──────────────────────┐
│      React           │
│    GasMonitor UI     │
│ Monitoring Dashboard │
└──────────────────────┘
```

This is the target system architecture.

Only the React frontend and its mock data layer are implemented during the current phase.

---

# 2. Architectural Principles

The architecture follows these principles:

## Separation of Concerns

Each layer has a clearly defined responsibility.

```text
Firmware
= sensor acquisition + local safety

Backend
= ingestion + validation + persistence + API

Frontend
= visualization + interaction + monitoring
```

No layer should absorb responsibilities belonging to another layer.

---

# 3. System Components

## 3.1 ESP32

Responsibilities:

- acquire MQ-2 sensor readings
- acquire local device state
- perform necessary low-level preprocessing
- evaluate local alarm thresholds
- control LED
- control buzzer
- maintain device connectivity
- transmit telemetry

The ESP32 remains capable of local alarm operation even if the backend or dashboard is unavailable.

This is an important safety boundary.

---

# 4. Local Safety Path

The local safety path is independent of the web application.

```text
MQ-2
 ↓
ESP32
 ↓
Threshold Evaluation
 ├── NORMAL
 ├── WARNING
 └── DANGER
 ↓
LED / Buzzer
```

The dashboard does not replace this mechanism.

If the network fails:

```text
ESP32
   │
   ├── Local alarm → continues
   │
   └── Backend communication → unavailable
```

The system must not depend on the dashboard for immediate local alerting.

---

# 5. Monitoring Path

The monitoring path is:

```text
MQ-2
 ↓
ESP32
 ↓
HTTP/JSON
 ↓
FastAPI
 ↓
Validation
 ↓
Persistence
 ↓
REST / SSE
 ↓
React
 ↓
Dashboard
```

This path is responsible for remote monitoring and historical visualization.

---

# 6. Frontend Architecture

The frontend follows:

```text
Pages
 ↓
Feature Components
 ↓
Hooks
 ↓
Data Access
 ↓
API / Mock Implementation
```

Current:

```text
Pages
 ↓
Components
 ↓
Hooks
 ↓
Mock Data
```

Future:

```text
Pages
 ↓
Components
 ↓
Hooks
 ↓
API Client
 ↓
FastAPI
```

This allows the UI to remain stable while the underlying data source changes.

---

# 7. Frontend Responsibility Boundary

The frontend is responsible for:

- displaying telemetry
- displaying device state
- displaying alarm events
- displaying system status
- filtering and selecting telemetry
- changing frontend configuration state
- rendering charts
- presenting historical data
- communicating API errors
- communicating offline state

The frontend is NOT responsible for:

- reading the MQ-2 sensor
- controlling ESP32 hardware
- deciding physical emergency actions
- storing the authoritative telemetry database
- implementing backend validation
- implementing sensor calibration
- implementing device firmware logic

---

# 8. Backend Responsibility Boundary

The future backend is responsible for:

- receiving ESP32 telemetry
- validating incoming payloads
- validating device identity
- timestamp handling
- persistence
- querying telemetry
- querying alarms
- exposing REST APIs
- providing realtime updates
- backend health monitoring

The backend becomes the authoritative server-side source of telemetry history.

---

# 9. Database Responsibility

The future PostgreSQL database stores persistent data.

Conceptual entities:

```text
Device
Telemetry
AlarmEvent
Configuration
```

The frontend must not directly access PostgreSQL.

The communication path is always:

```text
React
 ↓
FastAPI
 ↓
PostgreSQL
```

---

# 10. Communication Protocol

The initial target architecture uses HTTP/JSON for device ingestion.

Conceptually:

```text
ESP32
POST /api/v1/telemetry
Content-Type: application/json
```

Example conceptual payload:

```json
{
  "device_id": "GAS-001",
  "sensor": "MQ-2",
  "value": 428,
  "timestamp": "2026-10-26T12:30:00Z"
}
```

The exact API contract will be defined separately in:

```text
docs/API-CONTRACT.md
```

The current frontend phase does not implement this endpoint.

---

# 11. REST API

The frontend is expected to consume REST endpoints conceptually similar to:

```text
GET /api/v1/devices

GET /api/v1/devices/{device_id}

GET /api/v1/devices/{device_id}/telemetry

GET /api/v1/alarms

GET /api/v1/health
```

The exact contract is intentionally separated from this architectural document.

---

# 12. Realtime Communication

The intended realtime frontend mechanism is currently:

**Server-Sent Events (SSE)**

Conceptually:

```text
FastAPI
   │
   │ SSE
   ▼
React
```

Reason:

The frontend primarily consumes server-to-client telemetry updates.

The initial system does not require bidirectional realtime communication between browser and server.

Therefore SSE is preferred over WebSocket for the initial architecture.

This decision may be revisited if future requirements introduce true bidirectional communication.

---

# 13. Realtime Architecture

Future:

```text
ESP32
   │
   ▼
FastAPI
   │
   ├── PostgreSQL
   │
   └── SSE Stream
          │
          ▼
       React
```

The React application should maintain a clear distinction between:

```text
Historical Data
```

and

```text
Realtime Data
```

Historical data is queried through REST.

Realtime updates are consumed through SSE.

---

# 14. Data Flow

## Telemetry Acquisition

```text
MQ-2
 ↓
ESP32 ADC
 ↓
Raw sensor value
 ↓
ESP32 telemetry object
 ↓
HTTP
 ↓
FastAPI
 ↓
Validation
 ↓
Database
```

## Dashboard Visualization

```text
Database
 ↓
FastAPI
 ↓
REST
 ↓
React
 ↓
Telemetry State
 ↓
Chart
```

## Realtime Update

```text
MQ-2
 ↓
ESP32
 ↓
FastAPI
 ↓
SSE
 ↓
React
 ↓
Telemetry State
 ↓
Dashboard
```

---

# 15. Gas State Model

The conceptual state machine is:

```text
              ┌───────────┐
              │  NORMAL   │
              └─────┬─────┘
                    │
             warning threshold
                    │
                    ▼
              ┌───────────┐
              │  WARNING  │
              └─────┬─────┘
                    │
              danger threshold
                    │
                    ▼
              ┌───────────┐
              │  DANGER   │
              └─────┬─────┘
                    │
               value recovers
                    │
                    ▼
              ┌───────────┐
              │  NORMAL   │
              └───────────┘
```

Offline is orthogonal to the gas state:

```text
ONLINE + NORMAL
ONLINE + WARNING
ONLINE + DANGER
OFFLINE
```

Do not model OFFLINE as a gas severity.

---

# 16. Device State

Device connectivity should be derived from communication freshness.

Conceptually:

```text
Last communication within expected interval
        ↓
ONLINE

No communication beyond timeout
        ↓
OFFLINE
```

The exact heartbeat/timeout policy belongs to the backend and device protocol.

The frontend should receive or derive the state from clearly defined data.

---

# 17. Data Ownership

Ownership is explicitly divided.

### ESP32 owns:

- raw acquisition
- local hardware state
- local alarm output

### Backend owns:

- authoritative server-side telemetry
- persistence
- API validation
- historical data
- alarm history

### Frontend owns:

- presentation state
- UI state
- filters
- selected time range
- chart presentation
- temporary user interaction state

The frontend must not become the authoritative source of telemetry.

---

# 18. Error Boundary

Failures must remain isolated.

### Sensor failure

```text
ESP32
 ↓
Sensor unavailable
```

Should not automatically crash the backend.

### Device offline

```text
ESP32 unavailable
 ↓
Backend retains previous history
 ↓
Frontend shows OFFLINE
```

### Backend unavailable

```text
Backend unavailable
 ↓
Frontend shows connection/error state
```

### Frontend unavailable

```text
Local ESP32 alarm
 ↓
continues independently
```

This is an important resilience property.

---

# 19. Security Boundary

Future security responsibilities:

```text
ESP32 → authenticated device ingestion
Backend → API authorization
Frontend → authenticated user session
Database → backend-only access
```

The current frontend prototype does not implement authentication.

Do not introduce fake authentication merely to simulate production architecture.

---

# 20. Scalability Direction

The system should support multiple devices.

Current:

```text
GAS-001
```

Future:

```text
GAS-001
GAS-002
GAS-003
...
```

The frontend must therefore use:

```text
device_id
```

as an explicit identifier.

Do not hard-code `GAS-001` into reusable components.

---

# 21. Repository Architecture

Target repository:

```text
gas-monitor/
│
├── README.md
│
├── docs/
│   ├── PRD.md
│   ├── PROJECT-LOCK.md
│   ├── DESIGN-SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── FRONTEND-ARCHITECTURE.md
│   ├── DATA-MODEL.md
│   ├── API-CONTRACT.md
│   ├── DEVELOPMENT-GUIDE.md
│   └── ROADMAP.md
│
├── frontend/
│
├── backend/
│
├── firmware/
│
└── infrastructure/
```

During the current phase:

```text
frontend/
docs/
README.md
```

are the only active development areas.

---

# 22. Architecture Decision Rules

When introducing a new system component, ask:

1. Which layer owns this responsibility?
2. Does the component violate separation of concerns?
3. Does it introduce unnecessary coupling?
4. Can the existing architecture support the requirement?
5. Is the component required now or only in the future?

Do not implement future infrastructure prematurely.

---

# 23. Current vs Future Architecture

## Current

```text
React
 │
 ├── Pages
 ├── Components
 ├── Hooks
 └── Mock Data
```

## Future

```text
                    ┌──────────────┐
                    │   ESP32      │
                    │ MQ-2 Sensor  │
                    └──────┬───────┘
                           │
                        HTTP
                           │
                           ▼
                    ┌──────────────┐
                    │   FastAPI    │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
        ┌──────────────┐       ┌──────────────┐
        │ PostgreSQL   │       │     SSE      │
        └──────────────┘       └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │    React     │
                               │  GasMonitor  │
                               └──────────────┘
```

The current frontend implementation must preserve this migration path.

---

# 24. Architecture Constraints

The following architectural constraints are locked:

- frontend cannot directly access the database
- frontend cannot directly communicate with ESP32
- UI components cannot own persistent data access
- mock data cannot be scattered through components
- firmware logic cannot be implemented in React
- backend logic cannot be implemented in React
- sensor calibration cannot be invented by the frontend
- local hardware alarm cannot depend on the web application
- future realtime communication must remain isolated behind a data-access abstraction

---

# 25. Final Architecture Principle

The architecture should remain understandable.

The intended system is:

```text
Sensor
  ↓
Device
  ↓
Backend
  ↓
Data
  ↓
Monitoring UI
```

Each layer has one primary responsibility.

The project should not evolve into a distributed system merely for architectural sophistication.

Complexity must be justified by an actual requirement.