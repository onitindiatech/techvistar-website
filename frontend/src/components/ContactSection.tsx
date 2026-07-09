import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Clock, ShieldCheck, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { CONTACT_FORM } from '@/data';
import { cn } from '@/lib/utils';
import { submitContactForm } from '@/services/contact.service';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { getCmsIcon } from '@/lib/cmsIcons';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';

interface FormData {
  category: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialFormData: FormData = {
  category: '',
  budget: '',
  name: '',
  email: '',
  phone: '',
  message: '',
};

export const ContactSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const { contactCta } = useHomeCms();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!contactCta.visible) return null;

  const categories = (contactCta.categories.length > 0 ? contactCta.categories : DEFAULT_HOME_CMS.contactCta.categories)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const budgets = (contactCta.budgetOptions.length > 0 ? contactCta.budgetOptions : DEFAULT_HOME_CMS.contactCta.budgetOptions)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const steps = (contactCta.steps.length > 0 ? contactCta.steps : DEFAULT_HOME_CMS.contactCta.steps)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast({
        title: 'Selection Required',
        description: 'Please select a project category.',
        variant: 'destructive',
      });
      return;
    }
    if (!formData.budget) {
      toast({
        title: 'Selection Required',
        description: 'Please select your estimated budget range.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const serviceMapping: Record<string, string> = {
        'web': 'web-development',
        'mobile': 'mobile-development',
        'design': 'ui-ux',
        'ai': 'other',
        'software': 'other',
        'devops': 'other',
        'other': 'other'
      };

      const serviceInterested = serviceMapping[formData.category] || 'other';

      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: '', // Default to empty if not collected in this form
        serviceInterested,
        message: formData.message,
      });

      toast({
        title: CONTACT_FORM.toasts.success.title,
        description: contactCta.successMessage || CONTACT_FORM.toasts.success.description,
      });
      setFormData(initialFormData);
    } catch (err: any) {
      toast({
        title: CONTACT_FORM.toasts.error.title,
        description: err.message || CONTACT_FORM.toasts.error.description,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SiteSection 
      ref={ref} 
      id="contact" 
      variant="muted" 
      showGrid={false} 
      aria-labelledby="contact-heading" 
      className="relative overflow-hidden py-8 md:py-10 bg-[#f4faf8] border-t border-slate-200/80 select-none"
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,620px)] w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-[100px] -z-10" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full">
            {contactCta.badge}
          </span>
          <h2 id="contact-heading" className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 mt-5 tracking-tight">
            {contactCta.heading}
            {contactCta.highlight ? (
              <>
                {' '}
                <span className="text-emerald-600">{contactCta.highlight}</span>
              </>
            ) : null}
          </h2>
          <p className="text-slate-500 font-semibold text-sm sm:text-base mt-4 leading-relaxed">
            {contactCta.description}
          </p>
        </motion.div>

        {/* Lead Capture form card grid */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          whileHover={{ y: -4, boxShadow: '0 25px 50px -12px rgba(16,185,129,0.06)' }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-12 rounded-3xl border border-slate-200/80 overflow-hidden shadow-xl bg-white hover:border-emerald-500/20"
        >
          {/* Left Block: "How It Works" list */}
          <div className="lg:col-span-5 bg-slate-50/60 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200/60 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-10 relative z-10">
              <div>
                <h3 className="text-2xl font-bold font-display text-slate-900">How It Works</h3>
                <div className="w-12 h-1 bg-emerald-500/50 mt-2.5 rounded-full" />
              </div>

              <div className="space-y-8">
                {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4 items-start">
                  <span className="text-2xl font-black font-display text-emerald-600/35 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 text-base">{step.title}</div>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200/60 mt-10 space-y-3.5 relative z-10 font-bold">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <Clock className="w-4.5 h-4.5 text-emerald-600" />
                <span>Response within 24hrs</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <Award className="w-4.5 h-4.5 text-emerald-600" />
                <span>Free Consultation</span>
              </div>
            </div>
          </div>

          {/* Right Block: Redesigned Interactive Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Category Pills Selector */}
              <div className="space-y-3">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block text-left">
                  Project Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const Icon = getCmsIcon(cat.icon);
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer select-none",
                          isSelected 
                            ? "bg-emerald-50/70 border-emerald-500/35 text-emerald-700 shadow-sm" 
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                        )}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-emerald-600" : "text-slate-400")} />
                        <span className="text-[11px] sm:text-xs font-bold leading-none">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email Fields Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm h-11 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 font-bold"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm h-11 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 font-bold"
                />
              </div>

              {/* Phone Field */}
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm h-11 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 font-bold"
              />

              {/* Description Textarea */}
              <Textarea
                name="message"
                placeholder="Describe your project, goals, and timeline..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 resize-none font-bold"
              />

              {/* Budget Range Pills Selector */}
              <div className="space-y-3">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block text-left">
                  Estimated Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {budgets.map((bud) => {
                    const isSelected = formData.budget === bud.id;
                    return (
                      <button
                        key={bud.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, budget: bud.id }))}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer select-none text-xs font-bold",
                          isSelected 
                            ? "bg-emerald-50/70 border-emerald-500/35 text-emerald-700 shadow-sm" 
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                        )}
                      >
                        {bud.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Sending...' : contactCta.ctaText}
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ContactSection;
