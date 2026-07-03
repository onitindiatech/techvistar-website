import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Clock, ShieldCheck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { CONTACT_FORM } from '@/data';

interface FormData {
  category: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialFormData: FormData = {
  category: '',
  name: '',
  email: '',
  phone: '',
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
      params.append('category', formData.category);
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('phone', formData.phone);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      className="relative overflow-hidden py-16 md:py-24 bg-[#f4faf8] border-t border-slate-200/80 select-none"
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,620px)] w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-[100px] -z-10" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full">
            START A PROJECT
          </span>
          <h2 id="contact-heading" className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 mt-5 tracking-tight">
            Tell Us About Your Project
          </h2>
          <p className="text-slate-500 font-semibold text-sm sm:text-base mt-4 leading-relaxed">
            Share your idea and our team will get back to you with a tailored plan within 24 hours.
          </p>
        </motion.div>

        {/* Hover Lift & Glow Container Card */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          whileHover={{ y: -4, boxShadow: '0 25px 50px -12px rgba(16,185,129,0.06)' }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-12 rounded-3xl border border-slate-200/80 overflow-hidden shadow-xl bg-white hover:border-emerald-500/20"
        >
          {/* Left Block: "How It Works" split section */}
          <div className="lg:col-span-5 bg-slate-50/60 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200/60 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle light pattern */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-10 relative z-10">
              <div>
                <h3 className="text-2xl font-bold font-display text-slate-900">How It Works</h3>
                <div className="w-12 h-1 bg-emerald-500/50 mt-2.5 rounded-full" />
              </div>

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl font-black font-display text-emerald-600/35 mt-0.5">01</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Share Requirements</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold mt-1">
                      Tell us your goals, timeline, and budget — we'll review everything.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="text-2xl font-black font-display text-emerald-600/35 mt-0.5">02</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Expert Assessment</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold mt-1">
                      Our team will evaluate your project and identify the best approach.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="text-2xl font-black font-display text-emerald-600/35 mt-0.5">03</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Get Your Solution</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold mt-1">
                      We'll reach out with a tailored proposal and next steps.
                    </p>
                  </div>
                </div>
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

          {/* Right Block: Lead Capture Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer appearance-none"
                >
                  <option value="" className="text-slate-400">Select Category</option>
                  <option value="web" className="text-slate-800">Web Development</option>
                  <option value="mobile" className="text-slate-800">Mobile Apps</option>
                  <option value="design" className="text-slate-800">UI/UX Design</option>
                  <option value="ai" className="text-slate-800">AI Solutions</option>
                  <option value="software" className="text-slate-800">Custom Software</option>
                  <option value="devops" className="text-slate-800">Cloud & DevOps</option>
                  <option value="other" className="text-slate-800">Other</option>
                </select>
              </div>

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

              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm h-11 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 font-bold"
              />

              <Textarea
                name="message"
                placeholder="Describe your project, goals, and timeline..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/30 resize-none font-bold"
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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
