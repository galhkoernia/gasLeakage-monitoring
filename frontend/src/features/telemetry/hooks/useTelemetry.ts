import { useQuery } from "@tanstack/react-query";
import { fetchTelemetry } from "../../../lib/api";
import type { GasReading, RangeKey } from "../../../types";
import { REFETCH_MS } from "../../../utils/constants";
import { resolveStatus } from "../../../utils/status";
import { useSettings } from "../../../lib/settings";
import { useDevice } from "../../devices/hooks/useDevices";

export const useTelemetry = (deviceId: string, range: RangeKey) =>
  useQuery({
    queryKey: ["telemetry", deviceId, range],
    queryFn: () => fetchTelemetry(deviceId, range),
    refetchInterval: REFETCH_MS,
  });

/** Latest reading, status and 5-minute change for one device. */
export function useGasStatus(deviceId: string) {
  const { settings } = useSettings();
  const device = useDevice(deviceId);
  const telemetry = useTelemetry(deviceId, "5m");
  const points = telemetry.data ?? [];
  const online = device.data?.online ?? false;

  let reading: GasReading | undefined;
  if (points.length && device.data) {
    const first = points[0].value;
    const last = points[points.length - 1];
    reading = {
      value: last.value,
      status:
        last.gasStatus === 1
          ? "DANGER"
          : last.gasStatus === 0
            ? "NORMAL"
            : resolveStatus(last.value, settings, online),
      deltaPct: first ? ((last.value - first) / first) * 100 : 0,
      updatedAt: telemetry.dataUpdatedAt,
    };
  }
  return {
    reading,
    device: device.data,
    isLoading: device.isLoading || telemetry.isLoading,
    isError: device.isError || telemetry.isError,
    refetch: () => {
      void device.refetch();
      void telemetry.refetch();
    },
  };
}
