import { useEffect, useMemo, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
}

const baseNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'offerings', label: 'Offerings' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'process', label: 'Process' },
  { id: 'technology', label: 'Technology' },
  { id: 'faq', label: 'FAQ' },
  { id: 'related', label: 'Related' },
  { id: 'contact', label: 'Contact' },
];

interface ServiceSectionNavigationProps {
  showFaq?: boolean;
  showBenefits?: boolean;
  showRelated?: boolean;
}

export const ServiceSectionNavigation = ({
  showFaq = false,
  showBenefits = false,
  showRelated = true,
}: ServiceSectionNavigationProps) => {
  const navItems = useMemo(
    () =>
      baseNavItems.filter((item) => {
        if (item.id === 'faq' && !showFaq) return false;
        if (item.id === 'benefits' && !showBenefits) return false;
        if (item.id === 'related' && !showRelated) return false;
        return true;
      }),
    [showFaq, showBenefits, showRelated]
  );

  const [activeId, setActiveId] = useState<string>('overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-140px 0px -60% 0px',
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

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navItems]);

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
        container.scrollTo({ left: container.scrollLeft + scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeId]);

  const handleNavClick = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-12 z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-300 sm:top-14 md:top-[4.25rem]">
      <div className="container mx-auto max-w-6xl px-4">
        <div
          ref={scrollContainerRef}
          className="scrollbar-none flex items-center gap-5 overflow-x-auto whitespace-nowrap py-3.5 scroll-smooth md:gap-8"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={handleNavClick(item.id)}
              data-active={activeId === item.id}
              className={cn(
                'border-b-2 pb-1 text-[11px] font-bold uppercase tracking-wider transition-all focus:outline-none',
                activeId === item.id
                  ? 'border-emerald-600 text-emerald-600'
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

export default ServiceSectionNavigation;
