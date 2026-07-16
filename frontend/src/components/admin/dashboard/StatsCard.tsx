import type { LucideIcon } from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Maximize2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useEffect } from "react";

type StatsCardProps = {
  cardKey: string;
  title: string;
  value: string;
  description: string;
  Icon?: LucideIcon;
  trend?: number | null;
  trendStatus?: "ok" | "new" | "none";
  data?: any[];
  isOnlineIndicator?: boolean;
  /** Permanent CMS stock — not scoped by the dashboard date filter */
  isInventory?: boolean;
};

const PALETTES: Record<string, { bg: string; iconBg: string; text: string; stroke: string }> = {
  services: {
    bg: "from-emerald-500/5 to-teal-500/5 hover:border-emerald-500/20",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    text: "text-emerald-700",
    stroke: "#10b981",
  },
  solutions: {
    bg: "from-sky-500/5 to-blue-500/5 hover:border-sky-500/20",
    iconBg: "bg-sky-50 text-sky-600 border-sky-100/50",
    text: "text-sky-700",
    stroke: "#0ea5e9",
  },
  industries: {
    bg: "from-teal-500/5 to-emerald-500/5 hover:border-teal-500/20",
    iconBg: "bg-teal-50 text-teal-600 border-teal-100/50",
    text: "text-teal-700",
    stroke: "#14b8a6",
  },
  projects: {
    bg: "from-amber-500/5 to-orange-500/5 hover:border-amber-500/20",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100/50",
    text: "text-amber-700",
    stroke: "#f59e0b",
  },
  jobs: {
    bg: "from-rose-500/5 to-pink-500/5 hover:border-rose-500/20",
    iconBg: "bg-rose-50 text-rose-600 border-rose-100/50",
    text: "text-rose-700",
    stroke: "#f43f5e",
  },
  applications: {
    bg: "from-indigo-500/5 to-violet-500/5 hover:border-indigo-500/20",
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    text: "text-indigo-700",
    stroke: "#6366f1",
  },
  contacts: {
    bg: "from-orange-500/5 to-amber-500/5 hover:border-orange-500/20",
    iconBg: "bg-orange-50 text-orange-600 border-orange-100/50",
    text: "text-orange-700",
    stroke: "#f97316",
  },
  newsletter: {
    bg: "from-purple-500/5 to-fuchsia-500/5 hover:border-purple-500/20",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100/50",
    text: "text-purple-700",
    stroke: "#8b5cf6",
  },
  faqs: {
    bg: "from-blue-500/5 to-cyan-500/5 hover:border-blue-500/20",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100/50",
    text: "text-blue-700",
    stroke: "#3b82f6",
  },
  active_admins: {
    bg: "from-emerald-500/5 to-green-500/5 hover:border-emerald-500/20",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    text: "text-emerald-700",
    stroke: "#10b981",
  },
  admins: {
    bg: "from-emerald-500/5 to-green-500/5 hover:border-emerald-500/20",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    text: "text-emerald-700",
    stroke: "#10b981",
  },
};

export const StatsCard = ({
  cardKey,
  title,
  value,
  description,
  Icon,
  trend,
  trendStatus = "ok",
  data = [],
  isOnlineIndicator = false,
  isInventory = false,
}: StatsCardProps) => {
  const hasTrend = trendStatus === "ok" && typeof trend === "number";
  const showNew = trendStatus === "new";
  const showNone = trendStatus === "none";
  const isPositive = (trend ?? 0) >= 0;
  const chartData = data.length > 0 ? data : [{ value: 0 }];
  const numericValue = Number(value) || 0;
  const counter = useMotionValue(0);
  const rounded = useTransform(counter, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(counter, numericValue, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [counter, numericValue]);

  const palette = PALETTES[cardKey] ?? {
    bg: "from-slate-500/5 to-slate-600/5 hover:border-slate-500/20",
    iconBg: "bg-slate-50 text-slate-600 border-slate-100",
    text: "text-slate-700",
    stroke: "#64748b",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_24px_-10px_rgba(15,23,42,0.02)] transition-all duration-300 group flex flex-col justify-between h-full min-h-[160px] bg-gradient-to-br ${palette.bg}`}
    >
      {/* Top section: Icon & Title & Maximize */}
      <div className="flex items-start justify-between z-10">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${palette.iconBg} shadow-sm transition-all duration-300 group-hover:scale-105`}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">TechVistar</p>
            <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isInventory && (
            <span
              className="rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium leading-none text-slate-400"
              title="Total stock — not affected by the date filter"
            >
              Current Inventory
            </span>
          )}
          <button className="text-slate-300 hover:text-slate-500 transition-colors p-1" aria-label="Maximize metric">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center/Bottom section: Value, Trend, Sparkline */}
      <div className="mt-4 flex items-end justify-between z-10 gap-3">
        <div className="space-y-1">
          <motion.h3 className="text-3xl font-bold tracking-tight text-slate-800 font-sans">
            {rounded}
          </motion.h3>

          {/* Trend or Online indicator */}
          {isOnlineIndicator ? (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md w-fit">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Online
            </div>
          ) : hasTrend ? (
            <div className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md border w-fit ${
              isPositive
                ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                : "bg-red-50 text-red-600 border-red-100/50"
            }`}>
              {(trend ?? 0) > 0 ? "+" : ""}
              {trend ?? 0}% <span className="font-normal text-slate-400 ml-0.5">vs prior</span>
            </div>
          ) : showNew ? (
            <div className="flex w-fit items-center rounded-md border border-emerald-100/50 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
              New
            </div>
          ) : showNone ? (
            <div className="flex w-fit items-center rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-400">
              —
            </div>
          ) : (
            <p className="text-[10px] font-medium text-slate-400">{description}</p>
          )}
        </div>

        {/* Sparkline Chart */}
        {!isOnlineIndicator && data.length > 0 && (
          <div className="h-10 w-20 shrink-0 opacity-75 transition-opacity duration-300 group-hover:opacity-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={palette.stroke}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
