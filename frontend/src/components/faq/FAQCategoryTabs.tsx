import React from 'react';
import { cn } from '@/lib/utils';

interface FAQCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  counts: Record<string, number>;
}

export const FAQCategoryTabs = ({
  categories,
  activeCategory,
  setActiveCategory,
  counts,
}: FAQCategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm",
            activeCategory === category
              ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <span>{category}</span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-mono",
              activeCategory === category
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
            )}
          >
            {counts[category] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};
export default FAQCategoryTabs;
