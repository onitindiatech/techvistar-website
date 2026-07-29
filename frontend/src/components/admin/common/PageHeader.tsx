import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

type PageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const PageHeader = ({ title, description, actionLabel, onAction }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-display text-heading-md text-slate-900 sm:text-heading-lg">{title}</h1>
        <p className="text-body-sm font-medium text-slate-500">{description}</p>
      </div>

      {actionLabel ? (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onAction} className="h-10 px-5 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-button font-bold rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] transition-all">
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
};

export default PageHeader;
