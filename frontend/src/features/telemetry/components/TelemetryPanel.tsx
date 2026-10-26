import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { StateBoundary } from "../../../components/ui/States";
import {
  RangeSelector,
  TelemetryChart,
} from "../../../components/ui/TelemetryChart";
import { useSettings } from "../../../lib/settings";
import type { RangeKey } from "../../../types";
import { useTelemetry } from "../hooks/useTelemetry";

export function TelemetryPanel({ deviceId }: { deviceId: string }) {
  const [range, setRange] = useState<RangeKey>("1h");
  const { settings } = useSettings();
  const q = useTelemetry(deviceId, range);
  return (
    <Card>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Gas Sensor Telemetry</h2>
        <RangeSelector value={range} onChange={setRange} />
      </div>
      <StateBoundary
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={!q.data?.length}
        onRetry={() => void q.refetch()}
      >
        <TelemetryChart
          points={q.data ?? []}
          warning={settings.warning}
          danger={settings.danger}
        />
      </StateBoundary>
    </Card>
  );
}
