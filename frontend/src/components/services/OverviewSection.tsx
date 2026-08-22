import { Service } from '@/data/services';
import { Brain, Lightbulb } from 'lucide-react';
import '../ui/GlassIcons.css';
import { RichTextContent } from '@/components/common/RichTextContent';
import { TechStackLogo } from '@/components/common/TechStackLogo';
import { getTechBrandStyle } from '@/lib/techStackLogos';

import { getServiceHeroImage, DEFAULT_SERVICE_COVER } from '@/data/services';

interface SectionProps {
  service: Service;
}

export const OverviewSection = ({ service }: SectionProps) => {
  const IconComponent = service.icon || Brain;
  const technologies = service.technologies ?? [];

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
              <span className="icon-btn__back" style={{ background: 'linear-gradient(135deg, #041a3d 0%, #0b2859 100%)' }}></span>
              <span className="icon-btn__front">
                <span className="icon-btn__icon">
                  <IconComponent className="w-6 h-6 text-white" />
                </span>
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold font-display text-slate-900 leading-snug">Overview</h2>
          </div>

          {/* Decorative bar */}
          <div className="w-12 h-1 bg-[#041a3d] rounded-full" />

          {/* Description */}
          <RichTextContent
            content={service.longDescription}
            className="text-slate-600 text-base leading-relaxed font-normal [&_p]:!text-base"
          />

          {/* Key Insight callout box */}
          {service.overview && (
            <div className="bg-blue-50/50 border border-blue-100/60 rounded-2xl p-4 flex gap-4 items-start transition-all duration-300 hover:bg-blue-50/80">
              <div className="h-10 w-10 rounded-xl bg-[#041a3d]/10 flex items-center justify-center shrink-0 border border-[#041a3d]/20">
                <Lightbulb className="h-5 w-5 text-[#041a3d] animate-pulse" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold font-display text-[#041a3d] mb-0.5 leading-snug">Key Insight</h3>
                <RichTextContent
                  content={service.overview}
                  className="text-base text-slate-700 leading-relaxed font-medium [&_p]:!text-base"
                />
              </div>
            </div>
          )}

          {/* Integrated Technologies row */}
          {technologies.length > 0 && (
            <div className="pt-2 border-t border-slate-100/80 space-y-2">
              <h3 className="text-base md:text-lg font-bold font-display text-slate-900 leading-snug">Execution Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => {
                  const style = getTechBrandStyle(tech);
                  return (
                    <span
                      key={tech}
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.borderColor,
                        color: style.textColor,
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs md:text-sm font-semibold transition-all shadow-sm"
                    >
                      <TechStackLogo name={tech} size="sm" className="h-4 w-4" />
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Dashboard Image Column */}
        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative group/image w-full">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 opacity-75 blur-xl group-hover/image:opacity-100 transition duration-300 pointer-events-none" />
            <div className="relative z-10 w-full transition-transform duration-300 group-hover/image:scale-[1.03]">
              <img 
                src={getServiceHeroImage(service)} 
                alt={`${service.title} overview`} 
                className="w-full h-auto max-h-[300px] object-contain rounded-2xl drop-shadow-xl" 
                style={{ animation: 'float3d 4s ease-in-out infinite' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== DEFAULT_SERVICE_COVER) {
                    target.src = DEFAULT_SERVICE_COVER;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverviewSection;
