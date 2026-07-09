import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'process', label: 'Process' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'tech-stack', label: 'Tech Stack' },
];

export const SolutionSectionNavigation = () => {
  const [activeId, setActiveId] = useState<string>('overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configure intersection observer to watch for sections entering/leaving view
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-140px 0px -60% 0px', // trigger active states when scrolled past the combined navbar height
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe each target section element
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Smooth scroll center active tab on mobile horizontally
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeButton) {
        const container = scrollContainerRef.current;
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const scrollLeft = 
          activeButton.getBoundingClientRect().left - 
          containerRect.left - 
          containerRect.width / 2 + 
          buttonRect.width / 2;

        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeId]);

  const handleNavClick = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for smooth scroll to keep target visible below main and sub navbar
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="sticky top-12 sm:top-14 md:top-[4.25rem] z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm w-full transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-none items-center py-3 gap-6 md:gap-8 whitespace-nowrap scroll-smooth"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={handleNavClick(item.id)}
              data-active={activeId === item.id}
              className={cn(
                'text-xs font-semibold uppercase tracking-wider pb-1 transition-all border-b-2 focus:outline-none',
                activeId === item.id
                  ? 'border-primary text-primary font-bold animate-pulse-subtle'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default SolutionSectionNavigation;
