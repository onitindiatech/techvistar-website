import type { DashboardAnalytics } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";

export type DashboardNotificationType =
  | "contact"
  | "application"
  | "newsletter"
  | "cms"
  | "portfolio"
  | "admin"
  | "service"
  | "solution"
  | "industry";

export type DashboardNotification = {
  id: string;
  type: DashboardNotificationType;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  read: boolean;
};

const READ_KEY = "techvistar-admin-notification-reads";

export function loadReadNotificationIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function saveReadNotificationIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function buildNotificationsFromDashboard(
  data: DashboardAnalytics,
  readIds: Set<string>,
): DashboardNotification[] {
  const items: DashboardNotification[] = [];

  for (const contact of data.recentContacts) {
    items.push({
      id: `contact:${contact.id}`,
      type: "contact",
      title: "New Contact",
      description: `${contact.name} · ${contact.subject || "No subject"}`,
      href: "/admin/contacts",
      createdAt: contact.createdAt,
      read: readIds.has(`contact:${contact.id}`),
    });
  }

  for (const app of data.recentApplications) {
    items.push({
      id: `application:${app.id}`,
      type: "application",
      title: "New Job Application",
      description: `${app.fullName} · ${app.position}`,
      href: "/admin/applications",
      createdAt: app.createdAt,
      read: readIds.has(`application:${app.id}`),
    });
  }

  for (const sub of data.recentNewsletter) {
    items.push({
      id: `newsletter:${sub.id}`,
      type: "newsletter",
      title: "Newsletter Subscriber",
      description: `${sub.email} · ${sub.source}`,
      href: "/admin/newsletter",
      createdAt: sub.createdAt,
      read: readIds.has(`newsletter:${sub.id}`),
    });
  }

  for (const [index, update] of data.recentCmsUpdates.entries()) {
    const id = `cms:${update.type}:${update.updatedAt}:${index}`;
    items.push({
      id,
      type: "cms",
      title: "CMS Update",
      description: `${update.title} · ${update.updatedBy}`,
      href: "/admin/pages",
      createdAt: update.updatedAt,
      read: readIds.has(id),
    });
  }

  for (const project of data.recentPortfolio) {
    items.push({
      id: `portfolio:${project.id}`,
      type: "portfolio",
      title: "Portfolio Update",
      description: `${project.title} · ${project.status}`,
      href: "/admin/portfolio",
      createdAt: project.createdAt,
      read: readIds.has(`portfolio:${project.id}`),
    });
  }

  for (const admin of data.latestAdminActivity) {
    items.push({
      id: `admin:${admin.id}:${admin.updatedAt}`,
      type: "admin",
      title: "Admin Activity",
      description: `${admin.name} · ${admin.email}`,
      href: "/admin/dashboard",
      createdAt: admin.updatedAt,
      read: readIds.has(`admin:${admin.id}:${admin.updatedAt}`),
    });
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function formatNotificationTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}
