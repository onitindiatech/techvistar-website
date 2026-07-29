import { NavLink, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  Contact,
  FileText,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Package,
  Shapes,
  Wrench,
  X,
  Settings,
  Building,
  Globe,
  Home,
  Info,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import logo from "../../../assets/logo.webp";
import { motion } from "framer-motion";

type NavItem = { label: string; path: string; icon: typeof LayoutDashboard };

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Website",
    items: [
      { label: "Home", path: "/admin/home-settings", icon: Home },
      { label: "About", path: "/admin/about-settings", icon: Info },
      { label: "Contact", path: "/admin/contact-settings", icon: Phone },
      { label: "Website Settings", path: "/admin/website-settings", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Services", path: "/admin/services", icon: Wrench },
      { label: "Services Landing", path: "/admin/services-settings", icon: Settings },
    ],
  },
  {
    title: "Solutions",
    items: [
      { label: "Solutions", path: "/admin/solutions", icon: Shapes },
      { label: "Solutions Landing", path: "/admin/solutions-landing", icon: Settings },
    ],
  },
  {
    title: "Industries",
    items: [
      { label: "Industries", path: "/admin/industries", icon: Building },
      { label: "Industries Landing", path: "/admin/industries-landing", icon: Settings },
    ],
  },
  {
    title: "Portfolio",
    items: [{ label: "Portfolio", path: "/admin/portfolio", icon: Package }],
  },
  {
    title: "Careers",
    items: [
      { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
      { label: "Applications", path: "/admin/applications", icon: FileText },
      { label: "Careers Landing", path: "/admin/careers-landing", icon: Settings },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "FAQs", path: "/admin/faqs", icon: MessageSquareText },
      { label: "Newsletter", path: "/admin/newsletter", icon: Mail },
      { label: "Page SEO", path: "/admin/page-seo", icon: Globe },
    ],
  },
  {
    title: "Inbox",
    items: [{ label: "Contacts", path: "/admin/contacts", icon: Contact }],
  },
];

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-400 relative border-r border-slate-800">
      <div className="px-6 py-6 flex items-center justify-between shrink-0 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-55 transition-opacity" />
            <img src={logo} alt="TechVistar" className="h-9 w-9 rounded-xl object-cover border border-slate-700 relative z-10" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">TechVistar</p>
            <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight font-display">Workspace</h2>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="xl:hidden p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors">
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{group.title}</div>
            <nav className="space-y-1">
              {group.items.map(({ label, path, icon: Icon }) => {
                const isActive =
                  location.pathname === path ||
                  (path !== "/admin/dashboard" && location.pathname.startsWith(path));

                return (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive ? "text-white font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-bg"
                        className="absolute inset-0 bg-slate-800/80 rounded-lg border border-slate-700/50"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md transition-all duration-300 ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-transparent text-slate-400 group-hover:text-slate-200 group-hover:scale-105"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="relative z-10">{label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-sm">
                <div className="h-full w-full rounded-full border border-slate-900 overflow-hidden bg-white">
                  <img src={logo} alt="Admin" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">Admin User</p>
              <p className="text-[10px] font-semibold text-slate-500 truncate">Super Admin</p>
            </div>
          </div>
          <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
