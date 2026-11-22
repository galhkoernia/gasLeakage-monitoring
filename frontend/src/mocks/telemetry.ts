import type { Device, RangeKey, TelemetryPoint } from "../types";
import { RANGES } from "../utils/constants";

/** Reference time for the mock event timeline (module load). */
export const APP_START = Date.now();

const bump = (x: number, center: number, width: number, height: number) =>
  height * Math.exp(-(((x - center) / width) ** 2));

/** Deterministic MQ-2 raw value; `agoMin` is minutes before the anchor. */
export function valueAt(agoMin: number, absMs: number): number {
  const base =
    430 +
    22 * Math.sin(absMs / 97_000) +
    12 * Math.sin(absMs / 23_000) +
    6 * Math.sin(absMs / 5_100);
  const events =
    bump(agoMin, 24, 9, 450) +
    bump(agoMin, 150, 14, 900) +
    bump(agoMin, 400, 20, 500) +
    bump(agoMin, 900, 30, 300);
  return Math.round(base + events);
}

export function buildTelemetry(
  device: Device,
  range: RangeKey,
  now = Date.now(),
): TelemetryPoint[] {
  const { ms, stepMs } = RANGES[range];
  const end = device.online ? now : device.lastSeenAt ?? now;
  const anchor = device.online ? APP_START : device.lastSeenAt ?? now;
  const points: TelemetryPoint[] = [];
  for (let t = end - ms; t <= end; t += stepMs) {
    points.push({ t, value: valueAt((anchor - t) / 60_000, t) });
  }
  return points;
}
