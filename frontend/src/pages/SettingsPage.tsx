import { useState, type ReactNode } from "react";
import { Card, PageHeader } from "../components/ui/Card";
import { useSettings } from "../lib/settings";

const inputCls =
  "w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100 disabled:text-slate-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block py-3">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      )}
    </label>
  );
}

export function SettingsPage() {
  const { settings, save, reset } = useSettings();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);
  const invalid = draft.warning >= draft.danger || draft.samplingMs < 100;
  const num = (k: "warning" | "danger" | "samplingMs") => ({
    type: "number" as const,
    value: draft[k],
    className: inputCls,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSaved(false);
      setDraft({ ...draft, [k]: Number(e.target.value) });
    },
  });
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Detection, telemetry and device configuration"
      />
      <form
        className="max-w-2xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!invalid) {
            save(draft);
            setSaved(true);
          }
        }}
      >
        <Card>
          <h2 className="text-lg font-semibold">Detection</h2>
          <Field label="Warning Threshold (ADC)">
            <input {...num("warning")} />
          </Field>
          <Field
            label="Danger Threshold (ADC)"
            hint="Must be higher than the warning threshold."
          >
            <input {...num("danger")} />
          </Field>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Telemetry</h2>
          <Field label="Sampling Interval (ms)" hint="Minimum 100 ms.">
            <input {...num("samplingMs")} />
          </Field>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Device</h2>
          <Field label="Device ID">
            <input
              className={inputCls}
              value={draft.deviceId}
              disabled
              readOnly
            />
          </Field>
        </Card>
        {invalid && (
          <p role="alert" className="text-sm text-red-700">
            Check values: warning must be lower than danger, and sampling at
            least 100 ms.
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={invalid}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setDraft({
                ...settings,
                warning: 800,
                danger: 1200,
                samplingMs: 1000,
              });
              setSaved(false);
            }}
            className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Reset to defaults
          </button>
          {saved && (
            <span role="status" className="text-sm text-green-700">
              Settings saved locally.
            </span>
          )}
        </div>
      </form>
    </>
  );
}
