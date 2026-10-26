import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export const LoadingState = ({ label = "Loading…" }: { label?: string }) => (
  <div
    role="status"
    className="flex items-center justify-center gap-2 py-8 text-slate-500"
  >
    <Loader2 className="size-4 animate-spin" aria-hidden /> {label}
  </div>
);

export const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-2 py-8 text-center text-slate-600"
  >
    <AlertCircle className="size-5 text-red-600" aria-hidden />
    <p>Data could not be loaded.</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
      >
        Retry
      </button>
    )}
  </div>
);

export const EmptyState = ({
  message = "No data available.",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center gap-2 py-8 text-center text-slate-500">
    <Inbox className="size-5" aria-hidden />
    <p>{message}</p>
  </div>
);

interface BoundaryProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
}
export function StateBoundary({
  isLoading,
  isError,
  isEmpty,
  emptyMessage,
  onRetry,
  children,
}: BoundaryProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (isEmpty) return <EmptyState message={emptyMessage} />;
  return <>{children}</>;
}
