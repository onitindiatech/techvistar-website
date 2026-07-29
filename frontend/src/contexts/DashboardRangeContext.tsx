import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

export type DashboardPresetId =
  | "allTime"
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "last90"
  | "thisMonth"
  | "lastMonth"
  | "custom";

export type DashboardRangeState = {
  preset: DashboardPresetId;
  from: Date;
  to: Date;
};

type Ctx = {
  range: DashboardRangeState;
  setPreset: (preset: DashboardPresetId) => void;
  setCustomRange: (from: Date, to: Date) => void;
};

const STORAGE_KEY = "techvistar-dashboard-header-range-v3";

/** Far-past bound used only for API serialization when All Time is selected. */
const ALL_TIME_FROM = new Date("2000-01-01T00:00:00.000Z");

export const DASHBOARD_PRESETS: Array<{ id: DashboardPresetId; label: string }> = [
  { id: "allTime", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last7", label: "Last 7 Days" },
  { id: "last30", label: "Last 30 Days" },
  { id: "last90", label: "Last 90 Days" },
  { id: "thisMonth", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "custom", label: "Custom Range" },
];

export function resolvePresetRange(preset: DashboardPresetId, now = new Date()): { from: Date; to: Date } {
  switch (preset) {
    case "allTime":
      return { from: ALL_TIME_FROM, to: endOfDay(now) };
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "yesterday": {
      const y = subDays(startOfDay(now), 1);
      return { from: y, to: endOfDay(y) };
    }
    case "last7":
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    case "last30":
      return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
    case "last90":
      return { from: startOfDay(subDays(now, 89)), to: endOfDay(now) };
    case "thisMonth":
      return { from: startOfMonth(now), to: endOfDay(now) };
    case "lastMonth": {
      const prev = subMonths(now, 1);
      return { from: startOfMonth(prev), to: endOfMonth(prev) };
    }
    default:
      return { from: ALL_TIME_FROM, to: endOfDay(now) };
  }
}

function readStored(): DashboardRangeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { preset?: DashboardPresetId; from?: string; to?: string };
      if (parsed.preset && parsed.preset !== "custom") {
        return { preset: parsed.preset, ...resolvePresetRange(parsed.preset) };
      }
      if (parsed.from && parsed.to) {
        return {
          preset: "custom",
          from: startOfDay(new Date(parsed.from)),
          to: endOfDay(new Date(parsed.to)),
        };
      }
    }
  } catch {
    /* ignore */
  }
  return { preset: "allTime", ...resolvePresetRange("allTime") };
}

const DashboardRangeContext = createContext<Ctx | null>(null);

export function DashboardRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DashboardRangeState>(() =>
    typeof window !== "undefined" ? readStored() : { preset: "allTime", ...resolvePresetRange("allTime") },
  );

  const persist = useCallback((next: DashboardRangeState) => {
    setRange(next);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preset: next.preset,
          from: next.from.toISOString(),
          to: next.to.toISOString(),
        }),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const setPreset = useCallback(
    (preset: DashboardPresetId) => {
      if (preset === "custom") {
        persist({ ...range, preset: "custom" });
        return;
      }
      persist({ preset, ...resolvePresetRange(preset) });
    },
    [persist, range],
  );

  const setCustomRange = useCallback(
    (from: Date, to: Date) => {
      persist({ preset: "custom", from: startOfDay(from), to: endOfDay(to) });
    },
    [persist],
  );

  const value = useMemo(() => ({ range, setPreset, setCustomRange }), [range, setPreset, setCustomRange]);

  return <DashboardRangeContext.Provider value={value}>{children}</DashboardRangeContext.Provider>;
}

export function useDashboardRange() {
  const ctx = useContext(DashboardRangeContext);
  if (!ctx) throw new Error("useDashboardRange requires DashboardRangeProvider");
  return ctx;
}
