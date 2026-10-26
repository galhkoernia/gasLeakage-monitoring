import {
  Cpu,
  Flame,
  Info,
  LineChart,
  Menu,
  Settings,
  Siren,
  LayoutDashboard,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { StatusIndicator } from "../components/ui/StatusBadge";
import { useDevice } from "../features/devices/hooks/useDevices";
import { APP_VERSION, DEFAULT_DEVICE_ID } from "../utils/constants";

const GROUPS: Array<{
  label: string;
  items: Array<{ to: string; label: string; icon: LucideIcon }>;
}> = [
  {
    label: "Monitoring",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/devices", label: "Devices", icon: Cpu },
      { to: "/telemetry", label: "Telemetry", icon: LineChart },
      { to: "/alarms", label: "Alarms", icon: Siren },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/about", label: "About", icon: Info },
    ],
  },
];

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const device = useDevice(DEFAULT_DEVICE_ID).data;
  const online = !!device?.online;
  return (
    <div className="flex h-full flex-col bg-sidebar p-4 text-slate-300">
      <div className="flex items-center gap-3 px-2 py-3">
        <Flame className="size-8 text-red-500" aria-hidden />
        <div>
          <p className="text-lg font-semibold leading-tight text-white">
            GasMonitor
          </p>
          <p className="text-xs text-slate-400">Gas Leakage Monitoring</p>
        </div>
      </div>
      <nav aria-label="Main" className="mt-6 flex-1 space-y-6">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-slate-500">
              {g.label}
            </p>
            <ul className="space-y-1">
              {g.items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? "bg-white/10 text-white" : "hover:bg-white/5"}`
                    }
                  >
                    <Icon className="size-4.5" aria-hidden /> {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
        <div>
          <p className="font-medium text-white">{DEFAULT_DEVICE_ID}</p>
          <p
            className={`flex items-center gap-1.5 text-xs ${online ? "text-green-400" : "text-slate-400"}`}
          >
            <StatusIndicator status={online ? "NORMAL" : "OFFLINE"} />{" "}
            {online ? "Online" : "Offline"}
          </p>
        </div>
        <Wifi
          className={`size-4 ${online ? "text-slate-300" : "text-slate-600"}`}
          aria-hidden
        />
      </div>
      <p className="mt-3 px-1 text-xs text-slate-500">{APP_VERSION}</p>
    </div>
  );
}

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:pl-64">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <span className="font-semibold">GasMonitor</span>
      </div>
      <main className="mx-auto max-w-350 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
