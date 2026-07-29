import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAllServices } from "@/services/services.service";
import { getAllSolutions } from "@/services/solutions.service";
import { getAllIndustries } from "@/services/industry.service";
import { getAllProjects } from "@/services/portfolio.service";
import { getAllJobs, getAllApplications } from "@/services/job.service";
import { getAllContacts } from "@/services/contact.service";
import { getAllSubscribers } from "@/services/newsletter.service";
import { getAllFAQs } from "@/services/faq.service";
import { getDashboardAnalytics } from "@/services/dashboard.service";
import { fuzzyScore } from "@/lib/fuzzy";

type SearchItem = {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  href: string;
  score: number;
};

const CMS_PAGES: SearchItem[] = [
  { id: "cms-home", group: "CMS Pages", title: "Home Settings", href: "/admin/home-settings", score: 1 },
  { id: "cms-about", group: "CMS Pages", title: "About Settings", href: "/admin/about-settings", score: 1 },
  { id: "cms-contact", group: "CMS Pages", title: "Contact Settings", href: "/admin/contact-settings", score: 1 },
  { id: "cms-services", group: "CMS Pages", title: "Services Landing", href: "/admin/services-settings", score: 1 },
  { id: "cms-solutions", group: "CMS Pages", title: "Solutions Landing", href: "/admin/solutions-landing", score: 1 },
  { id: "cms-industries", group: "CMS Pages", title: "Industries Landing", href: "/admin/industries-landing", score: 1 },
  { id: "cms-portfolio", group: "CMS Pages", title: "Portfolio Landing", href: "/admin/portfolio-landing", score: 1 },
  { id: "cms-careers", group: "CMS Pages", title: "Careers Landing", href: "/admin/careers-landing", score: 1 },
  { id: "dash", group: "Dashboard", title: "Dashboard Overview", href: "/admin/dashboard", score: 1 },
  { id: "widgets", group: "Dashboard", title: "Analytics Widgets", href: "/admin/dashboard", score: 1 },
];

type AdminGlobalSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminGlobalSearch({ open, onOpenChange }: AdminGlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const { data } = useQuery({
    queryKey: ["admin", "global-search-index"],
    enabled: open,
    staleTime: 60_000,
    queryFn: async () => {
      const limit = { page: 1, limit: 50 } as const;
      const [
        services,
        solutions,
        industries,
        projects,
        jobs,
        applications,
        contacts,
        subscribers,
        faqs,
        dashboard,
      ] = await Promise.all([
        getAllServices(limit).catch(() => ({ services: [] as any[] })),
        getAllSolutions(limit).catch(() => ({ solutions: [] as any[] })),
        getAllIndustries(limit).catch(() => ({ industries: [] as any[] })),
        getAllProjects(limit).catch(() => ({ projects: [] as any[] })),
        getAllJobs(limit).catch(() => ({ jobs: [] as any[] })),
        getAllApplications(limit).catch(() => ({ applications: [] as any[] })),
        getAllContacts(limit).catch(() => ({ contacts: [] as any[] })),
        getAllSubscribers(limit).catch(() => ({ subscribers: [] as any[] })),
        getAllFAQs(limit).catch(() => ({ faqs: [] as any[] })),
        getDashboardAnalytics().catch(() => null),
      ]);

      const items: SearchItem[] = [...CMS_PAGES];

      for (const s of services.services ?? []) {
        items.push({
          id: `service-${s._id}`,
          group: "Services",
          title: s.title ?? "Service",
          subtitle: s.status,
          href: "/admin/services",
          score: 1,
        });
      }
      for (const s of solutions.solutions ?? []) {
        items.push({
          id: `solution-${s._id}`,
          group: "Solutions",
          title: s.title ?? "Solution",
          subtitle: s.status,
          href: "/admin/solutions",
          score: 1,
        });
      }
      for (const s of industries.industries ?? []) {
        items.push({
          id: `industry-${s._id}`,
          group: "Industries",
          title: s.title ?? "Industry",
          subtitle: s.status,
          href: "/admin/industries",
          score: 1,
        });
      }
      for (const p of projects.projects ?? []) {
        items.push({
          id: `project-${p._id}`,
          group: "Portfolio",
          title: p.title ?? "Project",
          subtitle: p.status,
          href: "/admin/portfolio",
          score: 1,
        });
      }
      for (const j of jobs.jobs ?? []) {
        items.push({
          id: `job-${j._id}`,
          group: "Jobs",
          title: j.title ?? "Job",
          subtitle: j.status,
          href: "/admin/jobs",
          score: 1,
        });
      }
      items.push({
        id: "careers-page",
        group: "Careers",
        title: "Careers / Jobs",
        href: "/admin/jobs",
        score: 1,
      });
      for (const a of applications.applications ?? []) {
        items.push({
          id: `app-${a._id}`,
          group: "Applications",
          title: a.fullName ?? "Applicant",
          subtitle: a.email,
          href: "/admin/applications",
          score: 1,
        });
      }
      for (const c of contacts.contacts ?? []) {
        items.push({
          id: `contact-${c._id}`,
          group: "Contacts",
          title: c.name ?? "Contact",
          subtitle: c.email,
          href: "/admin/contacts",
          score: 1,
        });
      }
      for (const s of subscribers.subscribers ?? []) {
        items.push({
          id: `sub-${s._id}`,
          group: "Newsletter",
          title: s.email ?? "Subscriber",
          subtitle: s.status,
          href: "/admin/newsletter",
          score: 1,
        });
      }
      for (const f of faqs.faqs ?? []) {
        items.push({
          id: `faq-${f._id}`,
          group: "FAQs",
          title: f.question ?? "FAQ",
          subtitle: f.category,
          href: "/admin/faqs",
          score: 1,
        });
      }
      if (dashboard?.latestAdminActivity) {
        for (const admin of dashboard.latestAdminActivity) {
          items.push({
            id: `admin-${admin.id}`,
            group: "Admin users",
            title: admin.name,
            subtitle: admin.email,
            href: "/admin/dashboard",
            score: 1,
          });
        }
      }

      return items;
    },
  });

  const results = useMemo(() => {
    const source = data ?? CMS_PAGES;
    if (!query.trim()) return source.slice(0, 40);
    return source
      .map((item) => ({
        ...item,
        score: Math.max(
          fuzzyScore(query, item.title),
          fuzzyScore(query, item.subtitle ?? ""),
          fuzzyScore(query, item.group),
        ),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [data, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of results) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return [...map.entries()];
  }, [results]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search services, contacts, jobs, CMS…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {grouped.map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.group} ${item.title} ${item.subtitle ?? ""}`}
                onSelect={() => {
                  onOpenChange(false);
                  navigate(item.href);
                }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.subtitle && (
                    <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
