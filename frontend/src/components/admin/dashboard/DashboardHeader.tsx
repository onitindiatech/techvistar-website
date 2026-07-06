import { motion } from "framer-motion";
import { Plus, Calendar, Settings2 } from "lucide-react";
import { format } from "date-fns";

type DashboardHeaderProps = {
  title?: string;
  description?: string;
};

export const DashboardHeader = ({ title = "Dashboard", description = "Welcome back to TechVistar Admin Portal" }: DashboardHeaderProps) => {
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");
  
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-1">
          <Calendar className="w-4 h-4" />
          {currentDate}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
          Good Morning, Admin <span className="inline-block hover:animate-bounce origin-bottom cursor-default">👋</span>
        </h2>
        <p className="text-sm font-medium text-slate-500">{description}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 shrink-0"
      >
        <button className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 rounded-xl font-bold shadow-sm transition-all text-sm">
          <Settings2 className="w-4 h-4" />
          Customize
        </button>
        <button className="h-10 px-5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] transition-all text-sm">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </motion.div>
    </div>
  );
};

export default DashboardHeader;
