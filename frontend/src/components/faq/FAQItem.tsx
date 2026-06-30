import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FAQ } from '@/data';
import { useToast } from '@/hooks/use-toast';

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => {
  const { toast } = useToast();

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${faq.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Direct link to this question has been copied to your clipboard.",
    });
  };

  return (
    <div
      id={faq.id}
      className={cn(
        "group rounded-2xl border transition-all duration-300 bg-white/95 overflow-hidden",
        isOpen
          ? "border-emerald-500/40 shadow-[0_12px_24px_rgba(16,185,129,0.04)] bg-emerald-500/[0.01]"
          : "border-slate-200/80 shadow-sm hover:border-slate-300"
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${faq.id}`}
        className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
      >
        <span className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-primary transition-colors pr-4">
          {faq.question}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
            title="Copy link to this question"
            aria-label={`Copy link to question: ${faq.question}`}
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all duration-300 border border-slate-100",
              isOpen && "bg-emerald-50 border-emerald-100 text-emerald-600 rotate-180"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${faq.id}`}
            role="region"
            aria-label={faq.question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="border-t border-slate-100 p-5 sm:p-6 bg-slate-50/50">
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-semibold">
                {faq.answer}
              </p>
              {faq.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {faq.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono text-[9px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FAQItem;
