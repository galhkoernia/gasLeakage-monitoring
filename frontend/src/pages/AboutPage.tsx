import { Card, PageHeader } from "../components/ui/Card";
import { APP_VERSION } from "../utils/constants";

export const AboutPage = () => (
  <>
    <PageHeader title="About" subtitle={`GasMonitor ${APP_VERSION}`} />
    <Card className="max-w-2xl space-y-3 leading-relaxed">
      <p>ESP32-based gas leakage detection and monitoring interface.</p>
      <p className="text-slate-600">
        The system is designed to monitor MQ-2 sensor readings, device
        connectivity, telemetry history, and alarm events. Values are shown as
        raw ADC readings, not calibrated ppm.
      </p>
      <p className="text-sm text-slate-500">
        This build runs on local mock data. The data layer in{" "}
        <code>src/lib/api</code> is the only part to replace when a backend is
        connected.
      </p>
    </Card>
  </>
);
