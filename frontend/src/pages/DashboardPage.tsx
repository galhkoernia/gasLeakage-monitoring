import { Clock } from "lucide-react";
import { PageHeader } from "../components/ui/Card";
import { StatusIndicator } from "../components/ui/StatusBadge";
import { RecentEvents } from "../features/alarms/components/RecentEvents";
import {
  ActiveAlarmCard,
  DeviceStatusCard,
  GasLevelCard,
  GasStatusCard,
} from "../features/dashboard/components/SummaryCards";
import { DeviceInfoCard } from "../features/devices/components/DeviceInfoCard";
import { useDevices } from "../features/devices/hooks/useDevices";
import { TelemetryPanel } from "../features/telemetry/components/TelemetryPanel";
import { DEFAULT_DEVICE_ID } from "../utils/constants";
import { fmtDateTime } from "../utils/format";
import { useClock } from "../utils/useClock";

export function DashboardPage() {
  const now = useClock();
  const online = useDevices().data?.some((d) => d.online) ?? false;
  const id = DEFAULT_DEVICE_ID;
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of gas detection system"
        right={
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-600">
              <Clock className="size-4" aria-hidden /> {fmtDateTime(now)}
            </span>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-medium ${online ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}
            >
              <StatusIndicator status={online ? "NORMAL" : "OFFLINE"} /> System{" "}
              {online ? "Online" : "Offline"}
            </span>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GasStatusCard deviceId={id} />
        <GasLevelCard deviceId={id} />
        <DeviceStatusCard deviceId={id} />
        <ActiveAlarmCard deviceId={id} />
      </div>
      <div className="mt-4">
        <TelemetryPanel deviceId={id} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <RecentEvents deviceId={id} className="lg:col-span-3" />
        <DeviceInfoCard deviceId={id} className="lg:col-span-2" />
      </div>
    </>
  );
}
