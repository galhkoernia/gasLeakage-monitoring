import type { Device } from "../types";

const LOAD = Date.now();
export const mockDevices: Device[] = [
  {
    id: "GAS-001",
    name: "Laboratory Prototype",
    sensor: "MQ-2",
    online: true,
    wifiConnected: true,
    rssi: -62,
    bootedAt: LOAD - (4 * 3600 + 21 * 60 + 18) * 1000,
    lastSeenAt: LOAD - 2000,
    samplingMs: 1000,
  },
  {
    id: "GAS-002",
    name: "Storage Room Prototype",
    sensor: "MQ-2",
    online: false,
    wifiConnected: false,
    rssi: 0,
    bootedAt: LOAD - 9 * 3600_000,
    lastSeenAt: LOAD - 2 * 3600_000,
    samplingMs: 1000,
  },
];
