import React from 'react';
import { Search, X } from 'lucide-react';

interface FAQSearchProps {
  query: string;
  setQuery: (query: string) => void;
}

export const FAQSearch = ({ query, setQuery }: FAQSearchProps) => {
  return (
    <div className="relative max-w-xl mx-auto w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions or keywords..."
        className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 bg-white/90 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search query"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
export default FAQSearch;
