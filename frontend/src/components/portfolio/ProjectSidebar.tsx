import { Link } from 'react-router-dom';
import { Calendar, Briefcase, User, Building2, Tag } from 'lucide-react';
import { Project } from '@/data/projects';
import { INDUSTRIES } from '@/data/industries';

interface SectionProps {
  project: Project;
}

export const ProjectSidebar = ({ project }: SectionProps) => {
  const matchingIndustries = INDUSTRIES.filter(
    (ind) =>
      ind.caseStudies.includes(project.slug) ||
      ind.title.toLowerCase() === project.industry.toLowerCase() ||
      ind.id.toLowerCase() === project.industry.toLowerCase()
  );

  const formattedDate = project.date
    ? new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '';

  return (
    <div
      className="space-y-6 lg:sticky"
      style={{ top: 'calc(var(--primary-nav-height, 80px) + var(--secondary-nav-height, 48px) + 16px)' }}
    >
      <div className="bg-white border-2 border-emerald-500/20 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-emerald-500/[0.03] blur-xl pointer-events-none" />

        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 font-display">
          Project Metadata
        </h3>

        <div className="space-y-5">
          {project.client && (
            <div className="flex gap-4 items-start text-xs">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Client</p>
                <p className="text-slate-600 font-medium mt-0.5">{project.client}</p>
              </div>
            </div>
          )}

          {project.role && (
            <div className="flex gap-4 items-start text-xs">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Role</p>
                <p className="text-slate-600 font-medium mt-0.5">{project.role}</p>
              </div>
            </div>
          )}

          {formattedDate && (
            <div className="flex gap-4 items-start text-xs">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Completed</p>
                <p className="text-slate-600 font-medium mt-0.5">{formattedDate}</p>
              </div>
            </div>
          )}

          {matchingIndustries.length > 0 && (
            <div className="flex gap-4 items-start text-xs">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Industry</p>
                <p className="text-slate-600 font-medium mt-0.5">
                  {matchingIndustries.map((ind, idx) => (
                    <span key={ind.id}>
                      {idx > 0 && ', '}
                      <Link to={`/industries/${ind.slug}`} className="text-primary hover:underline font-medium">
                        {ind.title}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}
        </div>

        {project.tags?.length > 0 && (
          <>
            <hr className="border-slate-100" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;
