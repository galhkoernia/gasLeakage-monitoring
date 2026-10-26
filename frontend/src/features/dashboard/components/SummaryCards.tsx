import {
  ArrowDown,
  ArrowUp,
  Bell,
  Cpu,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { MetricCard } from "../../../components/ui/Card";
import { StatusIndicator } from "../../../components/ui/StatusBadge";
import { StateBoundary } from "../../../components/ui/States";
import { fmtAgo, fmtNumber } from "../../../utils/format";
import { STATUS_META } from "../../../utils/status";
import { useClock } from "../../../utils/useClock";
import { useGasStatus } from "../../telemetry/hooks/useTelemetry";

type Props = { deviceId: string };

export function GasStatusCard({ deviceId }: Props) {
  const g = useGasStatus(deviceId);
  const now = useClock();
  const r = g.reading;
  const m = r && STATUS_META[r.status];
  return (
    <MetricCard title="Gas Status" icon={<ShieldCheck className="size-5" />}>
      <StateBoundary
        isLoading={g.isLoading}
        isError={g.isError}
        isEmpty={!r}
        onRetry={g.refetch}
      >
        {r && m && (
          <>
            <p
              className={`flex items-center gap-2 text-3xl font-bold ${m.text}`}
            >
              <StatusIndicator status={r.status} className="size-3" />{" "}
              {r.status}
            </p>
            <p className="mt-2 text-slate-600">{m.description}</p>
            <p className="text-xs text-slate-500">
              {r.status === "OFFLINE"
                ? `Last seen ${fmtAgo(now - (g.device?.lastSeenAt ?? now))}`
                : `Updated ${fmtAgo(now - r.updatedAt)}`}
            </p>
          </>
        )}
      </StateBoundary>
    </MetricCard>
  );
}

export function GasLevelCard({ deviceId }: Props) {
  const g = useGasStatus(deviceId);
  const r = g.reading;
  const down = (r?.deltaPct ?? 0) < 0;
  return (
    <MetricCard title="Gas Level (MQ-2)" icon={<Gauge className="size-5" />}>
      <StateBoundary
        isLoading={g.isLoading}
        isError={g.isError}
        isEmpty={!r}
        onRetry={g.refetch}
      >
        {r && (
          <>
            <p className="text-4xl font-bold tabular-nums">
              {r.status === "OFFLINE" ? "—" : fmtNumber(r.value)}{" "}
              <span className="text-base font-normal text-slate-500">ADC</span>
            </p>
            <p
              className={`mt-2 inline-flex items-center gap-1 text-sm ${down ? "text-green-700" : "text-amber-700"}`}
            >
              {down ? (
                <ArrowDown className="size-4" aria-hidden />
              ) : (
                <ArrowUp className="size-4" aria-hidden />
              )}
              {r.deltaPct.toFixed(1)}%{" "}
              <span className="text-slate-500">(5 min)</span>
            </p>
          </>
        )}
      </StateBoundary>
    </MetricCard>
  );
}

export function DeviceStatusCard({ deviceId }: Props) {
  const g = useGasStatus(deviceId);
  const now = useClock();
  const d = g.device;
  const online = !!d?.online;
  return (
    <MetricCard title="Device Status" icon={<Cpu className="size-5" />}>
      <StateBoundary
        isLoading={g.isLoading}
        isError={g.isError}
        isEmpty={!d}
        onRetry={g.refetch}
      >
        {d && (
          <>
            <p
              className={`flex items-center gap-2 text-lg font-semibold ${online ? "text-green-700" : "text-slate-600"}`}
            >
              <StatusIndicator status={online ? "NORMAL" : "OFFLINE"} />{" "}
              {online ? "Online" : "Offline"}
            </p>
            <p className="mt-2 font-medium">{d.id}</p>
            <p className="text-sm text-slate-500">
              Last seen {fmtAgo(now - d.lastSeenAt)}
            </p>
          </>
        )}
      </StateBoundary>
    </MetricCard>
  );
}

export function ActiveAlarmCard({ deviceId }: Props) {
  const g = useGasStatus(deviceId);
  const s = g.reading?.status;
  const active = s === "WARNING" || s === "DANGER" ? 1 : 0;
  return (
    <MetricCard title="Active Alarm" icon={<Bell className="size-5" />}>
      <StateBoundary
        isLoading={g.isLoading}
        isError={g.isError}
        onRetry={g.refetch}
      >
        <p
          className={`text-4xl font-bold tabular-nums ${s === "DANGER" ? "text-red-700" : s === "WARNING" ? "text-amber-700" : ""}`}
        >
          {active}
        </p>
        <p className="mt-2 text-slate-600">
          {active
            ? `${STATUS_META[s as "WARNING" | "DANGER"].label}: ${STATUS_META[s as "WARNING" | "DANGER"].description.toLowerCase()}`
            : "No active alarm"}
        </p>
      </StateBoundary>
    </MetricCard>
  );
}
