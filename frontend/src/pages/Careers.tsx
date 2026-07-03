import { useState } from 'react';
import { motion } from 'framer-motion';
import { CAREERS, CAREERS_PAGE_DATA, Career } from '@/data/careers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Briefcase, MapPin, Calendar, Clock, GraduationCap, Users, Cpu } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { FAQSection } from '@/components/faq';
import careersBg from '../assets/careers-bg.png';
import frontendImg from '../assets/mobile_phone_devloper.png';
import backendImg from '../assets/Claud_Devops.png';
import designImg from '../assets/ui_ux_designer.png';
import reactInternImg from '../assets/overview_web_dev.png';
import fullStackInternImg from '../assets/custom_software_devlopment.png';
import marketingInternImg from '../assets/digital_marketing.png';
import campusAmbassadorImg from '../assets/brand_and_creative_design.png';

const jobImages: Record<string, string> = {
  'frontend-developer': frontendImg,
  'backend-developer': backendImg,
  'ui-ux-designer': designImg,
  'react-intern': reactInternImg,
  'full-stack-intern': fullStackInternImg,
  'marketing-intern': marketingInternImg,
  'campus-ambassador': campusAmbassadorImg,
};

const Careers = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Filter full-time vs internship positions
  const activeCareers = CAREERS.filter((c) => c.status === 'active');
  const fullTimePositions = activeCareers.filter((c) => c.employmentType === 'Full-Time');
  const internshipPositions = activeCareers.filter((c) => c.employmentType === 'Internship');

  const { hero, whyJoin, benefits, hiringProcess, applyCTA } = CAREERS_PAGE_DATA;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50">
        <Navbar />

        {/* 1. Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-32 md:pb-20 border-b border-zinc-900 text-white"
        >
          {/* Animated Mesh Waves + Mouse Parallax */}
          <motion.div 
            className="absolute inset-0 opacity-80 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${careersBg})`,
              backgroundSize: 'auto 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
            animate={{
              x: [0, 6, 0],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${careersBg})`,
                backgroundSize: 'auto 100%',
                backgroundPosition: 'right',
                backgroundRepeat: 'no-repeat',
              }}
              animate={{
                x: mousePosition.x * 8,
                y: mousePosition.y * 8,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
            />
          </motion.div>

          {/* Grid Pulse */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            animate={{
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Gradient Breathing (Background radial glow) */}
          <motion.div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none z-0"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.6, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-emerald-400/40 rounded-full blur-[0.5px]"
                style={{
                  width: `${3 + (i % 3)}px`,
                  height: `${3 + (i % 3)}px`,
                  left: `${(i * 15) + 10}%`,
                  top: `${(i * 12) + 25}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 5, 0],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 14 + (i % 3) * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-0 pointer-events-none" />

          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium mb-3">
                {hero.subtitle}
              </Badge>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-display"
            >
              {hero.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto"
            >
              {hero.description}
            </motion.p>
          </div>
        </motion.section>

        <Breadcrumb />

        {/* 2. Why Join Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-10 text-center">
              Why Join TechVistar?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyJoin.map((item, idx) => {
                const icons = [
                  <Users className="h-5 w-5 text-emerald-600" />,
                  <Briefcase className="h-5 w-5 text-blue-600" />,
                  <Cpu className="h-5 w-5 text-indigo-600" />
                ];
                const iconBgColors = [
                  'bg-emerald-50 border-emerald-100/50',
                  'bg-blue-50 border-blue-100/50',
                  'bg-indigo-50 border-indigo-100/50'
                ];
                const hoverEffects = [
                  'hover:border-emerald-300/40 hover:shadow-[0_12px_24px_-10px_rgba(16,185,129,0.12)]',
                  'hover:border-blue-300/40 hover:shadow-[0_12px_24px_-10px_rgba(59,130,246,0.12)]',
                  'hover:border-indigo-300/40 hover:shadow-[0_12px_24px_-10px_rgba(99,102,241,0.12)]'
                ];
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 flex flex-col items-start ${hoverEffects[idx % hoverEffects.length]}`}
                  >
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 ${iconBgColors[idx % iconBgColors.length]}`}>
                      {icons[idx % icons.length]}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-semibold">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Open Positions (Full-Time) */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Open Positions (Full-Time)
              </h2>
            </div>

            {fullTimePositions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fullTimePositions.map((job) => (
                  <Card key={job.id} className="border-slate-200 hover:border-primary/20 hover:shadow-md transition-all flex flex-col bg-white overflow-hidden">
                    {jobImages[job.slug] && (
                      <div className="h-44 overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center relative p-3">
                        <img 
                          src={jobImages[job.slug]} 
                          alt={job.title} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <CardHeader className="p-5 pb-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-none font-medium text-[10px]">
                          {job.department}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {job.experience}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {job.title}
                      </CardTitle>
                      <div className="flex gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.employmentType}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex-grow flex flex-col justify-between">
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        {job.description}
                      </p>
                      <Button asChild className="w-full bg-slate-900 text-white hover:bg-slate-800 font-semibold mt-auto">
                        <a href={job.applyUrl}>Apply Now</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 border border-slate-100 p-6 rounded-lg text-center">
                No active full-time positions available. Check back soon or submit an open application below.
              </p>
            )}
          </div>
        </section>

        {/* 4. Internship Opportunities */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Internship Opportunities
              </h2>
            </div>

            {internshipPositions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {internshipPositions.map((job, idx) => {
                  const colors = [
                    'bg-emerald-50/40 border-emerald-200/60',
                    'bg-blue-50/40 border-blue-200/60',
                    'bg-amber-50/40 border-amber-200/60',
                    'bg-indigo-50/40 border-indigo-200/60'
                  ];
                  const colorClass = colors[idx % colors.length];
                  return (
                    <Card key={job.id} className={`hover:shadow-md transition-all flex flex-col ${colorClass} overflow-hidden`}>
                      {jobImages[job.slug] && (
                        <div className="h-44 overflow-hidden bg-white/30 border-b border-slate-200/40 flex items-center justify-center relative p-3">
                          <img 
                            src={jobImages[job.slug]} 
                            alt={job.title} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    <CardHeader className="p-5 pb-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge className="bg-emerald-550/10 text-emerald-650 hover:bg-emerald-550/15 border-none font-medium text-[10px]">
                          {job.department}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {job.experience}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {job.title}
                      </CardTitle>
                      <div className="flex gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.employmentType}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex-grow flex flex-col justify-between">
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        {job.description}
                      </p>
                      <Button asChild className="w-full bg-slate-900 text-white hover:bg-slate-800 font-semibold mt-auto">
                        <a href={job.applyUrl}>Apply Now</a>
                      </Button>
                    </CardContent>
                  </Card>
                );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 bg-white border border-slate-200 p-6 rounded-lg text-center">
                No active internship positions available at this time.
              </p>
            )}
          </div>
        </section>

        {/* 5. Company Benefits */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-10 text-center">
              TechVistar Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Check className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Hiring Process */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-10 text-center">
              Our Hiring Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 md:before:hidden">
              {hiringProcess.map((step, idx) => {
                const stepStyles = [
                  { badge: 'bg-emerald-500', card: 'bg-emerald-50/30 border-slate-200' },
                  { badge: 'bg-blue-500', card: 'bg-blue-50/30 border-slate-200' },
                  { badge: 'bg-indigo-500', card: 'bg-indigo-50/30 border-slate-200' },
                  { badge: 'bg-amber-500', card: 'bg-amber-50/30 border-slate-200' },
                  { badge: 'bg-rose-500', card: 'bg-rose-50/30 border-slate-200' }
                ];
                const currentStyle = stepStyles[idx % stepStyles.length];
                return (
                  <div key={step.step} className={`border rounded-xl p-5 relative flex gap-4 md:flex-col md:gap-0 transition-all ${currentStyle.card}`}>
                    <div className={`h-8 w-8 rounded-full ${currentStyle.badge} text-white text-xs font-bold flex items-center justify-center shrink-0 mb-3 border-4 border-white shadow-sm`}>
                      {step.step}
                    </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 mb-1 md:mt-2">{step.title}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>

        {/* 7. FAQs Section replaced with unified FAQSection */}
        <FAQSection pageFilter="careers" title="Careers" layout="split" description="Have questions about our interview cycles, hiring timelines, and workplace culture?" />

        {/* 8. Apply CTA Banner */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-8 text-white text-center shadow-md">
              <h2 className="text-xl md:text-2xl font-bold font-display mb-3">
                {applyCTA.title}
              </h2>
              <p className="text-white/80 text-xs md:text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                {applyCTA.description}
              </p>
              <Button asChild className="bg-white text-primary hover:bg-slate-50 font-bold border-none shadow-none px-6 py-2.5 rounded-lg">
                <a href={applyCTA.emailUrl}>{applyCTA.buttonText}</a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Careers;
