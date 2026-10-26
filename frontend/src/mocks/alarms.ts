import type { AlarmEvent } from "../types";
import { DEFAULT_SETTINGS } from "../utils/constants";
import { resolveStatus } from "../utils/status";
import { APP_START, valueAt } from "./telemetry";

const timeline: Array<[agoMin: number, event: string]> = [
  [0.4, "Gas level updated"],
  [17, "Gas level recovered"],
  [27, "Gas level high"],
  [128, "Gas level recovered"],
  [150, "Gas level critical"],
  [160, "Gas level high"],
  [190, "Gas level updated"],
  [400, "Gas level high"],
  [415, "Gas level recovered"],
];

export const mockAlarmEvents: AlarmEvent[] = timeline.map(
  ([agoMin, event], i) => {
    const time = APP_START - agoMin * 60_000;
    const value = valueAt(agoMin, time);
    return {
      id: `evt-${i}`,
      time,
      deviceId: "GAS-001",
      event,
      value,
      status: resolveStatus(value, DEFAULT_SETTINGS),
    };
  },
);
