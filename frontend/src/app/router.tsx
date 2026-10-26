import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AboutPage } from '../pages/AboutPage';
import { AlarmsPage } from '../pages/AlarmsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DeviceDetailPage } from '../pages/DeviceDetailPage';
import { DevicesPage } from '../pages/DevicesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TelemetryPage } from '../pages/TelemetryPage';

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'devices', element: <DevicesPage /> },
      { path: 'devices/:deviceId', element: <DeviceDetailPage /> },
      { path: 'telemetry', element: <TelemetryPage /> },
      { path: 'alarms', element: <AlarmsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
