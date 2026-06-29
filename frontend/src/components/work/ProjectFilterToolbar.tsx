import { useProjectFilters, SortOption, SERVICE_MAP } from '@/hooks/useProjectFilters';
import { FilterPill } from './FilterPill';
import { ActiveFilterChips } from './ActiveFilterChips';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, Layers, Cpu, Activity, ArrowUpDown } from 'lucide-react';

interface ProjectFilterToolbarProps {
  filterHook: ReturnType<typeof useProjectFilters>;
}

export const ProjectFilterToolbar = ({ filterHook }: ProjectFilterToolbarProps) => {
  const {
    industries,
    services,
    technologies,
    statuses,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry,
    selectedService,
    setSelectedService,
    selectedTechnology,
    setSelectedTechnology,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    clearAllFilters,
    activeFilterChips,
    filteredProjects,
  } = filterHook;

  const formatServiceOption = (slug: string) => SERVICE_MAP[slug] || slug;

  return (
    <div className="bg-white border border-slate-250/60 rounded-2xl p-6 shadow-[0_12px_40px_rgba(15,23,42,0.03)] space-y-5">
      
      {/* Row 1: Header (Left) and Search Input (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Side: Dynamic Counts & Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
              Case Studies
            </h2>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded select-none">
              {filteredProjects.length} Projects
            </span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
            Explore our work across industries, technologies, and business domains.
          </p>
        </div>

        {/* Right Side: Search Input with glassmorphism styling */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-12 bg-white border-slate-200 hover:border-slate-300 focus:bg-white text-slate-800 text-xs h-9 rounded-lg focus-visible:ring-primary/20 focus-visible:ring-1"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded select-none pointer-events-none">
            ⌘K
          </span>
        </div>

      </div>

      {/* Row 2: Filter Pills wrapping container (ensures zero horizontal overflow) */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2.5 items-center w-full">
        <FilterPill
          label="Industry"
          value={selectedIndustry}
          options={industries}
          onChange={setSelectedIndustry}
          icon={Briefcase}
        />
        <FilterPill
          label="Service"
          value={selectedService}
          options={services}
          onChange={setSelectedService}
          icon={Layers}
          formatOption={formatServiceOption}
        />
        <FilterPill
          label="Technology"
          value={selectedTechnology}
          options={technologies}
          onChange={setSelectedTechnology}
          icon={Cpu}
        />
        <FilterPill
          label="Status"
          value={selectedStatus}
          options={statuses}
          onChange={setSelectedStatus}
          icon={Activity}
        />
        <FilterPill
          label="Sort"
          value={sortBy}
          options={['newest', 'oldest', 'a-z', 'recently-updated']}
          onChange={(val) => setSortBy(val as SortOption)}
          icon={ArrowUpDown}
          formatOption={(opt) => {
            if (opt === 'newest') return 'Newest First';
            if (opt === 'oldest') return 'Oldest First';
            if (opt === 'a-z') return 'Alphabetical (A-Z)';
            return 'Recently Updated';
          }}
        />
      </div>

      {/* Active Chips List */}
      <ActiveFilterChips chips={activeFilterChips} onClearAll={clearAllFilters} />
      
    </div>
  );
};
export default ProjectFilterToolbar;
