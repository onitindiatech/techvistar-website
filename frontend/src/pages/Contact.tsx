import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles, 
  Linkedin, ArrowRight, Send, HelpCircle, ArrowUpRight, 
  CheckCircle2, User, Building2, Briefcase, PhoneCall, Laptop
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// FAQ Accordion Component
interface FAQAccordionProps {
  question: string;
  answer: string;
}

const FAQAccordion = ({ question, answer }: FAQAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-display font-extrabold text-base sm:text-lg text-slate-900 hover:text-emerald-600 transition-colors py-1"
      >
        <span>{question}</span>
        <span className="text-emerald-600 font-normal text-xl ml-4">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-slate-600 text-sm leading-relaxed mt-2.5 font-medium">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'Web Development',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('subject', `${formData.inquiryType} Inquiry — ${formData.company}`);
      params.append('message', `Phone: ${formData.phone}\nCompany: ${formData.company}\n\nMessage: ${formData.message}`);

      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbyVFalUML0Mnb-S2RuoCA68d5422p5MvMWF_id4Uw-MIQyiH5PxiglxPGdHDV47QJ22/exec', 
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
          title: 'Inquiry received',
          description: 'We will respond within one business day where possible.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          inquiryType: 'Web Development',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      toast({
        title: 'Unable to send',
        description: 'Please try again or email us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const scrollToForm = () => {
    const element = document.getElementById('contact-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // FAQ Data
  const faqs = [
    {
      q: 'What services does TechVistar offer?',
      a: 'We offer full-cycle digital development including Web Systems, Mobile Apps, SaaS Platforms, Cloud DevOps setup, AI Automatons, and UI/UX Design.'
    },
    {
      q: 'How long does it take to start a project?',
      a: 'After requirements scoping and alignment on a statement of work, we typically kick off projects within 5 to 7 business days.'
    },
    {
      q: 'Can you work on an existing project?',
      a: 'Yes. We perform code audits, structural compliance checks, and integration updates before onboarding ongoing projects.'
    },
    {
      q: 'Do you offer support after deployment?',
      a: 'Absolutely. We provide structured service-level agreements (SLAs) for continuous monitoring, updates, and maintenance support.'
    },
    {
      q: 'How do I get a project estimate?',
      a: 'Simply fill out the form above with your timeline, requirements, and constraints, and our practice leads will schedule a consultation.'
    }
  ];

  return (
    <>
      <Navbar />
      
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative overflow-hidden animate-fade-in">
        
        {/* HERO HEADER SECTION - Matching Portfolio, Solutions and About */}
        <section className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-36 md:pb-24 border-b border-zinc-900 text-white">
          {/* Shifting green waves / glow effect */}
          <div className="absolute top-0 inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.05] blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/[0.05] blur-[130px]" />
          </div>

          <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let's Connect</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1] max-w-3xl">
              Let's Build Something <span className="text-emerald-500">Great</span> Together
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-semibold max-w-2xl">
              Have a project in mind or want to explore how we can help your business grow? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* HERO GRID SECTION - FORM AND INFO CARDS */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 relative z-10" id="contact-form-section">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Side: Stats & Cards */}
            <div className="lg:col-span-5 space-y-8">
              {/* Trust Badge Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-slate-200/80 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 leading-none">24 Hrs</h5>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Response Time</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 leading-none">100+</h5>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Projects Delivered</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 leading-none">98%</h5>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Client Satisfaction</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 leading-none">10+</h5>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Industries Served</span>
                  </div>
                </div>
              </div>

              {/* Actionable Info Cards */}
              <div className="space-y-4">
                {/* Call card */}
                <motion.a 
                  href="tel:+919573157982"
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-slate-900 text-sm">Call Us</h4>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">+91 9573157982</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Mon - Sat, 9:00 AM - 7:00 PM IST</span>
                  </div>
                </motion.a>

                {/* Email card */}
                <motion.a 
                  href="mailto:hello@techvistar.com"
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-slate-900 text-sm">Email Us</h4>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">hello@techvistar.com</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">We reply within 24 hours</span>
                  </div>
                </motion.a>

                {/* Office address */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-slate-900 text-sm">Visit Us</h4>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">TechVistar HQ</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Noida, Uttar Pradesh, India</span>
                  </div>
                </motion.div>

                {/* Working hours */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold font-display text-slate-900 text-sm">Working Hours</h4>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">Monday - Saturday</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">09:00 AM - 07:00 PM IST</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Side: Form Container */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl relative">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <Mail className="w-5.5 h-5.5 text-emerald-600" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">Send us a message</h3>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">Fill out the form and our team will get back to you shortly.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1 */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full name *</Label>
                      <input 
                        id="name"
                        type="text" 
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-emerald-500/60 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Work email *</Label>
                      <input 
                        id="email"
                        type="email" 
                        required
                        placeholder="Enter your work email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-emerald-500/60 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone number</Label>
                      <input 
                        id="phone"
                        type="tel" 
                        placeholder="Your contact number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-emerald-500/60 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-bold text-slate-700">Company name</Label>
                      <input 
                        id="company"
                        type="text" 
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-emerald-500/60 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="inquiryType" className="text-xs font-bold text-slate-700">Inquiry type *</Label>
                    <select
                      id="inquiryType"
                      value={formData.inquiryType}
                      onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-emerald-500/60 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="AI Automation">AI Automation</option>
                      <option value="Design Services">Design Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Row 4 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-bold text-slate-700">Tell us about your project *</Label>
                    <textarea 
                      id="message"
                      required
                      rows={5}
                      placeholder="Share your project details, goals, and requirements..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500/60 rounded-xl p-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* HEADQUARTERS MAP & DIRECTIONS BANNER */}
        <section className="container-custom max-w-7xl mx-auto px-6 mb-20 relative z-10">
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xl grid md:grid-cols-12 gap-6 items-center">
            
            {/* Grayscale OSM Map representation */}
            <div className="md:col-span-8 h-80 rounded-xl overflow-hidden relative border border-slate-200/60">
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.365%2C28.623%2C77.378%2C28.632&layer=mapnik&marker=28.628%2C77.372" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "grayscale(0.1) contrast(1.1) opacity(0.9)" }} 
                title="OSM Headquarters Noida location"
              />
            </div>

            {/* Headquarters details */}
            <div className="md:col-span-4 space-y-4 px-2 text-slate-900">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Our Headquarters</span>
              <h3 className="text-2xl font-extrabold font-display text-slate-900">TechVistar</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                A-75, Sector 4, Noida, Uttar Pradesh 201301, India
              </p>
              
              <div className="pt-2">
                <a 
                  href="https://www.openstreetmap.org/?mlat=28.628&mlon=77.372#map=16/28.628/77.372" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>Get Directions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* OUR OFFICES SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 mb-20 relative z-10">
          <div className="mb-8">
            <h3 className="text-lg font-bold font-display text-slate-900">Our Offices</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Noida office */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-md text-slate-900 flex flex-col justify-between"
            >
              <div className="h-44 w-full bg-emerald-50 border-b border-slate-100 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent z-10 opacity-30" />
                <svg className="w-full h-full text-emerald-600/10 p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 90H90M20 90V20H45V90M55 90V40H80V90" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-3 left-4 z-20">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">HQ Location</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-base">India - Noida (HQ)</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  A-75, Sector 4, Noida, UP 201301, India
                </p>
                <a href="https://www.openstreetmap.org/?mlat=28.628&mlon=77.372#map=16/28.628/77.372" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <span>View on map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>

            {/* Dubai office */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-md text-slate-900 flex flex-col justify-between"
            >
              <div className="h-44 w-full bg-emerald-50 border-b border-slate-100 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent z-10 opacity-30" />
                <svg className="w-full h-full text-emerald-600/10 p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 10L35 90H65L50 10Z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-3 left-4 z-20">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Regional Office</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-base">UAE - Dubai</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Business Bay, Dubai, UAE
                </p>
                <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <span>View on map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>

            {/* USA office */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-md text-slate-900 flex flex-col justify-between"
            >
              <div className="h-44 w-full bg-emerald-50 border-b border-slate-100 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent z-10 opacity-30" />
                <svg className="w-full h-full text-emerald-600/10 p-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="35" y="15" width="30" height="75" stroke="currentColor" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-3 left-4 z-20">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Regional Office</span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-base">USA - New York</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Manhattan, New York, NY 10001, USA
                </p>
                <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <span>View on map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PILLARS BAR SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 mb-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span className="p-1 rounded-md bg-emerald-50"><CheckCircle2 className="w-4 h-4" /></span>
                <span>Expert Team</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Skilled professionals dedicated to your success</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span className="p-1 rounded-md bg-emerald-50"><CheckCircle2 className="w-4 h-4" /></span>
                <span>Secure & Reliable</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Enterprise-grade security and best practices</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span className="p-1 rounded-md bg-emerald-50"><CheckCircle2 className="w-4 h-4" /></span>
                <span>On-Time Delivery</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Agile approach ensuring timely project delivery</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span className="p-1 rounded-md bg-emerald-50"><CheckCircle2 className="w-4 h-4" /></span>
                <span>Long-Term Support</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">We stay with you beyond project completion</p>
            </div>
          </div>
        </section>

        {/* FAQ & CALL OUT GRID SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 mb-20 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* FAQ List on Left */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold font-display text-slate-900">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Get quick answers regarding scope, timeline, and support SLAs.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-md text-slate-900">
                {faqs.map((faq) => (
                  <FAQAccordion key={faq.q} question={faq.q} answer={faq.a} />
                ))}
              </div>

              <div className="pt-2">
                <Link to="/faq">
                  <motion.button 
                    whileHover={{ x: 3 }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <span>View All FAQs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Call Out Banner on Right */}
            <div className="lg:col-span-5 h-full">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-8 flex flex-col justify-between h-full relative overflow-hidden shadow-lg text-slate-900">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold font-display text-slate-900">Ready to start your project?</h3>
                  <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                    Let's turn your ideas into powerful digital solutions. Connect with us to outline requirements.
                  </p>

                  {/* Customer support illustration */}
                  <div className="w-full h-32 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-center overflow-hidden">
                    <svg className="w-20 h-20 text-emerald-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                      <rect x="35" y="42" width="30" height="20" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
                      <circle cx="42" cy="52" r="2" fill="currentColor" />
                      <circle cx="58" cy="52" r="2" fill="currentColor" />
                      <path d="M50 72C50 72 45 78 40 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="pt-6">
                  <motion.button 
                    onClick={scrollToForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                  >
                    <span>Talk to an Expert</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TRUSTED BY CLIENT LOGOS SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-6 border-t border-slate-200/60 mt-10 relative z-10 text-center space-y-6">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 text-slate-800">
            <span className="text-sm font-bold tracking-wider hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Microsoft</span>
            <span className="text-sm font-bold tracking-wider hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Google</span>
            <span className="text-sm font-bold tracking-wider hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">AWS</span>
            <span className="text-sm font-bold tracking-wider hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Airbnb</span>
            <span className="text-sm font-bold tracking-wider hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Intel</span>
            <span className="text-sm font-bold tracking-wider hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Netflix</span>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Contact;
