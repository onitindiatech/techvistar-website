import { useState } from 'react';
import { Service } from '@/data/services';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RichTextContent } from '@/components/common/RichTextContent';

interface SectionProps {
  service: Service;
}

export const FAQSection = ({ service }: SectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!service.faqs || service.faqs.length === 0) return null;

  return (
    <section id="faq" className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      
      {/* Light mesh backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="faq-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#faq-mesh)" />
        </svg>
      </div>

      <h2 className="relative z-10 mb-6 font-display text-heading-sm text-slate-900">
        Frequently Asked Questions
      </h2>

      {/* Accordion Wrapper */}
      <div className="relative z-10 space-y-3.5">
        {service.faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen 
                  ? 'border-emerald-500/30 bg-emerald-500/[0.02] shadow-[0_8px_20px_-8px_rgba(16,185,129,0.06)]' 
                  : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-500/10'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left font-bold text-xs md:text-sm text-slate-800 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`h-4.5 w-4.5 shrink-0 transition-colors duration-300 ${
                    isOpen ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                  <span>{faq.question}</span>
                </div>
                
                {/* Rotating chevron */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="shrink-0"
                >
                  <ChevronDown className={`h-4.5 w-4.5 transition-colors duration-300 ${
                    isOpen ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </motion.div>
              </button>

              {/* Animate height expansion using AnimatePresence */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs md:text-xs text-slate-500 leading-relaxed border-t border-slate-100/50">
                      <RichTextContent content={faq.answer} className="text-xs md:text-xs text-slate-500 leading-relaxed" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default FAQSection;
