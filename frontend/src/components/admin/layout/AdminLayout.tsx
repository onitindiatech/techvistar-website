import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applyAdminTheme, readStoredAdminTheme } from "@/hooks/use-admin-theme";
import { cn } from "@/lib/utils";
import { AdminGlobalSearch } from "@/components/admin/dashboard/AdminGlobalSearch";
import { DashboardRangeProvider } from "@/contexts/DashboardRangeContext";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(readStoredAdminTheme);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    applyAdminTheme(theme);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "techvistar-admin-theme") setTheme(readStoredAdminTheme());
    };
    const onTheme = () => setTheme(readStoredAdminTheme());
    window.addEventListener("storage", onStorage);
    window.addEventListener("techvistar-theme-change", onTheme);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("techvistar-theme-change", onTheme);
    };
  }, [theme]);

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden font-sans transition-colors duration-300",
        theme === "dark" &&
          "bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-100",
        theme === "blue" &&
          "bg-sky-50 text-slate-900 selection:bg-sky-500/30 selection:text-sky-900",
        theme === "light" &&
          "bg-[#fafafa] text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-900",
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300">
        <div
          className={cn(
            "absolute inset-0 opacity-[0.3] [background-size:24px_24px]",
            theme === "dark"
              ? "bg-[radial-gradient(#334155_1px,transparent_1px)]"
              : "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]",
          )}
        />
        <div
          className={cn(
            "absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]",
            theme === "blue" ? "bg-sky-400/15" : "bg-emerald-400/10",
          )}
        />
        <div
          className={cn(
            "absolute bottom-[10%] right-[-10%] h-[50%] w-[50%] rounded-full blur-[150px]",
            theme === "blue" ? "bg-blue-400/15" : "bg-teal-400/10",
          )}
        />
      </div>

      <DashboardRangeProvider>
        <div className="relative z-10 flex min-h-screen">
          <aside className="relative z-20 hidden w-[280px] shrink-0 border-r border-slate-800 bg-slate-900 xl:block">
            <Sidebar />
          </aside>

          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                  className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm xl:hidden"
                />
                <motion.div
                  key="sidebar"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col border-r border-slate-800 bg-slate-900 shadow-2xl xl:hidden"
                >
                  <Sidebar onClose={() => setMobileOpen(false)} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex min-h-screen w-full flex-1 flex-col overflow-x-hidden">
            <TopNavbar
              onOpenSidebar={() => setMobileOpen(true)}
              onOpenSearch={() => setSearchOpen(true)}
            />

            <main className="custom-scrollbar relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
              <div className="relative z-10 mx-auto w-full max-w-[1400px]">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full"
                >
                  <Outlet />
                </motion.div>
              </div>
            </main>
          </div>
        </div>

        <AdminGlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </DashboardRangeProvider>
    </div>
  );
};

export default AdminLayout;
