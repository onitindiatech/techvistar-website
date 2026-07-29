import { Sparkles } from 'lucide-react';
import { Project } from '@/data/projects';

interface SectionProps {
  project: Project;
}

export const ProjectGallerySection = ({ project }: SectionProps) => {
  if (!project.gallery?.length) return null;

  return (
    <section id="gallery" className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Project Gallery</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.gallery.map((img, i) => (
          <div
            key={`${img}-${i}`}
            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-[0_15px_35px_-8px_rgba(16,185,129,0.12)] hover:border-emerald-500/20 transition-all duration-300"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-50">
              <img
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectGallerySection;
