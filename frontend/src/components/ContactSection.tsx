import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Users, Globe, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { CONTACT_FORM } from '@/data';
import { submitContactForm } from '@/services/contact.service';
import { useHomeCms } from '@/contexts/HomeCmsContext';
import { DEFAULT_HOME_CMS } from '@/types/homeCms';

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

const contactDetails = [
  {
    icon: Mail,
    label: 'General Inquiries',
    value: 'info@techvistar.com',
    href: 'mailto:info@techvistar.com',
  },
  {
    icon: Users,
    label: 'Business & Partnerships',
    value: 'partnerships@techvistar.com',
    href: 'mailto:partnerships@techvistar.com',
  },
  {
    icon: Globe,
    label: 'Official Website',
    value: 'www.techvistar.com',
    href: 'https://www.techvistar.com',
    external: true,
  },
  {
    icon: Phone,
    label: 'Telephone Contact',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: MapPin,
    label: 'Registered Office',
    isAddress: true,
    lines: ['TechVistar Solutions Pvt. Ltd.', 'New Delhi, India'],
  },
];

export const ContactSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const { contactCta } = useHomeCms();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!contactCta.visible) return null;

  const categories = (contactCta.categories.length > 0 ? contactCta.categories : DEFAULT_HOME_CMS.contactCta.categories)
    .sort((a, b) => a.sortOrder - b.sortOrder);

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
      className="relative overflow-hidden py-12 md:py-16 bg-[#f4f7fb] border-t border-slate-200/80 select-none"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,700px)] w-[min(90vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b2859]/[0.04] blur-[100px] -z-10" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header matching reference */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 md:mb-10 gap-4"
        >
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-sky-600 font-display block mb-2">
              GET IN TOUCH
            </span>
            <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 font-display tracking-tight leading-tight">
              {contactCta.heading || "Let's Build Something Great Together"}
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {contactCta.description || "Have a project in mind or want to know more about our services? We'd love to hear from you."}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-right shrink-0 pb-1">
            <div className="w-8 h-px bg-sky-400" />
            <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase font-display leading-tight">
              <div>YOUR VISION</div>
              <div>OUR TECHNOLOGY</div>
            </div>
          </div>
        </motion.div>

        {/* Two-Column Card Layout matching reference */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
        >
          {/* Left Card: Direct Contact Details */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-7 sm:p-9 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-[26px] font-bold text-slate-900 font-display tracking-tight">
                Direct Contact Details
              </h3>
              <p className="text-slate-500 text-sm mt-1.5 mb-8">
                Reach out to us through any of the following channels.
              </p>

              <div className="space-y-6">
                {contactDetails.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100/60 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                          {item.label}
                        </span>
                        {item.isAddress ? (
                          <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            <div>{item.lines[0]}</div>
                            <div className="text-slate-600 font-medium text-sm">{item.lines[1]}</div>
                          </div>
                        ) : (
                          <a
                            href={item.href}
                            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-sky-600 transition-colors block truncate"
                          >
                            {item.value}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Card: Send an Inquiry */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-7 sm:p-9 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-[26px] font-bold text-slate-900 font-display tracking-tight">
                Send an Inquiry
              </h3>
              <p className="text-slate-500 text-sm mt-1.5 mb-6">
                Tell us about your project requirements and our team will get back to you soon.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Row 1: Full Name & Email Address */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Full Name <span className="text-slate-700">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-11 sm:h-12 bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-medium text-sm md:text-base rounded-xl px-4 focus-visible:bg-white transition-all shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Email Address <span className="text-slate-700">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-11 sm:h-12 bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-medium text-sm md:text-base rounded-xl px-4 focus-visible:bg-white transition-all shadow-none"
                    />
                  </div>
                </div>

                {/* Row 2: Company & Phone Number */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="company" className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full h-11 sm:h-12 bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-medium text-sm md:text-base rounded-xl px-4 focus-visible:bg-white transition-all shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Phone Number <span className="text-slate-700">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full h-11 sm:h-12 bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-medium text-sm md:text-base rounded-xl px-4 focus-visible:bg-white transition-all shadow-none"
                    />
                  </div>
                </div>

                {/* Row 3: Category (optional) */}
                {categories.length > 0 ? (
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Project Category <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-11 sm:h-12 bg-[#f8fafc] border border-slate-200 text-slate-900 text-sm md:text-base rounded-xl px-4 font-medium focus:outline-none focus:bg-white focus:border-[#041a3d] focus:ring-2 focus:ring-[#041a3d]/20 transition-all cursor-pointer"
                    >
                      <option value="">Select a category (optional)</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {/* Row 4: Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-slate-800">
                    Message <span className="text-slate-700">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-medium text-sm md:text-base rounded-xl p-4 focus-visible:bg-white transition-all resize-none shadow-none"
                  />
                </div>

                {/* Privacy Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="privacy"
                      checked={formData.privacy}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#041a3d] focus:ring-[#041a3d]/20"
                    />
                    <span className="text-xs md:text-sm font-medium text-slate-600">
                      I agree to be contacted by the TechVistar team and accept the{' '}
                      <a href="/privacy" className="text-[#041a3d] font-bold hover:underline">
                        privacy policy
                      </a>.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#041a3d] hover:bg-[#021028] text-white font-extrabold text-sm md:text-base rounded-xl shadow-[0_4px_18px_rgba(4,26,61,0.25)] hover:shadow-[0_6px_22px_rgba(4,26,61,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : (contactCta.ctaText || 'Send Message')}</span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </SiteSection>
  );
};

export default ContactSection;
