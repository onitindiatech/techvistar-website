import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import {
  Wrench, Shapes, Package, MessageSquareText, BriefcaseBusiness,
  FileText, Contact, Mail, ArrowUpRight, Database, Server, Key, Cloud,
  Building, RefreshCw, AlertCircle, Loader2, ChevronRight, ShieldCheck, User2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardAnalytics } from "@/services/dashboard.service";
import type { DashboardMetric, DashboardRecentActivity } from "@/types/dashboard";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useDashboardRange } from "@/contexts/DashboardRangeContext";
import { getCurrentAdmin } from "@/services/auth.service";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const METRIC_ICONS: Record<string, LucideIcon> = {
  services: Wrench,
  industries: Building,
  solutions: Shapes,
  projects: Package,
  faqs: MessageSquareText,
  jobs: BriefcaseBusiness,
  applications: FileText,
  contacts: Contact,
  newsletter: Mail,
  admins: ShieldCheck,
};

/** Permanent CMS stock — not scoped by the dashboard date filter */
const INVENTORY_METRIC_KEYS = new Set([
  "services",
  "industries",
  "solutions",
  "projects",
  "faqs",
  "admins",
]);

const PIE_COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ef4444", "#64748b", "#ec4899", "#14b8a6"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "#94a3b8",
  Shortlisted: "#8b5cf6",
  Interview: "#f59e0b",
  Rejected: "#ef4444",
  Selected: "#10b981",
  New: "#ef4444",
  "In Progress": "#3b82f6",
  Resolved: "#10b981",
  Archived: "#94a3b8",
  Active: "#10b981",
  Closed: "#64748b",
  Draft: "#f59e0b",
  Subscribed: "#10b981",
  Unsubscribed: "#94a3b8",
  Completed: "#10b981",
  "In Progress Project": "#3b82f6",
  "Coming Soon": "#f59e0b",
};

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  service: Wrench,
  solution: Shapes,
  industry: Building,
  project: Package,
  job: BriefcaseBusiness,
  application: FileText,
  contact: Contact,
  newsletter: Mail,
  faq: MessageSquareText,
};

const ACTIVITY_COLORS: Record<string, string> = {
  service: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  solution: "bg-blue-50 text-blue-600 border border-blue-100",
  industry: "bg-teal-50 text-teal-600 border border-teal-100",
  project: "bg-amber-50 text-amber-600 border border-amber-100",
  job: "bg-pink-50 text-pink-600 border border-pink-100",
  application: "bg-violet-50 text-violet-600 border border-violet-100",
  contact: "bg-purple-50 text-purple-600 border border-purple-100",
  newsletter: "bg-slate-50 text-slate-600 border border-slate-200",
  faq: "bg-indigo-50 text-indigo-600 border border-indigo-100",
};

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  action?: string;
  onClickAction?: () => void;
  colSpan?: number;
  className?: string;
};

const SectionCard = ({ title, children, action, onClickAction, colSpan = 1, className = "" }: SectionCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(15,23,42,0.015)] flex flex-col justify-between hover:shadow-[0_15px_30px_-10px_rgba(15,23,42,0.04)] hover:border-slate-200/60 transition-all duration-300 ${
      colSpan === 2 ? 'lg:col-span-2' : colSpan === 3 ? 'lg:col-span-3' : ''
    } ${className}`}
  >
    <div className="w-full">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h3>
        {action && (
          <button
            type="button"
            onClick={onClickAction}
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 transition-colors uppercase tracking-widest"
          >
            {action} <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  </motion.div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="flex h-full min-h-[220px] items-center justify-center text-xs font-medium text-slate-400">
    {message}
  </div>
);

const formatMetricValue = (value: number) => String(value).padStart(2, "0");
const formatTrend = (trend: number | null | undefined, status?: "ok" | "new" | "none") => {
  if (status === "new") return "New";
  if (status === "none" || trend == null) return "—";
  return `${trend >= 0 ? "+" : ""}${trend}%`;
};

const mapActivityToTimeline = (activity: DashboardRecentActivity) => {
  const Icon = ACTIVITY_ICONS[activity.type] ?? FileText;
  const color = ACTIVITY_COLORS[activity.type] ?? "bg-slate-50 text-slate-500 border border-slate-100";
  return {
    event: activity.title,
    user: activity.subtitle || activity.status || activity.type,
    time: format(new Date(activity.createdAt), "MMM d, yyyy · h:mm a"),
    icon: Icon,
    color,
    href: activity.href,
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { range } = useDashboardRange();
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const { data: admin } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentAdmin,
    staleTime: 300000,
    retry: false,
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "dashboard", "analytics", range.from.toISOString(), range.to.toISOString(), range.preset],
    queryFn: () => getDashboardAnalytics({ from: range.from, to: range.to, preset: range.preset }),
    staleTime: 30_000,
    refetchInterval: 45_000,
    refetchOnWindowFocus: true,
    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  useEffect(() => {
    if (data?.generatedAt) setLastSyncedAt(new Date(data.generatedAt));
  }, [data?.generatedAt]);

  const handleSync = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin"] }),
      refetch(),
    ]);
    setLastSyncedAt(new Date());
  }, [queryClient, refetch]);

  if (!data && !isError) {
    return (
      <div className="space-y-6 pb-10">
        <div className="h-40 rounded-2xl border border-slate-100 bg-gradient-to-r from-white via-emerald-50/20 to-teal-50/20 animate-pulse" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl border border-slate-100 bg-white animate-pulse" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Connecting to dashboard services...</p>
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/30 p-8 text-center max-w-xl mx-auto my-12">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div>
          <p className="text-lg font-bold text-slate-900">Unable to load dashboard</p>
          <p className="mt-1 text-sm text-slate-500">{(error as Error)?.message ?? "Something went wrong."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  // Real MongoDB metrics
  const cmsStats = data.metrics.map((metric: DashboardMetric) => ({
    key: metric.key,
    title: metric.title,
    value: formatMetricValue(metric.value),
    description: metric.description,
    icon: METRIC_ICONS[metric.key] ?? Package,
    trend: metric.trend,
    trendStatus: metric.trendStatus ?? "ok",
    data: metric.series.map((point) => ({ value: point.value })),
    isOnlineIndicator: false,
    isInventory: INVENTORY_METRIC_KEYS.has(metric.key),
  }));

  const platformChartData = data.platformOverview.series.map((row) => ({
    name: row.label,
    contacts: row.contacts,
    content: row.content,
    applications: row.applications,
    cmsUpdates: row.cmsUpdates,
  }));

  const platformMetrics = data.platformOverview.metrics;

  const contentDistributionData = data.contentDistribution.map((entry, index) => ({
    ...entry,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  const withChartColors = (items: Array<{ name: string; value: number }>) =>
    items.map((entry, index) => ({
      ...entry,
      color: STATUS_COLORS[entry.name] ?? PIE_COLORS[index % PIE_COLORS.length],
    }));

  const applicationStatusData = withChartColors(data.applicationStatus);
  const contactStatusData = withChartColors(data.contactStatus);
  const monthlyGrowthData = data.monthlyGrowth.map((row) => ({
    name: row.label,
    contacts: row.contacts,
    applications: row.applications,
    subscribers: row.subscribers,
    services: row.services,
    solutions: row.solutions,
    industries: row.industries,
    jobs: row.jobs,
    portfolio: row.portfolio,
    content: row.content,
    cmsUpdates: row.cmsUpdates,
  }));

  const recentTimeline = data.recentActivity.map(mapActivityToTimeline);
  const { contentStatistics, systemStatus, storageUsage, seoAnalytics, websiteHealth, databaseStats } = data;
  const generatedLabel = format(new Date(data.generatedAt), "MMM d, yyyy · h:mm a");
  const totalContent = data.contentDistribution.reduce((acc, item) => acc + item.value, 0);
  const totalApplications = data.applicationStatus.reduce((acc, item) => acc + item.value, 0);
  const totalContacts = data.contactStatus.reduce((acc, item) => acc + item.value, 0);
  const hasPlatformData = platformChartData.some((row) => row.contacts > 0 || row.content > 0 || row.applications > 0 || row.cmsUpdates > 0);

  const quickActions = [
    { label: "Add Service", desc: "Create and publish service content", icon: Wrench, path: "/admin/services", color: "from-emerald-500/20 to-teal-500/20 text-emerald-700" },
    { label: "Add Solution", desc: "Launch new solution pages", icon: Shapes, path: "/admin/solutions", color: "from-sky-500/20 to-blue-500/20 text-blue-700" },
    { label: "Add Portfolio", desc: "Add recent portfolio projects", icon: Package, path: "/admin/portfolio", color: "from-amber-500/20 to-orange-500/20 text-amber-700" },
    { label: "Publish Job", desc: "Open new role applications", icon: BriefcaseBusiness, path: "/admin/jobs", color: "from-rose-500/20 to-pink-500/20 text-rose-700" },
    { label: "View Contacts", desc: "Respond to fresh inquiries", icon: Contact, path: "/admin/contacts", color: "from-orange-500/20 to-amber-500/20 text-orange-700" },
    { label: "Newsletter", desc: "Manage subscribers and exports", icon: Mail, path: "/admin/newsletter", color: "from-purple-500/20 to-fuchsia-500/20 text-purple-700" },
  ];

  return (
    <div className="space-y-6 pb-10 bg-slate-50/50 rounded-3xl p-1 sm:p-2">
      <DashboardHeader
        description={`Live analytics from MongoDB · Last updated ${generatedLabel}`}
        onRefresh={handleSync}
        isRefreshing={isFetching}
        lastSyncedAt={lastSyncedAt}
        analytics={data}
        adminName={admin?.name ?? "Admin"}
      />

      {/* Grid of 10 Cards - 5 columns on large screen */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        {cmsStats.map((item) => (
          <StatsCard
            key={item.key}
            cardKey={item.key}
            title={item.title}
            value={item.value}
            description={item.description}
            Icon={item.icon}
            trend={item.trend}
            trendStatus={item.trendStatus}
            data={item.data}
            isOnlineIndicator={item.isOnlineIndicator}
            isInventory={item.isInventory}
          />
        ))}
      </motion.div>

      {/* Row 1: Platform Overview & Content Distribution & Applications Overview */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Platform Overview Line Chart */}
        <SectionCard title="Platform Overview" action="View Operations" onClickAction={() => navigate("/admin/contacts")} colSpan={2}>
          {/* Metrics Pill Grid */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5">
            {platformMetrics.map((metric) => (
              <div key={metric.key} className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-100 rounded-xl px-3 py-1.5 hover:bg-slate-100/50 transition-colors">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                  <User2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-slate-800">{metric.value.toLocaleString()}</span>
                    <span
                      className={`flex items-center text-[9px] font-bold ${
                        metric.trendStatus === "new"
                          ? "text-emerald-600"
                          : metric.trendStatus === "none" || metric.trend == null
                            ? "text-slate-400"
                            : (metric.trend ?? 0) >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                      }`}
                    >
                      {metric.trendStatus === "ok" && (metric.trend ?? 0) < 0 ? (
                        <ArrowUpRight className="h-2 w-2 rotate-90" />
                      ) : metric.trendStatus === "ok" ? (
                        <ArrowUpRight className="h-2 w-2" />
                      ) : null}{" "}
                      {formatTrend(metric.trend, metric.trendStatus)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[260px] w-full">
            {hasPlatformData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', background: "#fff", boxShadow: '0 10px 25px rgba(15,23,42,0.05)' }} />
                <Area type="monotone" dataKey="content" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Content Created" />
                <Area type="monotone" dataKey="contacts" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" name="Contacts" />
                <Line type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} name="Applications" />
              </AreaChart>
            </ResponsiveContainer>
            ) : (
              <EmptyChart message="No platform activity recorded in the last 6 months." />
            )}
          </div>
        </SectionCard>

        {/* Content Distribution Donut Chart */}
        <SectionCard title="Content Distribution">
          <div className="h-[210px] w-full flex items-center justify-center relative">
            {contentDistributionData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contentDistributionData} cx="50%" cy="50%" innerRadius={65} outerRadius={82} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={4}>
                      {contentDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">{totalContent}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Items</span>
                </div>
              </>
            ) : (
              <EmptyChart message="No CMS content in the database yet." />
            )}
          </div>
          {/* Custom Legened Grid */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
            {contentDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-500 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700 text-right">
                  {item.value} <span className="text-[10px] font-normal text-slate-400">({Math.round((item.value / (totalContent || 1)) * 100)}%)</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span>SEO Health</span>
              <span>{seoAnalytics.averageScore}% avg · {seoAnalytics.configuredPages}/{seoAnalytics.totalPages} configured</span>
            </div>
            {seoAnalytics.progress.slice(0, 3).map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{item.label}</span>
                  <span>{item.value}/{item.total}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 2: Monthly growth, Applications Overview, Contact Ticket Status */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Applications Overview */}
        <SectionCard title="Applications Overview">
          <div className="h-[210px] w-full flex items-center justify-center relative">
            {applicationStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={applicationStatusData} cx="50%" cy="50%" innerRadius={65} outerRadius={82} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={4}>
                      {applicationStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">{totalApplications}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Apps</span>
                </div>
              </>
            ) : (
              <EmptyChart message="No job applications received yet." />
            )}
          </div>
          {/* Custom Legend */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
            {applicationStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-500 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700 text-right">
                  {item.value} <span className="text-[10px] font-normal text-slate-400">({Math.round((item.value / (totalApplications || 1)) * 100)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Contact Ticket Status */}
        <SectionCard title="Contact Ticket Status">
          <div className="h-[210px] w-full flex items-center justify-center relative">
            {contactStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contactStatusData} cx="50%" cy="50%" innerRadius={65} outerRadius={82} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={4}>
                      {contactStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">{totalContacts}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Tickets</span>
                </div>
              </>
            ) : (
              <EmptyChart message="No contact inquiries yet." />
            )}
          </div>
          {/* Custom Legend */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
            {contactStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-500 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700 text-right">
                  {item.value} <span className="text-[10px] font-normal text-slate-400">({Math.round((item.value / (totalContacts || 1)) * 100)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Growth Analytics (Monthly Bar Chart) */}
        <SectionCard title="Growth Analytics (Monthly)">
          <div className="h-[210px] w-full">
            {monthlyGrowthData.some((row) =>
              row.contacts > 0 ||
              row.applications > 0 ||
              row.subscribers > 0 ||
              row.content > 0 ||
              row.cmsUpdates > 0
            ) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="contacts" fill="#f97316" radius={[4, 4, 0, 0]} barSize={10} name="Contacts" />
                  <Bar dataKey="applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={10} name="Applications" />
                  <Bar dataKey="subscribers" fill="#10b981" radius={[4, 4, 0, 0]} barSize={10} name="Subscribers" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No monthly performance data available." />
            )}
          </div>
          {/* Mini Legend Row */}
          <div className="mt-3 flex items-center justify-center gap-4 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500" /> Subscribers</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-purple-500" /> Applications</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" /> Contacts</span>
          </div>
        </SectionCard>
      </div>

      {/* Row 3: Recent Activity & System Status & Quick Actions */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Recent CMS Activity Timeline */}
        <SectionCard title="Recent Activity">
          <div className="my-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {recentTimeline.length > 0 ? (
              <div className="space-y-0">
                {recentTimeline.map((activity, i) => {
                  const Icon = activity.icon;
                  const isLast = i === recentTimeline.length - 1;
                  return (
                    <div key={`${activity.href}-${activity.time}-${i}`} className="relative flex gap-3">
                      {/* Timeline column: fixed icon + centered rail */}
                      <div className="relative flex w-10 shrink-0 flex-col items-center">
                        {!isLast && (
                          <div
                            className="absolute left-1/2 top-10 bottom-0 w-px -translate-x-1/2 bg-slate-100"
                            aria-hidden
                          />
                        )}
                        <span
                          className={`relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${activity.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>

                      {/* Content: title never overlaps icon; timestamp stays right */}
                      <button
                        type="button"
                        onClick={() => navigate(activity.href)}
                        className={`min-w-0 flex-1 rounded-xl border border-transparent p-2 text-left transition-all duration-200 hover:border-slate-100 hover:bg-slate-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${
                          isLast ? "pb-2" : "pb-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold leading-snug text-slate-700 transition-colors hover:text-emerald-600">
                              {activity.event}
                            </p>
                            <p className="mt-1 truncate text-[10px] text-slate-400">
                              Action by <span className="font-semibold text-slate-500">{activity.user}</span>
                            </p>
                          </div>
                          <span className="shrink-0 whitespace-nowrap pt-0.5 text-[9px] font-medium text-slate-400">
                            {activity.time}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-12 text-center text-xs font-medium text-slate-400">No CMS activity logged yet.</p>
            )}
          </div>
        </SectionCard>

        {/* System Status Monitor */}
        <SectionCard title="System Status">
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Website Health</p>
                <p className="text-2xl font-bold text-slate-800">{websiteHealth.overallPercent}%</p>
              </div>
              <p className="text-[10px] font-medium text-slate-500 text-right max-w-[160px]">
                {websiteHealth.checks.filter((check) => check.percent >= 90).length}/{websiteHealth.checks.length} checks healthy
              </p>
            </div>
          </div>
          <div className="space-y-3.5">
            {systemStatus.map((sys) => {
              const isOnline = sys.status === "online";
              const isDegraded = sys.status === "degraded";

              const statusColor = isOnline
                ? "bg-emerald-500 text-emerald-600 border-emerald-100"
                : isDegraded
                ? "bg-amber-500 text-amber-600 border-amber-100"
                : "bg-red-500 text-red-600 border-red-100";

              const Icon =
                sys.key === "database" ? Database :
                sys.key === "authentication" ? Key :
                sys.key === "storage" ? Cloud :
                Server;

              return (
                <div key={sys.key} className="rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-700 block leading-tight">{sys.label}</span>
                        {sys.detail && <span className="text-[9px] text-slate-400 truncate block mt-0.5">{sys.detail}</span>}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0">{sys.healthPercent}%</span>
                  </div>

                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.healthPercent}%` }}
                      transition={{ duration: 0.8 }}
                      className={`${isOnline ? "bg-emerald-500" : isDegraded ? "bg-amber-400" : "bg-red-400"} h-full rounded-full`}
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${statusColor.split(" ")[0]} animate-pulse`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isOnline ? "text-emerald-600" : isDegraded ? "text-amber-600" : "text-red-600"}`}>
                      {sys.status} · {sys.healthPercent}% operational
                    </span>
                  </div>
                </div>
              );
            })}
            {storageUsage && (
              <p className="text-[9px] font-medium text-slate-400 text-center pt-0.5">
                Cloud Storage · {storageUsage.detail}
                {databaseStats ? ` · DB ${databaseStats.dataSizeMB} MB` : ""}
                {contentStatistics.averageContactResponseHours != null
                  ? ` · Avg response ${contentStatistics.averageContactResponseHours}h`
                  : ""}
              </p>
            )}
          </div>
        </SectionCard>

        {/* Quick Actions (Premium cards with descriptions and animations) */}
        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-1 gap-2.5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 text-left transition-all hover:border-emerald-500/25 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${action.color.split(" ").slice(0, 2).join(" ")}`}>
                    <action.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 leading-tight group-hover:text-emerald-600 transition-colors">{action.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{action.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 4: Latest Contacts Table & Latest Applications Table */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Latest Contacts Table */}
        <SectionCard title="Latest Contacts" onClickAction={() => navigate("/admin/contacts")} action="View All">
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors last:border-0">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100/50 shrink-0">
                          {contact.name.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 truncate">{contact.name}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-[150px] truncate">{contact.subject || "Consultation Request"}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        contact.status === 'new' ? 'bg-red-50 text-red-600 border border-red-100/30' :
                        contact.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/30' :
                        'bg-blue-50 text-blue-600 border border-blue-100/30'
                      }`}>
                        {contact.status || 'New'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => navigate("/admin/contacts")} className="text-emerald-600 font-bold hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
                {data.recentContacts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">No contact submissions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Latest Applications Table */}
        <SectionCard title="Latest Applications" onClickAction={() => navigate("/admin/applications")} action="View All">
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold">Position</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentApplications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors last:border-0">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100/50 shrink-0">
                          {app.fullName.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 truncate">{app.fullName}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-[150px] truncate">{app.position}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        app.status === 'Pending' ? 'bg-slate-50 text-slate-500 border border-slate-200/50' :
                        app.status === 'Shortlisted' ? 'bg-purple-50 text-purple-600 border border-purple-100/30' :
                        'bg-amber-50 text-amber-600 border border-amber-100/30'
                      }`}>
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => navigate("/admin/applications")} className="text-emerald-600 font-bold hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
                {data.recentApplications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">No job applications received.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Row 5: Latest Subscribers Table & Latest Portfolio Entries Table */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Latest Subscribers Table */}
        <SectionCard title="Latest Subscribers" action="Newsletter" onClickAction={() => navigate("/admin/newsletter")}>
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Subscriber Email</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentNewsletter.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors last:border-0">
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{subscriber.email}</td>
                    <td className="px-4 py-3.5 text-slate-500">{subscriber.source}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded border border-emerald-100/30 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                        {subscriber.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.recentNewsletter.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-400 font-medium">No subscribers yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Latest Portfolio Entries Table */}
        <SectionCard title="Latest Portfolio Entries" action="Portfolio" onClickAction={() => navigate("/admin/portfolio")}>
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project Title</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Featured</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPortfolio.map((project) => (
                  <tr key={project.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors last:border-0">
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{project.title}</td>
                    <td className="px-4 py-3.5 text-slate-500">{project.status}</td>
                    <td className="px-4 py-3.5">
                      {project.featured ? (
                        <span className="rounded border border-amber-100/30 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-300 font-normal">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {data.recentPortfolio.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-400 font-medium">No portfolio projects yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Row 6: Latest CMS Updates List & Latest Admin Activity List */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Latest CMS Updates List */}
        <SectionCard title="Latest CMS Updates">
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {data.recentCmsUpdates.map((update, index) => (
              <div key={`cms-${index}`} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{update.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Modified by <span className="font-semibold text-slate-500">{update.updatedBy}</span>
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                    {update.type}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">{format(new Date(update.updatedAt), "MMM d, yyyy")}</p>
                </div>
              </div>
            ))}
            {data.recentCmsUpdates.length === 0 && (
              <p className="text-xs font-medium text-slate-400 text-center py-12">No CMS updates recorded.</p>
            )}
          </div>
        </SectionCard>

        {/* Latest Admin Activity List */}
        <SectionCard title="Latest Admin Activity">
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {data.latestAdminActivity.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 border border-slate-100 shrink-0">
                    <User2 className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{admin.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{admin.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md">
                    Registered
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">updated {format(new Date(admin.updatedAt), "MMM d, yyyy")}</p>
                </div>
              </div>
            ))}
            {data.latestAdminActivity.length === 0 && (
              <p className="text-xs font-medium text-slate-400 text-center py-12">No admin updates recorded.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Dashboard;
