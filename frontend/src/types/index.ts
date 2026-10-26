export type GasStatus = "NORMAL" | "WARNING" | "DANGER" | "OFFLINE";
export type RangeKey = "5m" | "15m" | "1h" | "6h" | "24h";

export interface Device {
  id: string;
  name: string;
  sensor: string;
  online: boolean;
  wifiConnected: boolean;
  rssi: number;
  bootedAt: number;
  lastSeenAt: number;
  samplingMs: number;
}
export interface TelemetryPoint {
  t: number;
  value: number;
}
export interface AlarmEvent {
  id: string;
  time: number;
  deviceId: string;
  event: string;
  value: number;
  status: GasStatus;
}
export interface Settings {
  warning: number;
  danger: number;
  samplingMs: number;
  deviceId: string;
}
export interface GasReading {
  status: GasStatus;
  value: number;
  deltaPct: number;
  updatedAt: number;
}
