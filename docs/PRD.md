# Product Requirements Document — GasMonitor

## 1. Product Definition

GasMonitor is a web-based monitoring interface for an ESP32-based gas leakage detection system.

The system uses an MQ-2 sensor as the primary gas sensing component and provides local alarm mechanisms through hardware indicators such as LED and buzzer.

The web application exists as a **secondary monitoring interface**.

The dashboard must never be treated as the primary safety mechanism.

## 2. Problem

A gas detection device can provide a local alarm, but local indicators provide limited visibility into:

- current sensor state
- telemetry trends
- previous alarm events
- device connectivity
- measurement history
- operational status

GasMonitor addresses this monitoring problem through a dedicated web interface.

## 3. Product Objective

The product should allow an operator to quickly determine:

1. Is the monitoring system online?
2. Is the current gas state normal?
3. What is the current sensor value?
4. Is the sensor value increasing or decreasing?
5. Has an alarm occurred?
6. Which device generated the event?
7. What happened previously?
8. Is the device still communicating?

The primary UX objective is:

> The operator should understand the current system condition within a few seconds of opening the dashboard.

## 4. Primary User

The initial target user is a technical operator, researcher, student, or developer monitoring an ESP32-based gas detection prototype.

The application is not currently designed as a consumer emergency-response application.

## 5. Core Features

### Dashboard

The dashboard must provide:

- current gas status
- current MQ-2 value
- device status
- active alarm count
- telemetry chart
- threshold indicators
- recent events
- device information

### Devices

The device page must provide:

- device list
- device status
- last seen time
- device identification
- basic connectivity information

The architecture must support multiple devices even though the initial implementation contains one mock device.

### Device Detail

A device detail page must provide:

- current state
- current sensor value
- telemetry
- device information
- recent events

### Telemetry

The telemetry page must provide:

- current value
- minimum
- maximum
- average
- historical graph
- time-range selection
- device selection

### Alarms

The alarm page must provide:

- active alarms
- alarm history
- event timestamp
- device
- gas value
- event severity
- recovery events

### Settings

The settings page must provide frontend representations of:

- warning threshold
- danger threshold
- sampling interval
- device identifier

Settings may initially use local state/localStorage.

They must be structured so future backend persistence can be introduced.

## 6. Gas States

The frontend must support four primary states:

```text
NORMAL
WARNING
DANGER
OFFLINE
```

### NORMAL

The sensor value is within the normal operating range.

### WARNING

The sensor value exceeds the configured warning threshold.

### DANGER

The sensor value exceeds the configured danger threshold.

### OFFLINE

No recent telemetry or device communication is available.

OFFLINE must never be interpreted as NORMAL.

## 7. Telemetry

Initial telemetry represents the MQ-2 raw sensor value.

Example:

```text
428 ADC
```

The frontend must not represent this value as ppm unless a future calibration layer explicitly provides a calibrated concentration.

Telemetry must contain timestamps.

The visualization should support:

- 5 minutes
- 15 minutes
- 1 hour
- 6 hours
- 24 hours

## 8. Mock Data

The current implementation must use deterministic mock data.

Mock telemetry should resemble realistic sensor behavior:

- stable baseline
- gradual fluctuations
- increasing trend
- warning event
- danger event
- recovery

Pure uncontrolled random values should not be used.

Mock data must exist outside presentation components.

## 9. Non-Functional Requirements

### Usability

The interface must provide clear information hierarchy and immediate status recognition.

### Maintainability

Frontend features must be modular and independently maintainable.

### Extensibility

The frontend must be capable of replacing mock data with real APIs later.

### Accessibility

The application should use semantic HTML, keyboard-accessible controls, meaningful labels, and sufficient contrast.

### Responsiveness

Desktop is the primary target, but tablet and mobile layouts must remain functional.

## 10. Explicit Non-Goals

The current project does not include:

- gas prediction
- machine learning
- AI
- automated emergency response
- cloud infrastructure
- mobile application
- user authentication
- multi-user authorization
- real hardware integration in frontend
- backend implementation
- database implementation
- MQTT implementation
- production notification infrastructure

These may be considered in future phases but are outside the current product scope.

## 11. Success Criteria

The frontend phase is successful when:

- all defined pages are implemented
- navigation works
- mock telemetry is displayed correctly
- telemetry visualization is readable
- gas states are visually distinct
- device status is visible
- alarm history is accessible
- responsive layouts work
- mock data is isolated
- frontend architecture is ready for future API integration
- no backend or firmware implementation is introduced

## 12. Product Principle

GasMonitor is a monitoring application, not a decorative dashboard.

Every visual element should serve one of three purposes:

1. communicate system state
2. communicate measurement data
3. support an operational action

If a UI element does none of these, it should generally not exist.