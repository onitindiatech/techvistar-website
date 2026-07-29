import { format } from "date-fns";
import type { DashboardAnalytics } from "@/types/dashboard";

type ExportRange = { from: Date; to: Date };

function fileStamp(d = new Date()) {
  return format(d, "yyyy-MM-dd");
}

function buildRows(analytics: DashboardAnalytics, range: ExportRange, adminName: string) {
  const meta = [
    ["Generated", format(new Date(), "yyyy-MM-dd HH:mm:ss")],
    ["Admin", adminName],
    ["Date Range", `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`],
  ];

  const metrics = analytics.metrics.map((m) => [m.title, String(m.value), m.description, `${m.trend}%`]);

  const activity = analytics.recentActivity.map((a) => [
    a.type,
    a.title,
    a.subtitle,
    a.status,
    a.createdAt,
  ]);

  const contacts = analytics.recentContacts.map((c) => [c.name, c.email, c.subject, c.status, c.createdAt]);
  const applications = analytics.recentApplications.map((a) => [
    a.fullName,
    a.email,
    a.position,
    a.status,
    a.createdAt,
  ]);
  const subscribers = analytics.recentNewsletter.map((s) => [s.email, s.source, s.status, s.createdAt]);

  return { meta, metrics, activity, contacts, applications, subscribers };
}

export function exportDashboardCsv(
  analytics: DashboardAnalytics,
  range: ExportRange,
  adminName = "Admin",
) {
  const { meta, metrics, activity, contacts, applications, subscribers } = buildRows(
    analytics,
    range,
    adminName,
  );

  const sections: string[] = [];
  const push = (title: string, headers: string[], rows: string[][]) => {
    sections.push(title);
    sections.push(headers.join(","));
    for (const row of rows) {
      sections.push(row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","));
    }
    sections.push("");
  };

  push("Report Meta", ["Field", "Value"], meta.map(([k, v]) => [k, v]));
  push("Analytics Metrics", ["Metric", "Value", "Description", "Trend"], metrics);
  push("Recent Activity", ["Type", "Title", "Subtitle", "Status", "Created At"], activity);
  push("Contacts", ["Name", "Email", "Subject", "Status", "Created At"], contacts);
  push("Applications", ["Name", "Email", "Position", "Status", "Created At"], applications);
  push("Subscribers", ["Email", "Source", "Status", "Created At"], subscribers);

  const blob = new Blob([sections.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-report-${fileStamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDashboardXlsx(
  analytics: DashboardAnalytics,
  range: ExportRange,
  adminName = "Admin",
) {
  // Dynamic import keeps initial bundle lighter
  return import("xlsx").then((XLSX) => {
    const { meta, metrics, activity, contacts, applications, subscribers } = buildRows(
      analytics,
      range,
      adminName,
    );
    const wb = XLSX.utils.book_new();
    const sheet = (name: string, rows: string[][]) => {
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
    };

    sheet("Meta", [["Field", "Value"], ...meta]);
    sheet("Analytics", [["Metric", "Value", "Description", "Trend"], ...metrics]);
    sheet("Activity", [["Type", "Title", "Subtitle", "Status", "Created At"], ...activity]);
    sheet("Contacts", [["Name", "Email", "Subject", "Status", "Created At"], ...contacts]);
    sheet("Applications", [["Name", "Email", "Position", "Status", "Created At"], ...applications]);
    sheet("Subscribers", [["Email", "Source", "Status", "Created At"], ...subscribers]);
    sheet("Services", [
      ["Note"],
      ["Service inventory included via Analytics metrics (Total Services)."],
    ]);
    sheet("Solutions", [
      ["Note"],
      ["Solution inventory included via Analytics metrics (Total Solutions)."],
    ]);
    sheet("Industries", [
      ["Note"],
      ["Industry inventory included via Analytics metrics (Total Industries)."],
    ]);

    XLSX.writeFile(wb, `dashboard-report-${fileStamp()}.xlsx`);
  });
}

export async function exportDashboardPdf(
  analytics: DashboardAnalytics,
  range: ExportRange,
  adminName = "Admin",
) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableMod.default;
  const doc = new jsPDF();
  const { meta, metrics, activity, contacts, applications, subscribers } = buildRows(
    analytics,
    range,
    adminName,
  );

  doc.setFontSize(16);
  doc.text("TechVistar Dashboard Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated ${format(new Date(), "MMM d, yyyy · HH:mm")}`, 14, 26);
  doc.text(`Admin: ${adminName}`, 14, 32);
  doc.text(
    `Range: ${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`,
    14,
    38,
  );

  let startY = 46;
  const addTable = (title: string, head: string[], body: string[][]) => {
    doc.setFontSize(12);
    doc.text(title, 14, startY);
    autoTable(doc, {
      startY: startY + 4,
      head: [head],
      body,
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
    // @ts-expect-error lastAutoTable injected by plugin
    startY = (doc.lastAutoTable?.finalY ?? startY) + 12;
    if (startY > 260) {
      doc.addPage();
      startY = 20;
    }
  };

  addTable(
    "Meta",
    ["Field", "Value"],
    meta.map(([k, v]) => [k, v]),
  );
  addTable("Analytics", ["Metric", "Value", "Description", "Trend"], metrics);
  addTable("Recent Activity", ["Type", "Title", "Subtitle", "Status", "Created At"], activity);
  addTable("Contacts", ["Name", "Email", "Subject", "Status", "Created At"], contacts);
  addTable("Applications", ["Name", "Email", "Position", "Status", "Created At"], applications);
  addTable("Subscribers", ["Email", "Source", "Status", "Created At"], subscribers);

  doc.save(`dashboard-report-${fileStamp()}.pdf`);
}
