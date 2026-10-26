import { Card, PageHeader } from "../components/ui/Card";
import { EventTable } from "../components/ui/EventTable";
import { StateBoundary } from "../components/ui/States";
import { useAlarmEvents } from "../features/alarms/hooks/useAlarmEvents";
import { useGasStatus } from "../features/telemetry/hooks/useTelemetry";
import { DEFAULT_DEVICE_ID } from "../utils/constants";
import { fmtTime } from "../utils/format";

export function AlarmsPage() {
  const q = useAlarmEvents();
  const gas = useGasStatus(DEFAULT_DEVICE_ID);
  const events = q.data ?? [];
  const alarms = events.filter(
    (e) => e.status === "WARNING" || e.status === "DANGER",
  );
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const today = alarms.filter((e) => e.time >= startOfDay).length;
  const s = gas.reading?.status;
  const summary = [
    ["Active", s === "WARNING" || s === "DANGER" ? "1" : "0"],
    ["Today", String(today)],
    ["Last Alarm", alarms[0] ? fmtTime(alarms[0].time) : "—"],
  ];
  return (
    <>
      <PageHeader title="Alarms" subtitle="Alarm and event history" />
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map(([k, v]) => (
          <Card key={k}>
            <p className="text-slate-500">{k}</p>
            <p className="text-3xl font-bold tabular-nums">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <StateBoundary
          isLoading={q.isLoading}
          isError={q.isError}
          isEmpty={!events.length}
          emptyMessage="No events recorded."
          onRetry={() => void q.refetch()}
        >
          <EventTable events={events} showDevice />
        </StateBoundary>
      </Card>
    </>
  );
}
