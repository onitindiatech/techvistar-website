import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-emerald-500/30 selection:text-emerald-900 relative overflow-hidden">
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.3]" />
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[150px]" />
      </div>

      <div className="flex min-h-screen relative z-10">
        <aside className="hidden w-[280px] shrink-0 xl:block bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
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
                className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-white/95 backdrop-blur-xl shadow-2xl xl:hidden flex flex-col border-r border-slate-200/50"
              >
                <Sidebar onClose={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-h-screen flex-1 flex-col relative z-10 w-full overflow-x-hidden">
          <TopNavbar onOpenSidebar={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-y-auto custom-scrollbar">
             <div className="mx-auto w-full max-w-[1400px] relative z-10">
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
    </div>
  );
};

export default AdminLayout;
