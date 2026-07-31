import { Link } from 'react-router-dom';
import { Industry } from '@/data/industries';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ShieldCheck, Headphones, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ConsultationForm } from '@/components/services/ConsultationForm';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import {
  IndustriesLandingCmsConfig,
  DEFAULT_INDUSTRIES_LANDING_CMS,
  mergePagesCmsConfig,
} from '@/types/pagesCms';
import {
  mergeConsultationBlock,
  mergeSidebarBlock,
} from '@/types/industriesCms';
import { useQuery } from '@tanstack/react-query';
import { getPublicPagesConfig } from '@/services/pages.service';
import { resolveSupportEmail, siteMailto } from '@/lib/siteContact';

interface IndustrySidebarProps {
  industry: Industry;
  landingCms?: IndustriesLandingCmsConfig;
}

export const IndustrySidebar = ({ industry, landingCms }: IndustrySidebarProps) => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });
  const websiteSettings = mergePagesCmsConfig(pagesConfig).websiteSettings;
  const inquiryEmail = resolveSupportEmail(websiteSettings);

  const globals = landingCms || DEFAULT_INDUSTRIES_LANDING_CMS;
  const sidebar = mergeSidebarBlock(globals.sidebarDefaults, industry.sidebar);
  const consultation = mergeConsultationBlock(
    globals.consultationDefaults,
    industry.consultationForm
  );

  const supportItems = industry.challenges?.length
    ? industry.challenges.map((item, index) => ({
        title: item.title,
        description: item.description,
        icon: [ShieldCheck, Headphones, Clock][index % 3],
      }))
    : [];

  const mailtoHref = siteMailto(
    inquiryEmail,
    `Industry Consultation — ${industry.title}`,
  );

  return (
    <div
      className="space-y-6 lg:sticky"
      style={{
        top: 'calc(var(--primary-nav-height, 80px) + var(--secondary-nav-height, 48px) + 16px)',
      }}
    >
      {/* Primary summary — ServiceSidebar visual language */}
      <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl" />

        <h3 className="border-b border-slate-100 pb-3 font-display text-xs font-black uppercase tracking-wider text-slate-900">
          {sidebar.summaryTitle}
        </h3>

        <div className="space-y-5">
          {industry.category && (
            <div className="flex items-start gap-4 text-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Category</p>
                <p className="mt-0.5 text-slate-500">{industry.category}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{sidebar.responseTimeTitle}</p>
              <p className="mt-0.5 text-slate-500">{sidebar.responseTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{sidebar.businessHoursTitle}</p>
              <p className="mt-0.5 text-slate-500">{sidebar.businessHours}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{sidebar.secureTitle}</p>
              <p className="mt-0.5 text-slate-500">{sidebar.secureDescription}</p>
            </div>
          </div>
        </div>

        {industry.statistics && industry.statistics.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 pt-5">
            {industry.statistics.slice(0, 3).map((stat, idx) => (
              <AnimatedStat
                key={idx}
                value={stat.value}
                label={stat.label}
                variant="sidebar-row"
              />
            ))}
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="h-10 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700">
                {sidebar.buttonLabel}
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="w-[calc(100%-2rem)] max-w-2xl border-none bg-transparent p-0 shadow-none sm:w-full">
            <ConsultationForm
              serviceTitle={industry.title}
              serviceSlug={industry.slug}
              formConfig={consultation}
            />
          </DialogContent>
        </Dialog>
      </div>

      {supportItems.length > 0 && (
        <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl" />

          <h3 className="border-b border-slate-100 pb-3 font-display text-xs font-black uppercase tracking-wider text-slate-900">
            {sidebar.summaryTitle}
          </h3>

          <div className="space-y-5">
            {supportItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-4 text-xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="mt-0.5 text-slate-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="h-10 w-full rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              <Link to="/contact">{sidebar.buttonLabel}</Link>
            </Button>
          </motion.div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 p-6 text-white shadow-md">
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-emerald-500/[0.08] blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-emerald-400">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <div className="font-display text-xs font-black uppercase tracking-wider text-slate-300">
              {sidebar.directInquiriesTitle}
            </div>
          </div>

          <p className="text-[11px] font-medium leading-relaxed text-slate-400">
            {sidebar.directInquiriesBody}
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

export default IndustrySidebar;
