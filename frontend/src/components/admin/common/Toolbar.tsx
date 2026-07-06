import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ToolbarProps = {
  placeholder?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const Toolbar = ({ placeholder = "Search", actionLabel, onAction }: ToolbarProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:justify-between">
      <div className="relative group sm:w-80">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
        </div>
        <Input
          className="pl-10 h-10 border-slate-200 bg-slate-50 focus-visible:ring-emerald-500 rounded-xl text-sm transition-all"
          placeholder={placeholder}
        />
      </div>

      <div className="flex items-center gap-3">
        {actionLabel ? (
          <Button onClick={onAction} variant="outline" className="h-10 px-4 gap-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-semibold shadow-sm transition-all">
            <SlidersHorizontal className="h-4 w-4" />
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Toolbar;
