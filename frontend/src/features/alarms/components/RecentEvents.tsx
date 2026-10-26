import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, SectionHeader } from "../../../components/ui/Card";
import { EventTable } from "../../../components/ui/EventTable";
import { StateBoundary } from "../../../components/ui/States";
import { useAlarmEvents } from "../hooks/useAlarmEvents";

export function RecentEvents({
  deviceId,
  limit = 5,
  className = "",
}: {
  deviceId: string;
  limit?: number;
  className?: string;
}) {
  const q = useAlarmEvents(deviceId);
  return (
    <Card className={className}>
      <SectionHeader
        title="Recent Events"
        action={
          <Link
            to="/alarms"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
          >
            View All <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <StateBoundary
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={!q.data?.length}
        emptyMessage="No events recorded."
        onRetry={() => void q.refetch()}
      >
        <EventTable events={(q.data ?? []).slice(0, limit)} />
      </StateBoundary>
    </Card>
  );
}
