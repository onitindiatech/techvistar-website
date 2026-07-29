import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { endOfDay, format, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import type { DashboardAnalytics } from "@/types/dashboard";
import {
  DASHBOARD_PRESETS,
  type DashboardPresetId,
  useDashboardRange,
} from "@/contexts/DashboardRangeContext";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title?: string;
  description?: string;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
  lastSyncedAt?: Date | null;
  analytics?: DashboardAnalytics | null;
  adminName?: string;
};

export const DashboardHeader = ({
  title = "Dashboard",
  description = "Welcome back, Admin! Here's what's happening with your platform today.",
  onRefresh,
  isRefreshing,
  lastSyncedAt,
  analytics,
  adminName = "Admin",
}: DashboardHeaderProps) => {
  const { range, setPreset, setCustomRange } = useDashboardRange();
  const [exporting, setExporting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>({
    from: range.from,
    to: range.to,
  });

  const presetLabel = useMemo(() => {
    const found = DASHBOARD_PRESETS.find((p) => p.id === range.preset);
    if (range.preset === "custom" || !found) {
      return `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`;
    }
    return found.label;
  }, [range]);

  const lastSyncLabel = lastSyncedAt
    ? format(lastSyncedAt, "hh:mm a")
    : format(new Date(), "hh:mm a");

  const handlePreset = (id: DashboardPresetId) => {
    if (id === "custom") {
      setDraftRange({ from: range.from, to: range.to });
      setPreset("custom");
      setCalendarOpen(true);
      return;
    }
    setPreset(id);
    setCalendarOpen(false);
  };

  const handleSync = async () => {
    if (!onRefresh) return;
    try {
      await onRefresh();
      toast.success("Dashboard synced", {
        description: `Last synced ${format(new Date(), "MMM d · hh:mm a")}`,
      });
    } catch (err) {
      toast.error("Sync failed", {
        description: err instanceof Error ? err.message : "Unable to refresh dashboard data.",
      });
    }
  };

  const handleExport = async (formatType: "pdf" | "xlsx" | "csv") => {
    if (!analytics) {
      toast.error("Nothing to export", { description: "Load dashboard analytics first." });
      return;
    }
    setExporting(true);
    try {
      const exportRange = { from: range.from, to: range.to };
      const {
        exportDashboardCsv,
        exportDashboardPdf,
        exportDashboardXlsx,
      } = await import("@/lib/dashboard-export");
      if (formatType === "pdf") {
        await exportDashboardPdf(analytics, exportRange, adminName);
      } else if (formatType === "xlsx") {
        await exportDashboardXlsx(analytics, exportRange, adminName);
      } else {
        exportDashboardCsv(analytics, exportRange, adminName);
      }
      toast.success(`Exported ${formatType.toUpperCase()}`, {
        description: `dashboard-report-${format(new Date(), "yyyy-MM-dd")}.${formatType === "xlsx" ? "xlsx" : formatType}`,
      });
    } catch (err) {
      toast.error("Export failed", {
        description: err instanceof Error ? err.message : "Could not generate report.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-sans text-xl font-bold tracking-tight text-slate-800">{title}</h1>
          <p className="mt-1 text-xs font-medium text-slate-400">{description}</p>
          <p className="mt-1 text-[10px] font-medium text-slate-400">Last synced {lastSyncLabel}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="flex flex-wrap items-center gap-2 sm:gap-2.5"
        >
          <Popover
            open={calendarOpen}
            onOpenChange={(open) => {
              setCalendarOpen(open);
              if (open) setDraftRange({ from: range.from, to: range.to });
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                aria-label="Analytics date range"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="max-w-[200px] truncate">{presetLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0 sm:w-[560px]" align="end">
              <div className="grid sm:grid-cols-[180px_1fr]">
                <div className="border-b border-slate-100 p-2 sm:border-b-0 sm:border-r">
                  <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Analytics period
                  </p>
                  <div className="space-y-0.5">
                    {DASHBOARD_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePreset(preset.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                          range.preset === preset.id
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {preset.label}
                        {range.preset === preset.id && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-2">
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Custom range
                  </p>
                  <CalendarPicker
                    mode="range"
                    selected={draftRange}
                    onSelect={setDraftRange}
                    numberOfMonths={2}
                    defaultMonth={range.from}
                  />
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-2 pt-2">
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
                      onClick={() => setCalendarOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                      onClick={() => {
                        if (draftRange?.from && draftRange?.to) {
                          setCustomRange(startOfDay(draftRange.from), endOfDay(draftRange.to));
                          setCalendarOpen(false);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {onRefresh && (
            <button
              type="button"
              onClick={() => void handleSync()}
              disabled={isRefreshing}
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing…" : "Sync"}</span>
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={exporting || !analytics}
                className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                <Download className={`h-3.5 w-3.5 ${exporting ? "animate-pulse" : ""}`} />
                <span>{exporting ? "Exporting…" : "Export Report"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Export format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void handleExport("pdf")} className="gap-2 text-xs">
                <FileText className="h-3.5 w-3.5" /> PDF report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleExport("xlsx")} className="gap-2 text-xs">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleExport("csv")} className="gap-2 text-xs">
                <Download className="h-3.5 w-3.5" /> CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHeader;
