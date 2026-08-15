import { Sparkles } from 'lucide-react';
import { Project } from '@/data/projects';

interface SectionProps {
  project: Project;
}

export const ProjectGallerySection = ({ project }: SectionProps) => {
  if (!project.gallery?.length) return null;

  return (
    <section
      id="gallery"
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="font-display text-heading-sm text-slate-900">Project Gallery</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {project.gallery.map((img, i) => (
          <div
            key={`${img}-${i}`}
            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-500/20 hover:shadow-[0_15px_35px_-8px_rgba(14,165,233,0.12)]"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-50">
              <img
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
