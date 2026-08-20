import { Briefcase, Lightbulb } from 'lucide-react';
import { Project } from '@/data/projects';
import { RichTextContent } from '@/components/common/RichTextContent';
import '../ui/GlassIcons.css';

interface SectionProps {
  project: Project;
}

export const ProjectOverviewSection = ({ project }: SectionProps) => {
  const coverImage = project.gallery?.[0] || project.thumbnail;
  const keyInsight = project.challenges?.[0]?.trim();

  return (
    <section
      id="overview"
      className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 scroll-mt-24 shadow-sm relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="project-overview-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#project-overview-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-5">
          <div className="flex items-center gap-4">
            <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
              <span
                className="icon-btn__back"
                style={{ background: 'linear-gradient(#041a3d, #0b2859)' }}
              />
              <span className="icon-btn__front">
                <span className="icon-btn__icon">
                  <Briefcase className="w-6 h-6 text-white" />
                </span>
              </span>
            </div>
            <h2 className="font-display text-heading-sm text-slate-900">Overview</h2>
          </div>

          <div className="w-12 h-1 bg-[#041a3d] rounded-full" />

          <RichTextContent
            content={project.longDescription}
            className="text-slate-600 text-base md:text-lg leading-relaxed font-normal"
          />

          {keyInsight && (
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start transition-all duration-300 hover:bg-blue-50/90">
              <div className="h-10 w-10 rounded-xl bg-[#041a3d]/10 flex items-center justify-center shrink-0 border border-blue-100">
                <Lightbulb className="h-5 w-5 text-[#041a3d] animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#041a3d] mb-0.5">Key Insight</div>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">{keyInsight}</p>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative group/image w-full">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#041a3d]/15 to-sky-500/15 opacity-75 blur-xl group-hover/image:opacity-100 transition duration-300 pointer-events-none" />
            <div className="relative z-10 w-full transition-transform duration-300 group-hover/image:scale-[1.03]">
              <img
                src={coverImage}
                alt={`${project.title} overview`}
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

export default ProjectOverviewSection;
