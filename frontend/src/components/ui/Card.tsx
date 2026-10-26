import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-[28px] font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function MetricCard({
  title,
  icon,
  children,
}: {
  title: ReactNode;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className="text-slate-500" aria-hidden>
          {icon}
        </span>
        {title}
      </div>
      {children}
    </Card>
  );
}
