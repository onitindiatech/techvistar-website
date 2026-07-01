import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { INDUSTRIES } from '@/data/industries';
import { SERVICES } from '@/data/services';
import { PROJECTS } from '@/data/projects';
import { PROCESS_STEPS } from '@/data/process';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  ChevronRight, 
  AlertTriangle, 
  Lightbulb, 
  Check, 
  Layers, 
  Briefcase, 
  Cpu, 
  Workflow, 
  HelpCircle 
} from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import servicesBg from '../assets/services-bg.png'; // Reusing premium background asset

export const IndustryDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Find dynamic industry details
  const industry = INDUSTRIES.find((i) => i.slug === slug);

  // Set page title & reset scroll
  useEffect(() => {
    if (industry) {
      document.title = `${industry.title} Industry Solutions | TechVistar`;
    } else {
      document.title = 'Industry Not Found | TechVistar';
    }
    window.scrollTo(0, 0);
  }, [industry]);

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

  if (!industry) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight mb-3">
              Industry Not Found
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              We couldn't find the industry sector you were looking for. It may have been moved or updated.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
              <Link to="/industries">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Industries
              </Link>
            </Button>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  const Icon = industry.icon;

  // Resolve related services and projects objects
  const relatedServicesData = SERVICES.filter((s) => industry.services.includes(s.slug) && s.status === 'active');
  const relatedProjectsData = PROJECTS.filter((p) => industry.caseStudies.includes(p.slug));

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden bg-zinc-950 pt-24 pb-16 md:pt-28 md:pb-24 border-b border-zinc-900"
        >
          {/* Background Mesh Wave */}
          <motion.div 
            className="absolute inset-0 opacity-80 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${servicesBg})`,
              backgroundSize: 'auto 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
            animate={{
              x: [0, 5, 0],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${servicesBg})`,
                backgroundSize: 'auto 100%',
                backgroundPosition: 'right',
                backgroundRepeat: 'no-repeat',
              }}
              animate={{
                x: mousePosition.x * 6,
                y: mousePosition.y * 6,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            />
          </motion.div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Dynamic background glow matching industry color */}
          <div className={`absolute right-1/4 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-br ${industry.industriesColor} opacity-[0.08] blur-[100px] pointer-events-none`} />

          <div className="container-custom max-w-5xl mx-auto px-4 relative z-10">
            <Link 
              to="/industries" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-450 hover:text-emerald-350 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Industries</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap gap-2 items-center mb-4">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
                    Industry Specialization
                  </Badge>
                  {relatedProjectsData.length > 0 && (
                    <Badge variant="secondary" className="bg-white/10 text-white font-semibold text-[10px] px-2 py-0.5 border border-white/5">
                      {relatedProjectsData.length} Case Studies Deployed
                    </Badge>
                  )}
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  {industry.title}
                </h1>
                <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-350 font-medium leading-relaxed max-w-3xl">
                  {industry.shortDescription}
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <div className={`p-8 rounded-3xl bg-gradient-to-br ${industry.industriesColor} text-white shadow-xl shadow-emerald-950/20 ring-4 ring-white/5`}>
                  <Icon className="h-16 w-16" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Core Layout Grid */}
        <section className="py-12 md:py-20 container-custom max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12 md:space-y-16">
              
              {/* Overview Section */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Overview & Focus
                </h2>
                <p className="text-slate-650 text-sm sm:text-base leading-relaxed font-medium">
                  {industry.description}
                </p>
              </div>

              {/* Challenges Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Business Challenges
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {industry.challenges.map((challenge, index) => (
                    <Card key={index} className="border border-slate-200/80 bg-white p-5 rounded-2xl shadow-sm">
                      <h3 className="font-display font-bold text-slate-900 text-base mb-2">
                        {index + 1}. {challenge.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                        {challenge.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Solutions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-emerald-500 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Our Solutions
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {industry.solutions.map((solution, index) => (
                    <Card key={index} className="border border-emerald-100 bg-emerald-50/[0.25] p-5 rounded-2xl shadow-sm">
                      <div className="flex gap-3">
                        <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-slate-900 text-base mb-1.5">
                            {solution.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                            {solution.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Related Services Section */}
              {relatedServicesData.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-slate-650 shrink-0" />
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Related Services
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedServicesData.map((svc) => {
                      const SvcIcon = svc.icon;
                      return (
                        <Link 
                          key={svc.id} 
                          to={`/services/${svc.slug}`}
                          className="group block border border-slate-200 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-primary group-hover:text-white transition-colors">
                              <SvcIcon className="h-5 w-5" />
                            </span>
                            <h3 className="font-display font-bold text-slate-900 group-hover:text-primary transition-colors text-sm sm:text-base">
                              {svc.title}
                            </h3>
                          </div>
                          <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2">
                            {svc.shortDescription}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related Projects Section */}
              {relatedProjectsData.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-slate-650 shrink-0" />
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Related Case Studies
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {relatedProjectsData.map((proj) => (
                      <Link 
                        key={proj.id} 
                        to={`/work/${proj.slug}`}
                        className="group flex flex-col sm:flex-row gap-4 border border-slate-200 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all"
                      >
                        {proj.thumbnail && (
                          <div className="w-full sm:w-1/3 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            <img 
                              src={proj.thumbnail} 
                              alt={proj.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {proj.category}
                            </span>
                            <h3 className="font-display font-bold text-slate-900 group-hover:text-primary transition-colors text-sm sm:text-base mt-1">
                              {proj.title}
                            </h3>
                            <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2 mt-2">
                              {proj.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[10px] font-bold text-slate-400">
                              Client: {proj.client}
                            </span>
                            <span className="text-xs font-bold text-primary flex items-center gap-1">
                              View case study
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Process Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-slate-650 shrink-0" />
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Our Delivery Process
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
                    We follow our structured, governance-first delivery framework to ensure all integrations, security layers, and data contracts remain auditable.
                  </p>
                  <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-8 mt-6">
                    {PROCESS_STEPS.map((step, idx) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={idx} className="relative">
                          {/* Dot step indicator */}
                          <span className="absolute -left-[35px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-emerald-500 text-emerald-600 font-bold text-xs">
                            {idx + 1}
                          </span>
                          <div>
                            <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                              {step.title}
                            </h3>
                            <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed max-w-2xl">
                              {step.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {step.deliverables.map((deliv, dIdx) => (
                                <Badge key={dIdx} variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 font-medium py-0.5 px-2">
                                  {deliv}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {industry.faqs.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-slate-650 shrink-0" />
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {industry.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`}
                        className="border border-slate-200 bg-white rounded-xl px-4 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline font-display font-bold text-slate-800 text-xs sm:text-sm text-left py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed pt-0 pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Stats Card */}
              <Card className="border border-slate-200 bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
                  Metrics & Impact
                </h3>
                <div className="space-y-6">
                  {industry.statistics.map((stat, index) => (
                    <div key={index} className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className={`text-3xl font-black bg-gradient-to-r ${industry.industriesColor} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-slate-800 text-xs sm:text-sm font-bold mt-1">
                        {stat.label}
                      </div>
                      {stat.description && (
                        <p className="text-slate-500 text-xs font-semibold mt-1 leading-relaxed">
                          {stat.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Technologies Card */}
              <Card className="border border-slate-200 bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="h-4.5 w-4.5 text-slate-700" />
                  <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider">
                    Core Stacks
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {industry.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-2.5 py-1 rounded-lg text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>

            </div>

          </div>
        </section>

        {/* Dynamic CTA Section */}
        <section className="bg-zinc-950 border-t border-zinc-900 py-16 md:py-20 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-550/5 blur-[120px] pointer-events-none" />
          
          <div className="container-custom max-w-4xl mx-auto text-center px-4 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-450 mb-3 block">
              {industry.title} Partnering
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {industry.cta.title}
            </h2>
            {industry.cta.subtitle && (
              <p className="mt-4 text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
                {industry.cta.subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto font-bold rounded-xl shadow-lg shadow-emerald-500/10" asChild>
                <Link to={industry.cta.buttonLink}>{industry.cta.buttonText}</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/10 bg-white/5 hover:bg-white/10 hover:text-white font-bold rounded-xl" asChild>
                <Link to="/industries">Browse Other Verticals</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default IndustryDetails;
