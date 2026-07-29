import { Bell, Search, Menu, LogOut, Command, Moon, Palette, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getCurrentAdmin, logoutAdmin } from "@/services/auth.service";
import { getDashboardAnalytics } from "@/services/dashboard.service";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAdminTheme } from "@/hooks/use-admin-theme";
import { NotificationDrawer } from "@/components/admin/dashboard/NotificationDrawer";
import {
  buildNotificationsFromDashboard,
  loadReadNotificationIds,
  saveReadNotificationIds,
} from "@/lib/dashboard-notifications";
import { useDashboardRange } from "@/contexts/DashboardRangeContext";

type TopNavbarProps = {
  onOpenSidebar?: () => void;
  onOpenSearch?: () => void;
};

export const TopNavbar = ({ onOpenSidebar, onOpenSearch }: TopNavbarProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, cycleTheme } = useAdminTheme();
  const { range } = useDashboardRange();
  const { data: admin } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 300000,
  });
  const { data: dashboard } = useQuery({
    queryKey: ["admin", "dashboard", "analytics", range.from.toISOString(), range.to.toISOString(), range.preset],
    queryFn: () => getDashboardAnalytics({ from: range.from, to: range.to, preset: range.preset }),
    staleTime: 30_000,
    refetchInterval: 45_000,
    refetchOnWindowFocus: true,
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => loadReadNotificationIds());

  const notifications = useMemo(
    () => (dashboard ? buildNotificationsFromDashboard(dashboard, readIds) : []),
    [dashboard, readIds],
  );
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadNotificationIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const n of notifications) next.add(n.id);
      saveReadNotificationIds(next);
      return next;
    });
  }, [notifications]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenSearch]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast({ title: "Logged out", description: "You have been signed out." });
      navigate("/admin/login", { replace: true });
    } catch {
      toast({ title: "Logout failed", description: "Please try again." });
    }
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "blue" ? Palette : Sun;
  const initials = (admin?.name ?? "AD")
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-slate-200/50 bg-white/70 px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="-ml-2 rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 xl:hidden"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
              type="button"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-extrabold tracking-tight text-slate-800 sm:block">
                Dashboard
              </span>
              <span className="hidden rounded-md border border-emerald-100/50 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm sm:inline-flex">
                Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => onOpenSearch?.()}
              className="group relative hidden w-64 text-left md:block lg:w-80"
              aria-label="Open global search"
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-500" />
              </div>
              <Input
                readOnly
                value=""
                placeholder="Search anything..."
                className="pointer-events-none h-10 rounded-xl border-transparent bg-slate-100/50 pl-10 pr-12 text-sm shadow-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                <div className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-bold text-slate-400 shadow-sm">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onOpenSearch?.()}
              className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cycleTheme}
                className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                title={`Theme: ${theme}`}
                aria-label="Cycle theme"
              >
                <ThemeIcon className="h-5 w-5" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifOpen(true)}
                className="relative rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.button>

              <div
                className="ml-1 hidden h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm sm:flex"
                title={admin?.name ?? "Admin"}
              >
                <span className="text-[10px] font-bold uppercase text-slate-500">{initials}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="ml-2 hidden h-10 gap-2 rounded-xl border-slate-200 px-4 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <NotificationDrawer
        open={notifOpen}
        onOpenChange={setNotifOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </>
  );
};

export default TopNavbar;
