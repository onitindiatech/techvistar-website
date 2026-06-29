import { useState, useMemo } from 'react';
import { PROJECTS, Project } from '../data/projects';

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'recently-updated';

// Helper to map slugs to human readable service names
export const SERVICE_MAP: Record<string, string> = {
  'web-development': 'Web Development',
  'custom-software-development': 'Custom Software',
  'digital-marketing': 'Digital Marketing',
  'ai-automation': 'AI & Automation',
  'mobile-app-development': 'Mobile Development',
  'cloud-devops': 'Cloud & DevOps',
};

export const useProjectFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // 1. Extract dynamic filter options from PROJECTS dataset
  const industries = useMemo(() => {
    const list = new Set(PROJECTS.map((p) => p.industry).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, []);

  const services = useMemo(() => {
    const list = new Set<string>();
    PROJECTS.forEach((p) => {
      if (p.serviceSlugs) {
        p.serviceSlugs.forEach((slug) => list.add(slug));
      }
    });
    return ['All', ...Array.from(list)];
  }, []);

  const technologies = useMemo(() => {
    const list = new Set<string>();
    PROJECTS.forEach((p) => {
      if (p.technologies) {
        p.technologies.forEach((tech) => list.add(tech));
      }
    });
    return ['All', ...Array.from(list)];
  }, []);

  const statuses = useMemo(() => {
    const list = new Set(PROJECTS.map((p) => p.status).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, []);

  // 2. Clear all active filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedService('All');
    setSelectedTechnology('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  const activeFilterChips = useMemo(() => {
    const chips: { type: string; label: string; value: string; onRemove: () => void }[] = [];
    if (selectedIndustry !== 'All') {
      chips.push({
        type: 'industry',
        label: `Industry: ${selectedIndustry}`,
        value: selectedIndustry,
        onRemove: () => setSelectedIndustry('All'),
      });
    }
    if (selectedService !== 'All') {
      chips.push({
        type: 'service',
        label: `Expertise: ${SERVICE_MAP[selectedService] || selectedService}`,
        value: selectedService,
        onRemove: () => setSelectedService('All'),
      });
    }
    if (selectedTechnology !== 'All') {
      chips.push({
        type: 'technology',
        label: `Tech: ${selectedTechnology}`,
        value: selectedTechnology,
        onRemove: () => setSelectedTechnology('All'),
      });
    }
    if (selectedStatus !== 'All') {
      chips.push({
        type: 'status',
        label: `Status: ${selectedStatus}`,
        value: selectedStatus,
        onRemove: () => setSelectedStatus('All'),
      });
    }
    return chips;
  }, [selectedIndustry, selectedService, selectedTechnology, selectedStatus]);

  // 3. Perform filtering and sorting
  const filteredProjects = useMemo(() => {
    let result = [...PROJECTS];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          p.technologies.some((tech) => tech.toLowerCase().includes(query))
      );
    }

    // Industry filter
    if (selectedIndustry !== 'All') {
      result = result.filter((p) => p.industry === selectedIndustry);
    }

    // Service / Expertise filter
    if (selectedService !== 'All') {
      result = result.filter((p) => p.serviceSlugs && p.serviceSlugs.includes(selectedService));
    }

    // Technology filter
    if (selectedTechnology !== 'All') {
      result = result.filter((p) => p.technologies && p.technologies.includes(selectedTechnology));
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((p) => p.status === selectedStatus);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'recently-updated':
          const dateA = a.updatedDate ? new Date(a.updatedDate).getTime() : new Date(a.date).getTime();
          const dateB = b.updatedDate ? new Date(b.updatedDate).getTime() : new Date(b.date).getTime();
          return dateB - dateA;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedIndustry, selectedService, selectedTechnology, selectedStatus, sortBy]);

  return {
    filteredProjects,
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
  };
};
