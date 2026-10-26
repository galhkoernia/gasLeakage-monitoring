import type { GasStatus } from "../../types";
import { STATUS_META } from "../../utils/status";

export function StatusIndicator({
  status,
  className = "",
}: {
  status: GasStatus;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block size-2 shrink-0 rounded-full ${STATUS_META[status].dot} ${className}`}
    />
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: GasStatus;
  label?: string;
}) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}
    >
      <StatusIndicator status={status} />
      {label ?? m.label}
    </span>
  );
}
