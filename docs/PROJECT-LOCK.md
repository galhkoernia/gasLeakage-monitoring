# GasMonitor — Project Lock

> This document is the highest-level project constraint.
>
> Any implementation decision that conflicts with this document must be rejected unless this document is explicitly revised.

## 1. Project Identity

Project name:

**GasMonitor**

Project type:

**ESP32-based gas leakage detection and monitoring system**

Current development phase:

**Frontend-only implementation**

## 2. Current Scope Lock

The current implementation is strictly limited to the frontend application.

The frontend uses mock data.

The following are NOT to be implemented in the current phase:

- ESP32 firmware
- MQ-2 hardware communication
- FastAPI
- PostgreSQL
- SQLAlchemy
- MQTT
- real HTTP API integration
- real SSE/WebSocket connection
- authentication backend
- cloud infrastructure
- production notification service
- machine learning
- AI functionality

If implementation work appears to require any of these systems, create a clean abstraction/mock boundary instead.

Do not implement the missing system.

## 3. Technology Lock

Frontend:

```text
React
TypeScript
Vite
React Router
TanStack Query
Tailwind CSS
Lucide React
Apache ECharts
```

Do not replace React with Vue.

Do not replace Vite with Next.js.

Do not introduce another frontend framework.

Additional dependencies require a concrete technical justification.

Avoid dependency proliferation.

## 4. Architecture Lock

The frontend must use a feature-oriented architecture.

The following conceptual separation must remain:

```text
UI
 ↓
Feature Components
 ↓
Hooks / State
 ↓
Data Access
 ↓
Mock Data
```

Future architecture:

```text
UI
 ↓
Feature Components
 ↓
Hooks
 ↓
Data Access
 ↓
API / Realtime
 ↓
FastAPI
```

UI components must not directly own mock datasets.

UI components must not directly perform future API calls.

Business/data transformation logic must not be scattered throughout JSX.

## 5. Data Lock

The current data source is mock data.

Mock data must be deterministic and realistic.

At minimum, the frontend must model:

```text
Device
Telemetry
Alarm Event
Gas Status
Settings
```

The initial mock environment contains:

```text
GAS-001
```

The architecture must nevertheless support multiple devices.

## 6. Sensor Semantics Lock

The MQ-2 value currently represents a raw sensor value.

Do not label raw values as calibrated ppm.

Valid:

```text
428 ADC
MQ-2 raw value
Sensor value
```

Invalid without a calibration model:

```text
428 ppm
```

The frontend must not invent calibration formulas.

## 7. Safety Semantics Lock

The web dashboard is a secondary monitoring interface.

The local ESP32 alarm mechanism is conceptually independent.

The dashboard must never imply:

> Dashboard online = system safe.

The following states must remain semantically distinct:

```text
NORMAL
WARNING
DANGER
OFFLINE
```

OFFLINE means that the dashboard does not have recent device data.

OFFLINE must not be interpreted as NORMAL.

## 8. Visual Design Lock

The UI must follow the established GasMonitor visual direction:

```text
Modern
Industrial
Technical
Elegant
Calm
Precise
Professional
```

Primary visual characteristics:

- neutral light background
- white surfaces
- dark professional sidebar
- restrained semantic colors
- subtle borders
- minimal shadows
- moderate corner radius
- clear typography
- strong information hierarchy
- clean telemetry charts

## 9. Anti-AI-Slop Lock

The following visual patterns are explicitly prohibited unless a future design decision overrides this document:

- excessive gradients
- purple AI-style gradients
- neon interfaces
- glassmorphism
- excessive blur
- glowing borders
- animated backgrounds
- floating 3D objects
- decorative particles
- excessive pill-shaped UI
- excessive rounded cards
- oversized headings
- excessive shadows
- decorative illustrations
- futuristic display fonts
- visual effects without functional purpose

The interface must look like professional monitoring software.

## 10. Page Lock

The initial application must contain:

```text
/dashboard
/devices
/devices/:deviceId
/telemetry
/alarms
/settings
/about
```

Do not create additional major application areas without a documented product requirement.

## 11. Component Principles

Prefer reusable components such as:

```text
MetricCard
StatusBadge
StatusIndicator
TelemetryChart
EventTable
DeviceStatus
SectionHeader
LoadingState
EmptyState
ErrorState
```

Do not create abstractions merely for abstraction's sake.

Do not duplicate equivalent UI logic across pages.

## 12. State Handling Lock

Data-driven interfaces should account for:

```text
Loading
Success
Empty
Error
Offline
```

Do not silently display stale or missing data as NORMAL.

## 13. Responsive Design Lock

Desktop is the primary target.

Tablet and mobile layouts must remain usable.

Responsive design should adapt layout rather than merely shrinking desktop components.

## 14. Code Quality Lock

The implementation must:

- use TypeScript strict mode
- avoid unnecessary `any`
- use meaningful names
- keep components focused
- avoid duplicated logic
- avoid hard-coded datasets inside components
- avoid unnecessary global state
- avoid giant components
- avoid unnecessary abstractions
- keep feature boundaries clear

## 15. Change Management

Before introducing a major architectural change, determine:

1. Does the change satisfy the PRD?
2. Does it conflict with this project lock?
3. Does it introduce unnecessary complexity?
4. Does it require a new dependency?
5. Does it solve a real requirement?
6. Can the existing architecture solve the problem more simply?

If the answer indicates that the change is unnecessary, do not implement it.

## 16. Dependency Rule

A new dependency must not be added merely because it is popular or convenient.

Before adding a dependency, evaluate:

- necessity
- maintenance burden
- bundle impact
- overlap with existing dependencies
- architectural impact

Prefer existing project capabilities.

## 17. Backend Boundary Lock

The future backend is expected to be:

```text
FastAPI
Pydantic
SQLAlchemy
PostgreSQL
```

The current frontend must not implement the backend.

The frontend should only define the boundary necessary for future integration.

## 18. Future Communication Direction

The intended future architecture is:

```text
ESP32
  ↓
HTTP/JSON
  ↓
FastAPI
  ↓
PostgreSQL

FastAPI
  ↓
REST/JSON
  ↓
React

FastAPI
  ↓
SSE
  ↓
React
```

This is architectural direction, not current implementation scope.

## 19. Implementation Priority

When choosing between two valid implementation approaches, prioritize:

1. correctness
2. maintainability
3. clarity
4. consistency
5. extensibility
6. performance
7. visual polish

Do not sacrifice architecture for visual effects.

## 20. Final Rule

The project should remain small, coherent, and intentional.

Do not turn GasMonitor into:

- an AI application
- an analytics platform
- a generic SaaS admin panel
- a full IoT cloud platform
- a microservices architecture
- a machine-learning platform

unless the project scope is explicitly revised.

The current goal is:

> Build a polished, modern, modular frontend for monitoring an ESP32-based MQ-2 gas detection system using realistic local mock data.

That is the project.