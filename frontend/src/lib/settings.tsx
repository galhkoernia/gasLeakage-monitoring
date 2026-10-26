import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Settings } from "../types";
import { mockSettings } from "../mocks/settings";

const KEY = "gasmonitor.settings";
const load = (): Settings => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw
      ? { ...mockSettings, ...(JSON.parse(raw) as Partial<Settings>) }
      : mockSettings;
  } catch {
    return mockSettings;
  }
};

interface Ctx {
  settings: Settings;
  save: (s: Settings) => void;
  reset: () => void;
}
const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);
  const save = useCallback((s: Settings) => {
    setSettings(s);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* storage unavailable */
    }
  }, []);
  const reset = useCallback(() => save(mockSettings), [save]);
  const value = useMemo(
    () => ({ settings, save, reset }),
    [settings, save, reset],
  );
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
