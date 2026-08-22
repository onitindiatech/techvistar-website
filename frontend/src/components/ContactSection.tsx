import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { CONTACT_FORM } from '@/data';
import { submitContactForm } from '@/services/contact.service';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';
import illustrationImg from '@/assets/images/consultation_illustration.png';

interface FormData {
  category: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  privacy: boolean;
}

const initialFormData: FormData = {
  category: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  privacy: false,
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
  const steps = (contactCta.steps.length > 0 ? contactCta.steps : DEFAULT_HOME_CMS.contactCta.steps)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryStep = steps[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      toast({
        title: 'Agreement Required',
        description: 'Please agree to the privacy policy to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceMapping: Record<string, string> = {
        web: 'web-development',
        mobile: 'mobile-development',
        design: 'ui-ux',
        ai: 'other',
        software: 'other',
        devops: 'other',
        other: 'other',
      };

      const serviceInterested = serviceMapping[formData.category] || 'other';

      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <SiteSection 
      ref={ref} 
      id="contact" 
      variant="muted" 
      showGrid={false} 
      aria-labelledby="contact-heading" 
      className="relative overflow-hidden py-8 md:py-10 bg-[#f4f7fb] border-t border-slate-200/80 select-none"
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,620px)] w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b2859]/[0.06] blur-[100px] -z-10" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <h2 id="contact-heading" className="font-display text-heading-lg md:text-heading-xl lg:text-display-lg font-extrabold text-slate-900 mt-4 md:mt-5 tracking-tight">
            {contactCta.heading}
            {contactCta.highlight ? (
              <>
                {' '}
                <span className="text-[#0b2859]">{contactCta.highlight}</span>
              </>
            ) : null}
          </h2>
          {contactCta.description ? (
            <p className="text-slate-600 font-medium text-base md:text-lg mt-4 px-4 line-clamp-2">
              {contactCta.description}
            </p>
          ) : null}
        </motion.div>

        {/* Lead Capture form card grid with logo blue shadow */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          whileHover={{ y: -4, boxShadow: '0 25px 60px -10px rgba(11,40,89,0.22)' }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-12 rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_20px_50px_rgba(11,40,89,0.14)] bg-white hover:border-[#0b2859]/30 w-full mx-auto"
        >
          {/* Left Block: Premium Illustration */}
          <div className="lg:col-span-5 bg-slate-50/60 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200/60 p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-[#0b2859]/[0.06] rounded-full blur-[70px] pointer-events-none" />

            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
              <img src={illustrationImg} alt="Consultation Illustration" className="w-full max-w-[220px] object-contain drop-shadow-[0_15px_35px_rgba(11,40,89,0.25)] mb-6 hover:scale-105 transition-transform duration-700" />
              
              <h3 className="text-xl md:text-2xl font-extrabold font-display text-slate-900 leading-tight mb-2">
                {primaryStep?.title || contactCta.heading}
              </h3>
              <p className="text-sm md:text-base text-slate-600 font-medium px-2 max-w-[280px]">
                {primaryStep?.description || contactCta.description}
              </p>
            </div>
          </div>

          {/* Right Block: Interactive Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Company Fields Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="name"
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm md:text-base h-11 rounded-xl focus-visible:ring-[#0b2859]/20 focus-visible:border-[#0b2859]/40 font-semibold"
                />
                <Input
                  name="company"
                  type="text"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm md:text-base h-11 rounded-xl focus-visible:ring-[#0b2859]/20 focus-visible:border-[#0b2859]/40 font-semibold"
                />
              </div>

              {/* Email & Phone Fields Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Business Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm md:text-base h-11 rounded-xl focus-visible:ring-[#0b2859]/20 focus-visible:border-[#0b2859]/40 font-semibold"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm md:text-base h-11 rounded-xl focus-visible:ring-[#0b2859]/20 focus-visible:border-[#0b2859]/40 font-semibold"
                />
              </div>

              {categories.length > 0 ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm md:text-base h-11 rounded-xl px-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0b2859]/20 focus:border-[#0b2859]/40"
                >
                  <option value="">Project Category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {/* Description Textarea */}
              <Textarea
                name="message"
                placeholder="Project Description / Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm md:text-base rounded-xl focus-visible:ring-[#0b2859]/20 focus-visible:border-[#0b2859]/40 resize-none font-semibold p-4"
              />

              {/* Privacy Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-[#0b2859] focus:ring-[#0b2859]/20"
                  />
                  <span className="text-xs md:text-sm font-medium text-slate-600">
                    I agree to be contacted by the Veenero team and accept the <a href="/privacy" className="text-[#0b2859] font-bold hover:underline">privacy policy</a>.
                  </span>
                </label>
              </div>

              {/* Submit Button with logo blue #0b2859 & glowing blue shadow */}
              <motion.button 
                whileHover={{ y: -1 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-11 bg-[#041a3d] hover:bg-[#021028] text-white font-extrabold text-sm rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : (contactCta.ctaText || 'Send Message')}</span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ContactSection;
