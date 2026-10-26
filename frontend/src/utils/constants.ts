import type { RangeKey, Settings } from "../types";

export const APP_VERSION = "v1.0.0";
export const DEFAULT_DEVICE_ID = "GAS-001";
export const DEFAULT_SETTINGS: Settings = {
  warning: 800,
  danger: 1200,
  samplingMs: 1000,
  deviceId: DEFAULT_DEVICE_ID,
};
export const REFETCH_MS = 2000;

const MIN = 60_000;
export const RANGES: Record<RangeKey, { ms: number; stepMs: number }> = {
  "5m": { ms: 5 * MIN, stepMs: 5_000 },
  "15m": { ms: 15 * MIN, stepMs: 15_000 },
  "1h": { ms: 60 * MIN, stepMs: 60_000 },
  "6h": { ms: 360 * MIN, stepMs: 5 * MIN },
  "24h": { ms: 1440 * MIN, stepMs: 15 * MIN },
};
export const RANGE_KEYS = Object.keys(RANGES) as RangeKey[];
