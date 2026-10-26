import { useState } from "react";
import { Card, PageHeader } from "../components/ui/Card";
import { StateBoundary } from "../components/ui/States";
import { RangeSelector, TelemetryChart } from "../components/ui/TelemetryChart";
import { useDevices } from "../features/devices/hooks/useDevices";
import { useTelemetry } from "../features/telemetry/hooks/useTelemetry";
import { useSettings } from "../lib/settings";
import type { RangeKey } from "../types";
import { DEFAULT_DEVICE_ID } from "../utils/constants";
import { fmtNumber, fmtTime } from "../utils/format";
import { resolveStatus } from "../utils/status";
import { StatusBadge } from "../components/ui/StatusBadge";

export function TelemetryPage() {
  const [deviceId, setDeviceId] = useState(DEFAULT_DEVICE_ID);
  const [range, setRange] = useState<RangeKey>("1h");
  const { settings } = useSettings();
  const devices = useDevices();
  const q = useTelemetry(deviceId, range);
  const pts = q.data ?? [];
  const vals = pts.map((p) => p.value);
  const online = devices.data?.find((d) => d.id === deviceId)?.online ?? false;
  const stats = vals.length
    ? ([
        ["Current", vals[vals.length - 1]],
        ["Minimum", Math.min(...vals)],
        ["Maximum", Math.max(...vals)],
        ["Average", Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)],
      ] as const)
    : [];
  return (
    <>
      <PageHeader
        title="Telemetry"
        subtitle="MQ-2 raw sensor readings (ADC)"
        right={
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Device
              <select
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5"
              >
                {(devices.data ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id}
                  </option>
                ))}
              </select>
            </label>
            <RangeSelector value={range} onChange={setRange} />
          </div>
        }
      />
      <StateBoundary
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={!pts.length}
        onRetry={() => void q.refetch()}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([k, v]) => (
            <Card key={k}>
              <p className="text-slate-500">{k}</p>
              <p className="text-3xl font-bold tabular-nums">
                {fmtNumber(v)}{" "}
                <span className="text-base font-normal text-slate-500">
                  ADC
                </span>
              </p>
            </Card>
          ))}
        </div>
        <Card className="mt-4">
          <TelemetryChart
            points={pts}
            warning={settings.warning}
            danger={settings.danger}
            height={380}
          />
        </Card>
        <Card className="mt-4">
          <h2 className="mb-3 text-lg font-semibold">Recent Readings</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs text-slate-500">
                <tr>
                  <th className="py-2 font-medium">Time</th>
                  <th className="py-2 text-right font-medium">Gas Level</th>
                  <th className="py-2 pl-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pts
                  .slice(-10)
                  .reverse()
                  .map((p) => (
                    <tr key={p.t}>
                      <td className="py-2 tabular-nums">{fmtTime(p.t)}</td>
                      <td className="py-2 text-right tabular-nums">
                        {fmtNumber(p.value)}
                      </td>
                      <td className="py-2 pl-6">
                        <StatusBadge
                          status={resolveStatus(p.value, settings, online)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </StateBoundary>
    </>
  );
}
