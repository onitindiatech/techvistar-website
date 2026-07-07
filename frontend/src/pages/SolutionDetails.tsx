import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Building2, Brain, Sparkles, Cloud, Target, 
  Layers, Code2, Cpu, Repeat, Settings, FolderGit2, Shield, 
  ArrowRight, Sparkle, Loader2, ArrowUpRight, HelpCircle,
  Clock, ShieldCheck, Award, MessageSquare, CheckCircle2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSolutionBySlug, getActiveSolutions } from '@/services/solutions.service';
import { decorateSolution, SolutionDetail } from '@/data/solutions';
import workBg from '../assets/work-bg.png';
import challengesImg from '../assets/ai_overview_illustration.png';
import { cn } from '@/lib/utils';

// FAQ Accordion sub-component
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

export const SolutionDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { data: apiSolution, isLoading: isDetailLoading } = useQuery({
    queryKey: ['solutionDetails', slug],
    queryFn: () => getSolutionBySlug(slug || ''),
    enabled: !!slug,
  });

  const solution = apiSolution ? decorateSolution(apiSolution) : undefined;

  const { data: apiSolutions } = useQuery({
    queryKey: ['activeSolutions'],
    queryFn: () => getActiveSolutions(),
    enabled: !!solution,
  });

  const solutionsData = (apiSolutions || []).map(decorateSolution);

  useEffect(() => {
    if (!isDetailLoading && !solution && slug !== undefined) {
      navigate('/solutions');
    }
  }, [isDetailLoading, solution, slug, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  if (isDetailLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-slate-500 font-display flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            Loading solution details...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!solution) return null;

  const MainIcon = solution.icon;

  // Stagger variants
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 22 }
    }
  };

  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {isDetailLoading ? (
            <motion.div 
              key="loading-skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Loading Solution...</span>
            </motion.div>
          ) : (
            <motion.div
              key="page-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* 1. PREMIUM HERO SECTION */}
              <section 
                className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-36 md:pb-24 border-b border-zinc-900 text-white select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Background Shifting Lights */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-screen"
                    style={{ backgroundImage: `url(${workBg})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
                  
                  <motion.div 
                    animate={{ 
                      x: [0, 20, -15, 0],
                      y: [0, -15, 20, 0],
                      scale: [1, 1.15, 0.9, 1]
                    }}
                    style={{ x: mousePosition.x * 40, y: mousePosition.y * 40 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[130px]" 
                  />
                  <motion.div 
                    animate={{ 
                      x: [0, -25, 20, 0],
                      y: [0, 20, -25, 0],
                      scale: [1, 0.85, 1.15, 1]
                    }}
                    style={{ x: mousePosition.x * -40, y: mousePosition.y * -40 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[130px]" 
                  />
                </div>

                <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                    <MainIcon className="w-3.5 h-3.5" />
                    <span>{solution.category}</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1] max-w-4xl">
                    {solution.title}
                  </h1>

                  <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-semibold max-w-2xl">
                    {solution.subtitle}
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4 font-bold text-xs sm:text-sm">
                    <Link to="/contact">
                      <Button className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white rounded-xl transition-all shadow-md flex items-center gap-2">
                        <span>Discuss Your Requirements</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" className="h-12 px-6 border-zinc-800 hover:bg-zinc-900 text-slate-300 rounded-xl transition-all flex items-center gap-2">
                        <span>Request Solution Demo</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

              {/* 2. BUSINESS CHALLENGES */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                  
                  {/* Left Column: Heading */}
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Operational Obstacles</span>
                    <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight leading-snug">
                      The Business Challenges We Solve
                    </h2>
                    <div className="w-12 h-1 bg-emerald-500/50 mt-2 rounded-full" />
                    <div className="mt-8 relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm group">
                      <div className="absolute inset-0 bg-emerald-500/10 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
                      <img src={challengesImg} alt="Operational Challenges" className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  </div>

                  {/* Right Column: Challenges List */}
                  <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">{solution.challenges.title}</h3>
                    
                    <div className="space-y-4 font-semibold text-xs sm:text-sm text-slate-600 flex-grow mt-6">
                      {solution.challenges.points.map((pt, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 border border-red-100 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">!</span>
                          <p>{pt}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 border border-slate-200/40 rounded-xl p-4 mt-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Impact</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 leading-relaxed">{solution.challenges.impact}</p>
                    </div>
                  </div>

                </div>
              </section>

              {/* 3. OUR SOLUTION SECTION */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="grid lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Solution Detail */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Proposed Architecture</span>
                    <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                      Our Tailored Approach
                    </h2>
                    <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed">
                      {solution.ourSolution.overview}
                    </p>

                    <div className="space-y-4 font-bold text-xs sm:text-sm text-slate-700">
                      {solution.ourSolution.capabilities.map((cap, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-4 h-4" /></span>
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Visual Mockup Box */}
                  <div className="lg:col-span-5 h-72 sm:h-80 rounded-2xl bg-white border border-slate-200/60 p-6 flex flex-col justify-between shadow-md relative overflow-hidden select-none">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-slate-200" />
                        <span className="w-3 h-3 rounded-full bg-slate-200" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Verification Node</span>
                    </div>

                    <div className="space-y-3 pt-3 flex-grow flex flex-col justify-center">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-emerald-500 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Deploy Compliance Status</span>
                        <span className="text-emerald-600">67% Ready</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-emerald-600 uppercase">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SOC2 Standard Verified</span>
                      </div>
                      <span>ISO 27001 compliant</span>
                    </div>
                  </div>

                </div>
              </section>

              {/* 4. KEY FEATURES SECTION */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Engine Capabilities</span>
                  <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">Key Features</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                    Designed from the ground up for transaction reliability, custom integrations, and seamless telemetry tracking.
                  </p>
                </div>

                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  {solution.features.map((feat) => {
                    const FeatIcon = feat.icon;
                    return (
                      <motion.div
                        key={feat.title}
                        variants={cardVariants}
                        whileHover={{ y: -4 }}
                        className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm hover:border-emerald-500/25 transition-all group"
                      >
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit group-hover:scale-110 transition-transform duration-300">
                          <FeatIcon className="w-5.5 h-5.5" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                          {feat.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </section>

              {/* 5. HOW IT WORKS TIMELINE */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="mb-12 text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Implementation Timeline</span>
                  <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">How It Works</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                    A structured lifecycle from technical specifications definition through modular staging and telemetry-backed deployment.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                  {solution.howItWorks.map((step, idx) => (
                    <div key={idx} className="relative space-y-4 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                      <span className="text-3xl font-black font-display text-emerald-600/35 block leading-none">{step.step}</span>
                      <h4 className="font-extrabold text-slate-900 text-base leading-tight">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. BUSINESS BENEFITS (ROI) */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Business Outcomes</span>
                  <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">Measurable Benefits</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Return on Investment', value: solution.benefits.roi, icon: Award },
                    { label: 'Operational Efficiency', value: solution.benefits.efficiency, icon: Clock },
                    { label: 'Scalability Profile', value: solution.benefits.scalability, icon: Layers },
                    { label: 'Security & Integrity', value: solution.benefits.security, icon: ShieldCheck }
                  ].map((benefit, index) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <div key={index} className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-3 shadow-sm">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                          <BenefitIcon className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{benefit.label}</h4>
                        <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">{benefit.value}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 7. INDUSTRIES SERVED */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="mb-8">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Target Sectors</span>
                  <h3 className="text-2xl font-extrabold font-display text-slate-900 mt-1">Industries Served</h3>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {solution.industries.map((ind, index) => (
                    <Link to={`/industries`} key={index}>
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="bg-white border border-slate-200/60 rounded-2xl p-5 flex justify-between items-center shadow-sm hover:border-emerald-500/20 group"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm sm:text-base">{ind.name}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* 8. TECHNOLOGY STACK */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/80">
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Unified Platform Core</span>
                    <h4 className="text-xl font-extrabold font-display text-slate-900">Supported Technology Stack</h4>
                    <p className="text-xs text-slate-500 font-semibold">Consolidated engineering specifications mapped to our deployments.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:max-w-lg justify-end">
                    {solution.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-600 font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* 9. SUCCESS METRICS */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/80">
                <div className="grid md:grid-cols-2 gap-6">
                  {solution.metrics.map((met, index) => (
                    <div key={index} className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{met.label}</span>
                      <span className="text-4xl sm:text-5xl font-black text-emerald-600 mt-2 block">{met.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 10. RELATED SOLUTIONS */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="mb-8">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Cross Capability Sync</span>
                  <h3 className="text-2xl font-extrabold font-display text-slate-900 mt-1">Related Solutions</h3>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {solutionsData
                    .filter((sol) => sol.slug !== solution.slug)
                    .slice(0, 3)
                    .map((relatedSol) => {
                      const RelatedIcon = relatedSol.icon;
                      return (
                        <Link to={`/solutions/${relatedSol.slug}`} key={relatedSol.slug}>
                          <motion.div 
                            whileHover={{ y: -3 }}
                            className="bg-white border border-slate-200/60 rounded-2xl p-5 flex gap-4 items-center shadow-sm hover:border-emerald-500/25 transition-all group"
                          >
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform shrink-0">
                              <RelatedIcon className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm sm:text-base leading-snug truncate">{relatedSol.title}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{relatedSol.category}</p>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                </div>
              </section>

              {/* 11. FAQs */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-3">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block">Technical Queries</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-snug">Frequently Asked Questions</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">Scope, integration coordinates, and operational updates SLAs.</p>
                  </div>

                  <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-900">
                    {solution.faqs.map((faq, idx) => (
                      <FAQAccordion key={idx} question={faq.q} answer={faq.a} />
                    ))}
                  </div>
                </div>
              </section>

              {/* 12. ENTERPRISE CTA */}
              <section className="container-custom max-w-7xl mx-auto px-6 py-12">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="rounded-3xl bg-zinc-950 border border-zinc-900 p-8 sm:p-12 text-center relative overflow-hidden shadow-xl text-white select-none"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="max-w-2xl mx-auto relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ready to Deploy?</span>
                    </div>

                    <h3 className="text-2xl sm:text-4.5xl font-extrabold font-display text-white tracking-tight leading-none">Discuss Your Requirements</h3>
                    <p className="text-slate-400 font-semibold text-sm sm:text-base leading-relaxed">
                      Connect with our consulting architects to review system design specs, configure API tokens, and align operational milestones.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-bold">
                      <Link to="/contact">
                        <Button className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white rounded-xl transition-all shadow-md">
                          Schedule Discovery Call
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="outline" className="h-12 px-6 border-zinc-800 hover:bg-zinc-900 text-slate-300 rounded-xl transition-all">
                          Request Custom Proposal
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </>
  );
};

export default SolutionDetails;
