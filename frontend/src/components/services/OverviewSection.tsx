import { Service } from '@/data/services';
import { Brain, Lightbulb } from 'lucide-react';
import '../ui/GlassIcons.css';
import { RichTextContent } from '@/components/common/RichTextContent';
import { OverviewIllustration } from './OverviewIllustration';

interface SectionProps {
  service: Service;
}

export const OverviewSection = ({ service }: SectionProps) => {
  const IconComponent = service.icon || Brain;

  return (
    <section id="overview" className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 scroll-mt-24 shadow-sm relative overflow-hidden">
      
      {/* Light mesh grid backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="overview-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#overview-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Content Column */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Header with 3D GlassIcon Wrapper */}
          <div className="flex items-center gap-4">
            <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
              <span className="icon-btn__back" style={{ background: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))' }}></span>
              <span className="icon-btn__front">
                <span className="icon-btn__icon">
                  <IconComponent className="w-6 h-6 text-white" />
                </span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Overview</h2>
          </div>

          {/* Decorative bar */}
          <div className="w-12 h-1 bg-emerald-500 rounded-full" />

          {/* Description */}
          <RichTextContent
            content={service.longDescription}
            className="text-slate-600 text-sm md:text-sm leading-relaxed"
          />

          {/* Key Insight callout box */}
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex gap-4 items-start transition-all duration-300 hover:bg-emerald-50/80">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100">
              <Lightbulb className="h-5 w-5 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800 mb-0.5">Key Insight</div>
              <RichTextContent
                content={service.overview}
                className="text-xs text-emerald-700/90 leading-relaxed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Dashboard Image Column */}
        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative group/image w-full">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 opacity-75 blur-xl group-hover/image:opacity-100 transition duration-300 pointer-events-none" />
            <div className="relative z-10 w-full transition-transform duration-300 group-hover/image:scale-[1.03]">
              <img 
                src={service.dashboardImage || service.coverImage} 
                alt={`${service.title} overview`} 
                className="w-full h-auto max-h-[300px] object-contain rounded-2xl drop-shadow-xl" 
                style={{ animation: 'float3d 4s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverviewSection;
