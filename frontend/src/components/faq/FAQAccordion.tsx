import React, { useState, useEffect } from 'react';
import { FAQItem } from './FAQItem';
import { FAQ } from '@/data';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQAccordionProps {
  faqs: FAQ[];
}

export const FAQAccordion = ({ faqs }: FAQAccordionProps) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // Automatically expand if a hash matches an item ID
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && faqs.some(faq => faq.id === hash)) {
      setOpenIds(new Set([hash]));
    }
  }, [faqs]);

  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(faqs.map((faq) => faq.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  if (faqs.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
        <p className="text-slate-500 font-semibold text-sm">No matching questions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Global Controls */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={expandAll}
          disabled={openIds.size === faqs.length}
          className="text-xs h-8 font-bold border-slate-200 hover:bg-slate-50"
        >
          <ChevronDown className="h-3.5 w-3.5 mr-1" />
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={collapseAll}
          disabled={openIds.size === 0}
          className="text-xs h-8 font-bold border-slate-200 hover:bg-slate-50"
        >
          <ChevronUp className="h-3.5 w-3.5 mr-1" />
          Collapse All
        </Button>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openIds.has(faq.id)}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
};
export default FAQAccordion;
