import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { DashboardNotification } from "@/lib/dashboard-notifications";
import { formatNotificationTime } from "@/lib/dashboard-notifications";
import { Bell, CheckCheck } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { isToday, isYesterday } from "date-fns";

type NotificationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: DashboardNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
};

const TYPE_LABEL: Record<string, string> = {
  contact: "Contact",
  application: "Application",
  newsletter: "Newsletter",
  cms: "CMS",
  portfolio: "Portfolio",
  admin: "Admin",
  service: "Service",
  solution: "Solution",
  industry: "Industry",
};

type GroupKey = "Today" | "Yesterday" | "Earlier";

function groupNotifications(items: DashboardNotification[]) {
  const groups: Record<GroupKey, DashboardNotification[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };
  for (const item of items) {
    const date = new Date(item.createdAt);
    if (isToday(date)) groups.Today.push(item);
    else if (isYesterday(date)) groups.Yesterday.push(item);
    else groups.Earlier.push(item);
  }
  return (Object.keys(groups) as GroupKey[])
    .map((label) => ({ label, items: groups[label] }))
    .filter((g) => g.items.length > 0);
}

export function NotificationDrawer({
  open,
  onOpenChange,
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
}: NotificationDrawerProps) {
  const navigate = useNavigate();
  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-slate-100 px-5 py-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div>
              <SheetTitle className="text-base">Notifications</SheetTitle>
              <SheetDescription className="text-xs">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
              </SheetDescription>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <Bell className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No notifications yet</p>
              <p className="text-xs text-slate-400">
                New contacts, applications, and CMS updates will appear here.
              </p>
            </div>
          ) : (
            <div className="pb-4">
              {grouped.map((group) => (
                <div key={group.label}>
                  <p className="sticky top-0 z-[1] bg-slate-50/95 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 backdrop-blur-sm">
                    {group.label}
                  </p>
                  <ul className="divide-y divide-slate-100">
                    {group.items.map((n) => (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onMarkRead(n.id);
                            onOpenChange(false);
                            navigate(n.href);
                          }}
                          className={`w-full px-5 py-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
                            n.read ? "bg-white" : "bg-emerald-50/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                  {TYPE_LABEL[n.type] ?? n.type}
                                </span>
                                {!n.read && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                                )}
                              </div>
                              <p className="mt-1.5 text-xs font-semibold text-slate-800">{n.title}</p>
                              <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{n.description}</p>
                            </div>
                            <span className="shrink-0 whitespace-nowrap text-[10px] text-slate-400">
                              {formatNotificationTime(n.createdAt)}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
