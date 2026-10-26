import { useQuery } from "@tanstack/react-query";
import { fetchDevice, fetchDevices } from "../../../lib/api";
import { REFETCH_MS } from "../../../utils/constants";

export const useDevices = () =>
  useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
    refetchInterval: REFETCH_MS,
  });
export const useDevice = (id: string) =>
  useQuery({
    queryKey: ["device", id],
    queryFn: () => fetchDevice(id),
    refetchInterval: REFETCH_MS,
  });
