import type { AlarmEvent, Device, RangeKey, TelemetryPoint } from "../../types";
import { mockAlarmEvents } from "../../mocks/alarms";
import { mockDevices } from "../../mocks/devices";
import { buildTelemetry } from "../../mocks/telemetry";

// Jaga agar batasan data UI tetap stabil selama fungsi masih menggunakan data tiruan (mock data).
const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const fresh = (d: Device): Device =>
  d.online ? { ...d, lastSeenAt: Date.now() - 2000 } : d;

/** GET /api/v1/devices */
export async function fetchDevices(): Promise<Device[]> {
  await delay();
  return mockDevices.map(fresh);
}
/** GET /api/v1/devices/{deviceId} */
export async function fetchDevice(id: string): Promise<Device | null> {
  await delay();
  const d = mockDevices.find((x) => x.id === id);
  return d ? fresh(d) : null;
}
/** GET /api/v1/devices/{deviceId}/telemetry */
export async function fetchTelemetry(
  id: string,
  range: RangeKey,
): Promise<TelemetryPoint[]> {
  await delay();
  const d = mockDevices.find((x) => x.id === id);
  return d ? buildTelemetry(d, range) : [];
}
/** GET /api/v1/alarms */
export async function fetchAlarms(deviceId?: string): Promise<AlarmEvent[]> {
  await delay();
  return mockAlarmEvents.filter((e) => !deviceId || e.deviceId === deviceId);
}
