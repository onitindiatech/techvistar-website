import { motion } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Service } from '@/data/services';

interface SectionProps {
  service: Service;
}

export const BenefitsSection = ({ service }: SectionProps) => {
  const benefits = service.benefits?.filter(Boolean) ?? [];
  const whyChooseUs = service.whyChooseUs?.filter((item) => item.title?.trim()) ?? [];

  if (benefits.length === 0 && whyChooseUs.length === 0) return null;

  return (
    <section
      id="benefits"
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-10"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/[0.04] blur-3xl" />

      <div className="relative z-10 mb-8 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900">Benefits &amp; Features</h2>
      </div>

      {benefits.length > 0 && (
        <div className="relative z-10 mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.12)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-700">{benefit}</p>
            </motion.div>
          ))}
        </div>
      )}

      {whyChooseUs.length > 0 && (
        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {whyChooseUs.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-5 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.1)]"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="mb-1.5 font-display text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs font-medium leading-relaxed text-slate-500">{item.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BenefitsSection;
