import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActiveFilterChipsProps {
  chips: { type: string; label: string; value: string; onRemove: () => void }[];
  onClearAll: () => void;
}

export const ActiveFilterChips = ({ chips, onClearAll }: ActiveFilterChipsProps) => {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5 py-4 border-t border-slate-100 mt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1 select-none">
        ACTIVE FILTERS:
      </span>
      
      <div className="flex flex-wrap gap-2 items-center">
        <AnimatePresence mode="popLayout">
          {chips.map((chip) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none rounded-full pl-2.5 pr-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm select-none"
                onClick={chip.onRemove}
              >
                {chip.label}
                <span className="h-3.5 w-3.5 rounded-full hover:bg-slate-200 flex items-center justify-center shrink-0">
                  <X className="h-2.5 w-2.5 text-slate-400 hover:text-slate-600" />
                </span>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={onClearAll}
            className="text-[10px] font-bold text-primary hover:text-primary/90 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-primary/5 transition-colors focus:outline-none"
          >
            <RotateCcw className="h-3 w-3 text-primary" />
            Clear All
          </button>
        </motion.div>
      </div>
    </div>
  );
};
export default ActiveFilterChips;
