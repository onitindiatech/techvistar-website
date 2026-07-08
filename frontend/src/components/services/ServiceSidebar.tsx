import { Button } from '@/components/ui/button';
import { Clock, Calendar, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Service } from '@/data/services';
import { ConsultationForm } from './ConsultationForm';
import {
  ServicesCmsConfig,
  mergeSidebarBlock,
  mergeConsultationBlock,
} from '@/types/servicesCms';

interface ServiceSidebarProps {
  service: Service;
  cmsConfig: ServicesCmsConfig;
}

export const ServiceSidebar = ({ service, cmsConfig }: ServiceSidebarProps) => {
  const sidebar = mergeSidebarBlock(cmsConfig.sidebarDefaults, service.sidebar);
  const consultation = mergeConsultationBlock(
    cmsConfig.consultationDefaults,
    service.consultationForm
  );

  const mailtoHref = `mailto:${sidebar.contactEmail}?subject=${encodeURIComponent(
    `Consultation — ${service.title}`
  )}`;

  return (
    <div className="lg:sticky lg:top-36 space-y-6">
      <div
        id="inquiry-form-card"
        className="bg-white border-2 border-emerald-500/20 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-emerald-500/[0.03] blur-xl pointer-events-none" />

        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 font-display">
          {sidebar.summaryTitle}
        </h3>

        <div className="space-y-5">
          <div className="flex gap-4 items-start text-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{sidebar.responseTimeTitle}</p>
              <p className="text-slate-500 mt-0.5">{sidebar.responseTime}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start text-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{sidebar.businessHoursTitle}</p>
              <p className="text-slate-500 mt-0.5">{sidebar.businessHours}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start text-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{sidebar.secureTitle}</p>
              <p className="text-slate-500 mt-0.5">{sidebar.secureDescription}</p>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-all h-10">
                {sidebar.buttonLabel}
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="border-none bg-transparent shadow-none p-0 w-[calc(100%-2rem)] sm:w-full max-w-2xl">
            <ConsultationForm
              serviceTitle={service.title}
              serviceSlug={service.slug}
              formConfig={consultation}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-800/80 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full bg-emerald-500/[0.08] blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center text-emerald-400">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300 font-display">
              {sidebar.directInquiriesTitle}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            {sidebar.directInquiriesBody}
          </p>

          <div className="pt-2 border-t border-slate-800/80">
            <a
              href={mailtoHref}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-dotted underline-offset-4"
            >
              {sidebar.contactEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceSidebar;
