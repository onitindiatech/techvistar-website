import { Bell, Search, Menu, LogOut, Command, MessageSquare, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getCurrentAdmin, logoutAdmin } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "../../../assets/logo.webp";
import { useState } from "react";
import { motion } from "framer-motion";

type TopNavbarProps = {
  onOpenSidebar?: () => void;
};

export const TopNavbar = ({ onOpenSidebar }: TopNavbarProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data } = useQuery({ queryKey: ["auth", "me"], queryFn: getCurrentAdmin, retry: false, staleTime: 300000 });
  const [search, setSearch] = useState("");

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

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 sm:px-6 lg:px-10 h-[72px] flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex w-full items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu & Title */}
        <div className="flex items-center gap-3">
          <button className="xl:hidden p-2.5 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors" onClick={onOpenSidebar} aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-slate-800 tracking-tight hidden sm:block">Dashboard</h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 uppercase tracking-widest shadow-sm">Pro</span>
          </div>
        </div>

        {/* Right Side: Search, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Search Bar */}
          <div className="hidden md:block relative w-64 lg:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-12 h-10 bg-slate-100/50 hover:bg-slate-100 border-transparent focus-visible:bg-white focus-visible:border-emerald-500/50 focus-visible:ring-4 focus-visible:ring-emerald-500/10 rounded-xl text-sm transition-all shadow-sm"
              placeholder="Search anything..."
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 bg-white rounded-md px-1.5 py-1 shadow-sm">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-1" />

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors" title="Theme">
              <Sun className="h-5 w-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Messages">
              <MessageSquare className="h-5 w-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </motion.button>
          </div>

          {/* Logout Button */}
          <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex h-10 px-4 ml-2 gap-2 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all shadow-sm font-bold text-xs">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
