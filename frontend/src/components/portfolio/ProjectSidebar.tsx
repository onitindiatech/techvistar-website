import { Link } from 'react-router-dom';
import { Calendar, Briefcase, User, Building2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
      <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl" />

        <h3 className="border-b border-slate-100 pb-3 font-display text-xs font-black uppercase tracking-wider text-slate-900">
          Project Metadata
        </h3>

        <div className="space-y-5">
          {project.client && (
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Client</p>
                <p className="mt-0.5 text-slate-500">{project.client}</p>
              </div>
            </div>
          )}

          {project.role && (
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Role</p>
                <p className="mt-0.5 text-slate-500">{project.role}</p>
              </div>
            </div>
          )}

          {formattedDate && (
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Completed</p>
                <p className="mt-0.5 text-slate-500">{formattedDate}</p>
              </div>
            </div>
          )}

          {matchingIndustries.length > 0 && (
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Industry</p>
                <p className="mt-0.5 text-slate-500">
                  {matchingIndustries.map((ind, idx) => (
                    <span key={ind.id}>
                      {idx > 0 && ', '}
                      <Link to={`/industries/${ind.slug}`} className="font-medium text-primary hover:underline">
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
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            asChild
            className="h-10 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
          >
            <Link to="/contact">More Information</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
