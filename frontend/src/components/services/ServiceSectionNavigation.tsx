import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
}

const baseNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'offerings', label: 'Offerings' },
  { id: 'process', label: 'Process' },
  { id: 'technology', label: 'Technology' },
];

interface ServiceSectionNavigationProps {
  showFaq?: boolean;
}

export const ServiceSectionNavigation = ({ showFaq = false }: ServiceSectionNavigationProps) => {
  const navItems: NavItem[] = [
    ...baseNavItems,
    ...(showFaq ? [{ id: 'faq', label: 'FAQ' }] : []),
    { id: 'contact', label: 'Contact' },
  ];
  const [activeId, setActiveId] = useState<string>('overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const subnavRef = useRef<HTMLElement>(null);
  const [primaryHeight, setPrimaryHeight] = useState(() => {
    return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--primary-nav-height') || '80',
      10
    );
  });

  useEffect(() => {
    const subnav = subnavRef.current;
    if (!subnav) return;

    const updateHeights = () => {
      const primaryVal = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--primary-nav-height') || '80',
        10
      );
      setPrimaryHeight(primaryVal);
      
      const secondaryVal = subnav.offsetHeight;
      document.documentElement.style.setProperty('--secondary-nav-height', `${secondaryVal}px`);
    };

    updateHeights();

    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });
    resizeObserver.observe(subnav);

    const handleHeightChange = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setPrimaryHeight(customEvent.detail);
    };

    window.addEventListener('resize', updateHeights);
    window.addEventListener('primary-nav-height-change', handleHeightChange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeights);
      window.removeEventListener('primary-nav-height-change', handleHeightChange);
    };
  }, []);

  useEffect(() => {
    const subnavH = subnavRef.current?.offsetHeight || 48;
    // Configure intersection observer to watch for sections entering/leaving view
    const observerOptions = {
      root: null, // viewport
      rootMargin: `-${primaryHeight + subnavH + 12}px 0px -60% 0px`, // trigger active states when scrolled past the combined navbar height
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
  }, [showFaq, primaryHeight]);

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
      const subnavH = subnavRef.current?.offsetHeight || 48;
      const offset = primaryHeight + subnavH + 16;
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
    <nav ref={subnavRef} className="sticky z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm w-full transition-all duration-300" style={{ top: 'var(--primary-nav-height, 80px)' }}>
      <div className="w-full mx-auto px-4 md:px-6 lg:px-12 xl:px-20 detail-page-gutter">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-none items-center py-2.5 md:py-3 gap-4 md:gap-8 whitespace-nowrap scroll-smooth -mx-1 px-1"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={handleNavClick(item.id)}
              data-active={activeId === item.id}
              className={cn(
                'text-xs font-semibold uppercase tracking-wider pb-1 px-2 transition-all border-b-2 focus:outline-none mobile-touch-target shrink-0',
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
export default ServiceSectionNavigation;
