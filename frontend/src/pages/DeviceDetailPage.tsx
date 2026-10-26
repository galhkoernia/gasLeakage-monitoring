import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card, PageHeader } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import { EmptyState, StateBoundary } from "../components/ui/States";
import { RecentEvents } from "../features/alarms/components/RecentEvents";
import { DeviceInfoCard } from "../features/devices/components/DeviceInfoCard";
import {
  GasLevelCard,
  GasStatusCard,
} from "../features/dashboard/components/SummaryCards";
import { useDevice } from "../features/devices/hooks/useDevices";
import { TelemetryPanel } from "../features/telemetry/components/TelemetryPanel";
import { fmtDuration } from "../utils/format";
import { useClock } from "../utils/useClock";

export function DeviceDetailPage() {
  const { deviceId = "" } = useParams();
  const q = useDevice(deviceId);
  const now = useClock();
  const d = q.data;
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-slate-500">
        <Link
          to="/devices"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <ChevronLeft className="size-4" aria-hidden /> Devices
        </Link>{" "}
        / {deviceId}
      </nav>
      <StateBoundary
        isLoading={q.isLoading}
        isError={q.isError}
        onRetry={() => void q.refetch()}
      >
        {!d ? (
          <EmptyState message={`Device ${deviceId} was not found.`} />
        ) : (
          <>
            <PageHeader
              title={d.id}
              subtitle={d.name}
              right={
                <StatusBadge
                  status={d.online ? "NORMAL" : "OFFLINE"}
                  label={d.online ? "ONLINE" : "OFFLINE"}
                />
              }
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <p className="text-slate-500">Sensor</p>
                <p className="text-lg font-semibold">{d.sensor}</p>
                <p className="text-sm text-slate-500">
                  {d.online ? "Active" : "Inactive"}
                </p>
              </Card>
              <Card>
                <p className="text-slate-500">Wi-Fi</p>
                <p className="text-lg font-semibold">
                  {d.wifiConnected ? "Connected" : "Disconnected"}
                </p>
              </Card>
              <GasStatusCard deviceId={d.id} />
              <GasLevelCard deviceId={d.id} />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Uptime {d.online ? fmtDuration(now - d.bootedAt) : "—"}
            </p>
            <div className="mt-4">
              <TelemetryPanel deviceId={d.id} />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-5">
              <RecentEvents deviceId={d.id} className="lg:col-span-3" />
              <DeviceInfoCard
                deviceId={d.id}
                showLink={false}
                className="lg:col-span-2"
              />
            </div>
          </>
        )}
      </StateBoundary>
    </>
  );
}
