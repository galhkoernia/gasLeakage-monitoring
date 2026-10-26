import type { GasStatus, Settings } from "../types";

export const STATUS_META: Record<
  GasStatus,
  { label: string; text: string; bg: string; dot: string; description: string }
> = {
  NORMAL: {
    label: "Normal",
    text: "text-green-700",
    bg: "bg-green-50",
    dot: "bg-green-600",
    description: "No abnormal gas detected",
  },
  WARNING: {
    label: "Warning",
    text: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    description: "Gas level above warning threshold",
  },
  DANGER: {
    label: "Danger",
    text: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-600",
    description: "Gas level above danger threshold",
  },
  OFFLINE: {
    label: "Offline",
    text: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
    description: "Device is not reporting",
  },
};

export function resolveStatus(
  value: number,
  s: Pick<Settings, "warning" | "danger">,
  online = true,
): GasStatus {
  
  // Perangkat yang sedang luring (offline) tidak memiliki pembacaan saat ini, terlepas dari nilai terakhirnya.
  if (!online) return "OFFLINE";
  if (value >= s.danger) return "DANGER";
  if (value >= s.warning) return "WARNING";
  return "NORMAL";
}
