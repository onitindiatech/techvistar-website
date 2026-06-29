import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideIcon } from 'lucide-react';

interface FilterPillProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  icon: LucideIcon;
  formatOption?: (opt: string) => string;
}

export const FilterPill = ({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  formatOption = (opt) => opt,
}: FilterPillProps) => {
  return (
    <div className="flex flex-col gap-1 shrink-0">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 transition-all shadow-sm rounded-lg h-9 px-4 text-xs font-medium inline-flex items-center gap-2 focus:ring-1 focus:ring-primary/20 focus:outline-none">
          <Icon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-500 mr-0.5">{label}:</span>
          <SelectValue placeholder={label} className="text-slate-800" />
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-xl border border-slate-200 bg-white text-slate-800 max-h-64">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-xs text-slate-600 focus:bg-slate-50 cursor-pointer">
              {option === 'All' ? `All ${label}s` : formatOption(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export default FilterPill;
