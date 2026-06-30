import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CONTACT_INFO, CONTACT_SIDEBAR, SECTION_CONTACT, CONTACT_FORM } from '@/data';
import { HoverCard } from '@/components/animations/HoverCard';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export const ContactSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('subject', formData.subject);
      params.append('message', formData.message);

      const response = await fetch(
        CONTACT_FORM.actionUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      if (response.ok) {
        toast({
          title: CONTACT_FORM.toasts.success.title,
          description: CONTACT_FORM.toasts.success.description,
        });
        setFormData(initialFormData);
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      toast({
        title: CONTACT_FORM.toasts.error.title,
        description: CONTACT_FORM.toasts.error.description,
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
    <SiteSection ref={ref} id="contact" variant="muted" aria-labelledby="contact-heading" className="relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,620px)] w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-[100px] -z-10" />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={SECTION_CONTACT.tag}
          title={SECTION_CONTACT.title}
          highlight={SECTION_CONTACT.highlight}
          description={SECTION_CONTACT.description}
          isInView={isInView}
          headingId="contact-heading"
        />

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Sidebar Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">{CONTACT_SIDEBAR.title}</h3>
              <p className="text-slate-600 leading-relaxed font-semibold text-sm sm:text-base">{CONTACT_SIDEBAR.lead}</p>
            </div>

            <div className="space-y-4">
              {CONTACT_INFO.map((info) => (
                <HoverCard
                  key={info.title}
                  depth={8}
                  scale={1.02}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.08)] hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] transition-all duration-300"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <info.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h4 className="font-bold font-display text-slate-900 text-sm sm:text-base group-hover:text-primary transition-colors">{info.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">{info.details}</p>
                  </div>
                </HoverCard>
              ))}
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5 sm:p-6 shadow-sm">
              <h4 className="font-bold font-display text-slate-900 text-sm sm:text-base mb-2">{CONTACT_SIDEBAR.slaTitle}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">{CONTACT_SIDEBAR.slaBody}</p>
            </div>
          </motion.div>

          {/* Form Section inside HoverCard */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-3"
          >
            <HoverCard
              depth={6}
              scale={1.01}
              className="group rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-md hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] hover:border-emerald-500/40 hover:bg-emerald-500/[0.01] transition-all duration-300"
            >
              <form
                onSubmit={handleSubmit}
                aria-label="Project inquiry form"
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      {CONTACT_FORM.fields.name.label}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={CONTACT_FORM.fields.name.placeholder}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      {CONTACT_FORM.fields.email.label}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={CONTACT_FORM.fields.email.placeholder}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    {CONTACT_FORM.fields.subject.label}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={CONTACT_FORM.fields.subject.placeholder}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background border-border focus-visible:ring-primary h-11"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    {CONTACT_FORM.fields.message.label}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={CONTACT_FORM.fields.message.placeholder}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-background border-border focus-visible:ring-primary resize-none"
                  />
                </div>

                <Button variant="hero" size="lg" type="submit" className="w-full group h-12 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(34,197,94,0.4)] hover:shadow-[0_16px_40px_-8px_rgba(34,197,94,0.35)] transition-all duration-300" disabled={isSubmitting}>
                  {isSubmitting ? CONTACT_FORM.submittingText : CONTACT_FORM.submitButton}
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </form>
            </HoverCard>
          </motion.div>
        </div>
      </div>
    </SiteSection>
  );
};
export default ContactSection;
