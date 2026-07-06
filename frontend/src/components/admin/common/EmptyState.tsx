import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/50 px-6 py-20 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.08)] border border-emerald-50/50 mb-5 relative z-10">
        <Inbox className="h-7 w-7" />
      </div>
      
      <h3 className="text-xl font-extrabold text-slate-900 font-display relative z-10">{title}</h3>
      <p className="mt-2.5 max-w-sm text-sm font-medium text-slate-500 leading-relaxed relative z-10">{description}</p>
      
      {actionLabel ? (
        <motion.div whileHover={{ y: -2 }} className="mt-8 relative z-10">
          <Button onClick={onAction} className="h-10 px-5 gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all font-semibold">
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Button>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default EmptyState;
