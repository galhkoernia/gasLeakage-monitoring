import { ArrowRight, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, SectionHeader } from "../../../components/ui/Card";
import { StatusIndicator } from "../../../components/ui/StatusBadge";
import { StateBoundary } from "../../../components/ui/States";
import { fmtDuration, fmtNumber } from "../../../utils/format";
import { useClock } from "../../../utils/useClock";
import { useDevice } from "../hooks/useDevices";

export function DeviceInfoCard({
  deviceId,
  className = "",
  showLink = true,
}: {
  deviceId: string;
  className?: string;
  showLink?: boolean;
}) {
  const q = useDevice(deviceId);
  const now = useClock();
  const d = q.data;
  const rows: Array<[string, React.ReactNode]> = d
    ? [
        ["Connection", <Presence ok={d.online} on="Online" off="Offline" />],
        [
          "Wi-Fi",
          d.wifiConnected === undefined ? "Unavailable" : (
            <Presence
              ok={d.wifiConnected}
              on={`Connected${d.rssi === undefined ? "" : ` (${d.rssi} dBm)`}`}
              off="Disconnected"
            />
          ),
        ],
        ["Uptime", d.online && d.bootedAt ? fmtDuration(now - d.bootedAt) : "—"],
        ["Sampling Interval", d.samplingMs === undefined ? "Unavailable" : `${fmtNumber(d.samplingMs)} ms`],
      ]
    : [];
  return (
    <Card className={className}>
      <SectionHeader
        title="Device Information"
        action={
          showLink && (
            <Link
              to={`/devices/${deviceId}`}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
            >
              Details <ArrowRight className="size-4" aria-hidden />
            </Link>
          )
        }
      />
      <StateBoundary
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={!d}
        emptyMessage="Device not found."
        onRetry={() => void q.refetch()}
      >
        {d && (
          <>
            <div className="mb-3 flex items-center gap-3">
              <Cpu className="size-9 text-slate-500" aria-hidden />
              <div>
                <p className="text-lg font-semibold">{d.id}</p>
                <p className="text-slate-500">{d.name}</p>
              </div>
            </div>
            <dl className="divide-y divide-slate-100 border-t border-slate-200">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-slate-600">{k}</dt>
                  <dd className="font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </StateBoundary>
    </Card>
  );
}

function Presence({ ok, on, off }: { ok: boolean; on: string; off: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${ok ? "text-green-700" : "text-slate-600"}`}
    >
      <StatusIndicator status={ok ? "NORMAL" : "OFFLINE"} /> {ok ? on : off}
    </span>
  );
}
