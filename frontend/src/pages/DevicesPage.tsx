import { Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, PageHeader } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import { StateBoundary } from "../components/ui/States";
import { useDevices } from "../features/devices/hooks/useDevices";
import { fmtAgo } from "../utils/format";
import { useClock } from "../utils/useClock";

export function DevicesPage() {
  const q = useDevices();
  const now = useClock();
  return (
    <>
      <PageHeader
        title="Devices"
        subtitle="Registered gas monitoring devices"
      />
      <StateBoundary
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={!q.data?.length}
        emptyMessage="No devices registered."
        onRetry={() => void q.refetch()}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(q.data ?? []).map((d) => (
            <Card key={d.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Cpu className="size-8 text-slate-500" aria-hidden />
                  <div>
                    <Link
                      to={`/devices/${d.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {d.id}
                    </Link>
                    <p className="text-slate-500">{d.name}</p>
                  </div>
                </div>
                <StatusBadge
                  status={d.online ? "NORMAL" : "OFFLINE"}
                  label={d.online ? "Online" : "Offline"}
                />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-slate-500">Sensor</dt>
                <dd className="text-right font-medium">{d.sensor}</dd>
                <dt className="text-slate-500">Last seen</dt>
                <dd className="text-right font-medium">
                  {fmtAgo(now - d.lastSeenAt)}
                </dd>
              </dl>
            </Card>
          ))}
        </div>
      </StateBoundary>
    </>
  );
}
