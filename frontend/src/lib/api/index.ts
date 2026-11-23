import type { AlarmEvent, Device, RangeKey, TelemetryPoint } from "../../types";
import { mockAlarmEvents } from "../../mocks/alarms";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");
const API_PREFIX = "/api/v1";

type ApiDevice = {
  device_id: string;
  name: string;
  status: "online" | "offline";
  last_seen?: string | null;
};
type ApiTelemetry = {
  device_id: string;
  sensor: string;
  value: number;
  gas_status?: 0 | 1 | null;
  timestamp: string;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`);
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function normalizeDevice(device: ApiDevice): Device {
  return {
    id: device.device_id,
    name: device.name,
    sensor: "MQ-2",
    online: device.status === "online",
    wifiConnected: undefined,
    rssi: undefined,
    bootedAt: undefined,
    lastSeenAt: device.last_seen ? Date.parse(device.last_seen) : undefined,
    samplingMs: undefined,
  };
}

function normalizeTelemetry(item: ApiTelemetry): TelemetryPoint {
  return {
    t: Date.parse(item.timestamp),
    value: item.value,
    gasStatus: item.gas_status ?? undefined,
  };
}

/** GET /api/v1/devices */
export async function fetchDevices(): Promise<Device[]> {
  const response = await request<{ data: ApiDevice[] }>("/devices");
  return response.data.map(normalizeDevice);
}

/** GET /api/v1/devices/{deviceId} */
export async function fetchDevice(id: string): Promise<Device | null> {
  const response = await fetch(
    `${API_BASE_URL}${API_PREFIX}/devices/${encodeURIComponent(id)}`,
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  const payload = (await response.json()) as { device: ApiDevice };
  return normalizeDevice(payload.device);
}

/** GET /api/v1/devices/{deviceId}/telemetry. The backend returns newest first. */
export async function fetchTelemetry(
  id: string,
  range: RangeKey,
): Promise<TelemetryPoint[]> {
  const response = await request<{ data: ApiTelemetry[] }>(
    `/devices/${encodeURIComponent(id)}/telemetry?limit=1000`,
  );
  const rangeMs: Record<RangeKey, number> = {
    "5m": 5 * 60_000,
    "15m": 15 * 60_000,
    "1h": 60 * 60_000,
    "6h": 6 * 60 * 60_000,
    "24h": 24 * 60 * 60_000,
  };
  const cutoff = Date.now() - rangeMs[range];
  return response.data
    .map(normalizeTelemetry)
    .filter((point) => point.t >= cutoff)
    .reverse();
}

/** Download the accumulated backend telemetry CSV. */
export function downloadTelemetryCsv(): void {
  window.location.assign(`${API_BASE_URL}${API_PREFIX}/telemetry/export`);
}

/** TODO: replace this temporary mock when the backend alarm endpoint is implemented. */
export async function fetchAlarms(deviceId?: string): Promise<AlarmEvent[]> {
  return mockAlarmEvents.filter((event) => !deviceId || event.deviceId === deviceId);
}
