import { Button } from '@/components/ui/button';
import { Clock, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { SolutionDetail } from '@/data/solutions';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig } from '@/types/pagesCms';
import { resolveSupportEmail, siteMailto } from '@/lib/siteContact';

interface SolutionSidebarProps {
  solution: SolutionDetail;
}

export const SolutionSidebar = ({ solution }: SolutionSidebarProps) => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });
  const websiteSettings = mergePagesCmsConfig(pagesConfig).websiteSettings;
  const inquiryEmail = resolveSupportEmail(websiteSettings);
  const mailtoHref = siteMailto(inquiryEmail, `Consultation — ${solution.title}`);

  return (
    <div
      className="space-y-6 lg:sticky"
      style={{ top: 'calc(var(--primary-nav-height, 80px) + var(--secondary-nav-height, 48px) + 16px)' }}
    >
      <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl" />

        <h3 className="border-b border-slate-100 pb-3 font-display text-xs font-black uppercase tracking-wider text-slate-900">
          Consultation Summary
        </h3>

        <div className="space-y-5">
          <div className="flex items-start gap-4 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Average Response Time</p>
              <p className="mt-0.5 text-slate-500">&lt; 4 Hours (Within Business Days)</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Business Hours</p>
              <p className="mt-0.5 text-slate-500">Monday – Friday, 9:00 AM – 6:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Secure Consultation</p>
              <p className="mt-0.5 text-slate-500">All SOW outlines and documentation covered by NDA.</p>
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            asChild
            className="h-10 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
          >
            <Link to="/contact">Book Free Session</Link>
          </Button>
        </motion.div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 p-6 text-white shadow-md">
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-emerald-500/[0.08] blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-emerald-400">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <div className="font-display text-xs font-black uppercase tracking-wider text-slate-300">
              Direct Inquiries
            </div>
          </div>

          <p className="text-[11px] font-medium leading-relaxed text-slate-400">
            Have an SOW ready or need instant escalation? Contact our lead architect directly at:
          </p>

          <div className="border-t border-slate-800/80 pt-2">
            <a
              href={mailtoHref}
              className="text-xs font-bold text-emerald-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-emerald-300"
            >
              {inquiryEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSidebar;
