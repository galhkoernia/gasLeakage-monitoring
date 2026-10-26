import { useQuery } from "@tanstack/react-query";
import { fetchAlarms } from "../../../lib/api";

export const useAlarmEvents = (deviceId?: string) =>
  useQuery({
    queryKey: ["alarms", deviceId ?? "all"],
    queryFn: () => fetchAlarms(deviceId),
  });
