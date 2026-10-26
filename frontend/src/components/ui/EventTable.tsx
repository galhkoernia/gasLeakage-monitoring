import type { AlarmEvent } from "../../types";
import { fmtNumber, fmtTime } from "../../utils/format";
import { StatusBadge } from "./StatusBadge";

export function EventTable({
  events,
  showDevice = false,
}: {
  events: AlarmEvent[];
  showDevice?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-medium text-slate-500">
          <tr>
            <th className="py-2 pr-3 font-medium">Time</th>
            {showDevice && <th className="py-2 pr-3 font-medium">Device</th>}
            <th className="py-2 pr-3 font-medium">Event</th>
            <th className="py-2 pr-3 text-right font-medium">Gas Level</th>
            <th className="py-2 pl-6 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((e) => (
            <tr key={e.id}>
              <td className="py-2.5 pr-3 tabular-nums">{fmtTime(e.time)}</td>
              {showDevice && <td className="py-2.5 pr-3">{e.deviceId}</td>}
              <td className="py-2.5 pr-3">{e.event}</td>
              <td className="py-2.5 pr-3 text-right tabular-nums">
                {fmtNumber(e.value)}
              </td>
              <td className="py-2.5 pl-6">
                <StatusBadge status={e.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
