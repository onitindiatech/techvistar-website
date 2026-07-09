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
  Sparkles,
  Wrench,
  X,
  LogOut,
  Settings,
  Building,
  Globe,
} from "lucide-react";
import logo from "../../../assets/logo.webp";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Services", path: "/admin/services", icon: Wrench },
  { label: "Services Settings", path: "/admin/services-settings", icon: Settings },
  { label: "Page SEO", path: "/admin/page-seo", icon: Globe },
  { label: "Industries", path: "/admin/industries", icon: Building },
  { label: "Solutions", path: "/admin/solutions", icon: Shapes },
  { label: "Portfolio", path: "/admin/portfolio", icon: Package },
  { label: "FAQs", path: "/admin/faqs", icon: MessageSquareText },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Applications", path: "/admin/applications", icon: FileText },
  { label: "Contacts", path: "/admin/contacts", icon: Contact },
  { label: "Newsletter", path: "/admin/newsletter", icon: Mail },
];

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-transparent relative">
      {/* Header */}
      <div className="px-6 py-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <img src={logo} alt="TechVistar" className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/50 relative z-10" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">TechVistar</p>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight font-display">Workspace</h2>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="xl:hidden p-2 text-slate-400 hover:text-slate-700 bg-slate-100/50 hover:bg-slate-200/50 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-24">
        <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Main Menu</div>
        <nav className="space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path || (path !== "/admin/dashboard" && location.pathname.startsWith(path));

            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-emerald-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 bg-emerald-50/80 rounded-xl border border-emerald-100/50 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-white text-emerald-600 shadow-sm' : 'bg-transparent text-slate-400 group-hover:text-slate-700 group-hover:scale-110'
                }`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="relative z-10">{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Fixed Bottom Profile */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/50 shrink-0">
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-sm">
                <div className="h-full w-full rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src={logo} alt="Admin" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">Admin User</p>
              <p className="text-[11px] font-semibold text-slate-500 truncate">Super Admin</p>
            </div>
          </div>
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
