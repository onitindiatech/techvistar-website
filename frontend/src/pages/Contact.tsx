import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { HoverCard } from '@/components/animations/HoverCard';
import { CONTACT_INFO, CONTACT_FORM, CONTACT_SIDEBAR } from '@/data/contact';

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('subject', formData.subject);
      params.append('message', formData.message);

      const response = await fetch(CONTACT_FORM.actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (response.ok) {
        toast({
          title: CONTACT_FORM.toasts.success.title,
          description: CONTACT_FORM.toasts.success.description,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
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
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-slate-50/50 pt-24 pb-16 relative overflow-hidden">
        {/* Abstract background gradient decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container-custom">
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight mb-6"
            >
              Let's start a <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">growth conversation</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg font-semibold leading-relaxed"
            >
              Have a project in mind, need technical assistance, or want to explore our internship opportunities? Reach out, and we'll connect you with the right practice lead.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
            {/* Left side: Contact Cards & 3D Phone Call picture/illustration */}
            <div className="lg:col-span-5 space-y-8">
              {/* Phone Call Illustration Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <HoverCard
                  depth={12}
                  scale={1.02}
                  className="p-6 overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-zinc-950 border border-slate-800 text-white shadow-2xl relative"
                >
                  {/* Glowing circles */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-45 h-45 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* 3D Calling Graphic */}
                  <div className="flex justify-center mb-6 relative">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative z-10"
                    >
                      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_15px_30px_rgba(16,185,129,0.3)]">
                        {/* Outer pulsing ring */}
                        <circle cx="110" cy="110" r="100" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '40s' }} />
                        <circle cx="110" cy="110" r="85" stroke="url(#paint1_linear)" strokeWidth="1" strokeOpacity="0.4" />
                        
                        {/* Glowing backdrop elements */}
                        <circle cx="110" cy="110" r="60" fill="url(#paint2_radial)" opacity="0.6" />
                        
                        {/* Phone call bubble shapes */}
                        <g filter="url(#glow)">
                          <rect x="75" y="65" width="70" height="90" rx="14" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                          <circle cx="110" cy="140" r="5" fill="#10b981" />
                          <rect x="100" y="72" width="20" height="3" rx="1.5" fill="#334155" />
                          
                          {/* Inner Screen Graphic */}
                          <rect x="82" y="80" width="56" height="50" rx="6" fill="#1e293b" />
                          
                          {/* Incoming call text simulator */}
                          <rect x="90" y="87" width="40" height="4" rx="2" fill="#10b981" />
                          <rect x="95" y="96" width="30" height="3" rx="1.5" fill="#64748b" />
                          
                          {/* Phone receiver icon in green */}
                          <path d="M102 110C102 115 106 119 111 119C114 119 116 117.5 117 115.5C117.5 114.5 116.5 113.5 115.5 114C114 114.75 112.5 115 111 115C108.2 115 106 112.8 106 110C106 108.5 106.25 107 107 105.5C107.5 104.5 106.5 103.5 105.5 104C103.5 105 102 107.2 102 110Z" fill="#10b981" />
                        </g>

                        {/* Floating waves */}
                        <path d="M50 80C35 90 35 110 50 120" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.7" className="animate-pulse" />
                        <path d="M40 70C20 85 20 115 40 130" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                        <path d="M170 80C185 90 185 110 170 120" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.7" className="animate-pulse" />
                        <path d="M180 70C200 85 200 115 180 130" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

                        <defs>
                          <linearGradient id="paint0_linear" x1="10" y1="10" x2="210" y2="210" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#10b981" />
                            <stop offset="0.5" stopColor="#14b8a6" />
                            <stop offset="1" stopColor="#047857" />
                          </linearGradient>
                          <linearGradient id="paint1_linear" x1="25" y1="25" x2="195" y2="195" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#34d399" />
                            <stop offset="1" stopColor="#065f46" />
                          </linearGradient>
                          <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 110) rotate(90) scale(60)">
                            <stop stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                          </radialGradient>
                          <filter id="glow" x="65" y="55" width="90" height="110" filterUnits="userSpaceOnUse">
                            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#10b981" floodOpacity="0.25" />
                          </filter>
                        </defs>
                      </svg>
                    </motion.div>
                  </div>

                  <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold font-display tracking-tight mb-2">Prefer a direct conversation?</h3>
                    <p className="text-slate-400 text-sm font-medium mb-4">
                      Our support team and solutions architects are available for calls.
                    </p>
                    <a
                      href="tel:+919573157982"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-600 active:scale-95"
                    >
                      <PhoneCall className="w-4 h-4 animate-bounce" />
                      <span>Call +91 9573157982</span>
                    </a>
                  </div>
                </HoverCard>
              </motion.div>

              {/* Actionable Info Cards */}
              <div className="space-y-4">
                {CONTACT_INFO.map((info, idx) => {
                  const Icon = info.icon;
                  const isPhone = info.title.toLowerCase().includes('phone');
                  const isEmail = info.title.toLowerCase().includes('email') || info.title.toLowerCase().includes('inquir');
                  const linkHref = isPhone ? `tel:${info.details}` : isEmail ? `mailto:${info.details}` : undefined;

                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                    >
                      <HoverCard
                        depth={6}
                        scale={1.015}
                        className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 transition-all duration-300"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-6">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold font-display text-slate-900 text-sm sm:text-base">{info.title}</h4>
                          {linkHref ? (
                            <a href={linkHref} className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 hover:text-primary transition-colors block">
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 block">
                              {info.details}
                            </p>
                          )}
                        </div>
                      </HoverCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* SLA Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-6 shadow-sm flex gap-4 items-start"
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 mt-0.5 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-display text-slate-900 text-sm sm:text-base mb-1">{CONTACT_SIDEBAR.slaTitle}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">{CONTACT_SIDEBAR.slaBody}</p>
                </div>
              </motion.div>
            </div>

            {/* Right side: 3D Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-7"
            >
              <HoverCard
                depth={8}
                scale={1.01}
                className="group rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-lg hover:shadow-[0_30px_60px_rgba(16,185,129,0.08)] hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">Send us a message</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Response within 24 business hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                        {CONTACT_FORM.fields.name.label}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={CONTACT_FORM.fields.name.placeholder}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-slate-50/50 border-slate-200/80 focus-visible:ring-primary focus-visible:bg-white h-12 rounded-xl transition-all duration-200 font-medium"
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
                        placeholder={CONTACT_FORM.fields.email.placeholder}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-slate-50/50 border-slate-200/80 focus-visible:ring-primary focus-visible:bg-white h-12 rounded-xl transition-all duration-200 font-medium"
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
                      className="bg-slate-50/50 border-slate-200/80 focus-visible:ring-primary focus-visible:bg-white h-12 rounded-xl transition-all duration-200 font-medium"
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
                      rows={6}
                      className="bg-slate-50/50 border-slate-200/80 focus-visible:ring-primary focus-visible:bg-white rounded-xl transition-all duration-200 resize-none font-medium text-sm leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>SLA: 1 Business Day (IST)</span>
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      type="submit"
                      className="group h-12 px-8 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_16px_40px_-8px_rgba(16,185,129,0.35)] transition-all duration-300 rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? CONTACT_FORM.submittingText : CONTACT_FORM.submitButton}
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </form>
              </HoverCard>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
