import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
import { submitContactForm } from '@/services/contact.service';
import { LogoCloud } from '@/components/LogoCloud';
import { FAQSection } from '@/components/faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig, DEFAULT_CONTACT_CMS } from '@/types/pagesCms';
import { seoFromItem } from '@/lib/seoAdmin';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import contactBg from '../assets/contact-header.png';
import { getActiveOffices } from '@/services/office.service';

const renderContactHeroTitle = (title: string) => {
  const highlight = 'Great';
  if (!title.includes(highlight)) return title;
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-emerald-500">{highlight}</span>
      {after}
    </>
  );
};

const OfficeImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800")}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
  );
};

export const Contact = () => {
  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
    staleTime: 60_000,
  });

  const contact = mergePagesCmsConfig(pagesConfig).contact;
  const contactSeo = seoFromItem(contact as unknown as Record<string, unknown>);
  const heroBg = contact.hero.backgroundImage?.trim() || contactBg;
  const phoneHref = `tel:${contact.contactInfo.phone.replace(/\s/g, '')}`;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapToggles, setMapToggles] = useState<Record<string, boolean>>({});
  const { data: offices = [] } = useQuery({
    queryKey: ['public-offices'],
    queryFn: getActiveOffices,
  });
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
      // Map frontend inquiryType string to backend serviceInterested enum values
      const serviceMapping: Record<string, string> = {
        'Web Development': 'web-development',
        'Mobile Development': 'mobile-development',
        'AI Automation': 'other',
        'Design Services': 'ui-ux',
        'Other': 'other'
      };

      const serviceInterested = serviceMapping[formData.inquiryType] || 'other';

      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterested,
        message: formData.message,
      });

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
    } catch (err: any) {
      toast({
        title: 'Unable to send',
        description: err.message || 'Please try again or email us directly.',
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


  return (
    <>
      <PageSeo
        seo={contactSeo}
        defaults={{
          title: contact.seoTitle || DEFAULT_CONTACT_CMS.seoTitle || 'Contact TechVistar | Start your project',
          description: contact.seoDescription || DEFAULT_CONTACT_CMS.seoDescription || '',
          url: buildCanonical('/contact'),
        }}
      />
      <Navbar />
      
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative overflow-hidden animate-fade-in">
        
        {/* HERO HEADER SECTION - Matching Portfolio, Solutions and About */}
        <PageHeader 
          title={renderContactHeroTitle(contact.hero.title)}
          subtitle={contact.hero.eyebrow || "Let's Connect"}
          description={contact.hero.description}
          backgroundImage={heroBg}
          bgPosition="right bottom"
        />

        {/* HERO GRID SECTION - FORM AND INFO CARDS */}
        <section className="container-custom max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10" id="contact-form-section">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Side: Stats & Cards */}
            <div className="lg:col-span-5 space-y-8">
              {/* Trust Badge Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-slate-200/80 py-6">
                <AnimatedStat
                  value="24 Hrs"
                  label="Response Time"
                  variant="contact-badge"
                  icon={<Clock className="w-4 h-4" />}
                />
                <AnimatedStat
                  value="100+"
                  label="Projects Delivered"
                  variant="contact-badge"
                  icon={<Briefcase className="w-4 h-4" />}
                />
                <AnimatedStat
                  value="98%"
                  label="Client Satisfaction"
                  variant="contact-badge"
                  icon={<ShieldCheck className="w-4 h-4" />}
                />
                <AnimatedStat
                  value="10+"
                  label="Industries Served"
                  variant="contact-badge"
                  icon={<Building2 className="w-4 h-4" />}
                />
              </div>

              {/* Actionable Info Cards */}
              <div className="space-y-4">
                {/* Call card */}
                <motion.a 
                  href={phoneHref}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="font-extrabold font-display text-slate-900 text-sm">Call Us</div>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">{contact.contactInfo.phone}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{contact.office.hours}</span>
                  </div>
                </motion.a>

                {/* Email card */}
                <motion.a 
                  href={`mailto:${contact.contactInfo.email}`}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-[0_12px_24px_rgba(16,185,129,0.06)] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="font-extrabold font-display text-slate-900 text-sm">Email Us</div>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">{contact.contactInfo.email}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{contact.contactInfo.supportText}</span>
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
                    <div className="font-extrabold font-display text-slate-900 text-sm">{contact.office.heading}</div>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">TechVistar HQ</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{contact.office.address}</span>
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
                    <div className="font-extrabold font-display text-slate-900 text-sm">Working Hours</div>
                    <p className="text-xs text-slate-600 font-bold mt-0.5">{contact.office.hours.split(',')[0] || contact.office.hours}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                      {contact.office.hours.includes(',') ? contact.office.hours.split(',').slice(1).join(',').trim() : ''}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Side: Form Container */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xl relative">
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100">
                  <Mail className="w-5.5 h-5.5 text-emerald-600" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">{contact.cta.title}</h3>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">{contact.cta.description}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      rows={3}
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
                    <span>{isSubmitting ? 'Sending...' : contact.cta.buttonText}</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* HEADQUARTERS MAP & DIRECTIONS BANNER */}
        <section className="container-custom max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20 relative z-10">
          <div className="group w-full rounded-[2rem] overflow-hidden border border-slate-200/60 bg-white shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] transition-all duration-700 flex flex-col md:flex-row relative">
            
            {/* Grayscale OSM Map representation */}
            <div className="w-full md:w-[55%] h-80 md:h-auto min-h-[400px] relative overflow-hidden bg-slate-100">
              <div className="absolute inset-0 bg-emerald-600/5 mix-blend-multiply pointer-events-none z-10" />
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.365%2C28.623%2C77.378%2C28.632&layer=mapnik&marker=28.628%2C77.372" 
                className="w-full h-full absolute inset-0 border-0"
                style={{ filter: "grayscale(0.3) contrast(1.1)" }} 
                title="OSM Headquarters Noida location"
              />
            </div>

            {/* Headquarters details */}
            <div className="w-full md:w-[45%] p-8 sm:p-12 md:p-14 flex flex-col justify-center relative bg-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {contact.office.heading}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-extrabold font-display text-slate-900 mb-3">TechVistar</h3>
                  <p className="text-sm md:text-base text-slate-500 font-semibold leading-relaxed">
                    {contact.office.address}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <a 
                    href="https://www.openstreetmap.org/?mlat=28.628&mlon=77.372#map=16/28.628/77.372" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_-4px_rgba(16,185,129,0.4)] group/btn"
                  >
                    <span>Get Directions</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR OFFICES SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20 relative z-10">
          <div className="mb-8">
            <h3 className="text-lg font-bold font-display text-slate-900">Our Offices</h3>
          </div>

          <div className="grid md:grid-cols-2 max-w-5xl mx-auto gap-8">
            {offices.map((office) => {
              const showMap = !!mapToggles[office.officeId];
              return (
                <motion.div 
                  key={office._id}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative bg-white border border-slate-200/60 hover:border-emerald-500/30 rounded-[2rem] overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                    {showMap ? (
                      <div className="absolute inset-0 z-20">
                        <iframe
                          src={office.googleMapsUrl}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMapToggles(prev => ({ ...prev, [office.officeId]: false }));
                          }}
                          className="absolute top-3 right-3 z-30 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full p-1.5 transition-colors shadow-md text-xs font-semibold px-2.5 py-1"
                        >
                          Close Map
                        </button>
                      </div>
                    ) : (
                      <>
                        <OfficeImage
                          src={office.image}
                          alt={office.imageAlt || office.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent z-10" />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMapToggles(prev => ({ ...prev, [office.officeId]: true }));
                          }}
                          className="absolute bottom-3 right-3 z-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-1.5 hover:scale-105"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Show Map</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 space-y-5 bg-white relative z-20 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-display font-extrabold text-slate-900 text-xl group-hover:text-emerald-600 transition-colors duration-300">
                          {office.name}
                        </div>
                        <span className="shrink-0 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200/60">
                          {office.badge}
                        </span>
                      </div>

                      <div className="flex gap-3 text-slate-500 group-hover:text-slate-600 transition-colors">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-300 group-hover:text-emerald-400 transition-colors duration-300" />
                        <p className="text-sm font-semibold leading-relaxed whitespace-pre-line">
                          {office.address}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(office.name + ' ' + office.address)}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors group/link"
                      >
                        View on Maps
                        <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1.5 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* PILLARS BAR SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20 relative z-10">
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

        <FAQSection pageFilter="contact" layout="split" limit={4} showViewAll={true} />

        {/* TRUSTED BY CLIENT LOGOS SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-10 relative z-10 border-t border-slate-200/60">
          <LogoCloud />
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Contact;
