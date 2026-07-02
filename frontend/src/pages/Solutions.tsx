import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Building2, Brain, Sparkles, Cloud, Target, 
  Layers, Code2, Cpu, Repeat, Settings, FolderGit2, Shield, 
  ArrowRight
} from 'lucide-react';
import workBg from '../assets/work-bg.png';

export const Solutions = () => {
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

  const businessSolutions = [
    { title: 'Enterprise Software', desc: 'Custom core operational software systems built to streamline company resource allocation, workflow data pipelines, and administrative controls.', icon: Building2 },
    { title: 'CRM Systems', desc: 'Secure platforms centralizing client communications, lead pipeline analytics, and support ticketing triggers.', icon: Target },
    { title: 'ERP Platforms', desc: 'Integrated databases consolidating inventory tracking, accounting audits, and supply chain coordinates.', icon: Layers },
    { title: 'Business Automation', desc: 'Deploy workflow runners and background jobs that automatically consolidate operational reporting.', icon: Repeat }
  ];

  const aiSolutions = [
    { title: 'AI Chatbots', desc: 'Conversational support agents leveraging fine-tuned large language models mapped against company data vaults.', icon: Brain },
    { title: 'AI Agents', desc: 'Autonomous system workers performing recurring file extractions, updates, and messaging tasks.', icon: Cpu },
    { title: 'Generative AI', desc: 'Custom neural models trained to output marketing creative copy, structured documents, or system designs.', icon: Sparkles },
    { title: 'Document Intelligence', desc: 'Extract clean metadata and classification lists from raw PDFs, receipts, and invoices using advanced OCR pipelines.', icon: FolderGit2 }
  ];

  const digitalSolutions = [
    { title: 'Cloud Migration', desc: 'Migrate legacy local hardware architectures into secure cloud environments built to scale under spike requests.', icon: Cloud },
    { title: 'API Integration', icon: Code2, desc: 'Third-party unified API systems matching standard enterprise webhooks.' },
    { title: 'Data Analytics', desc: 'Interactive visual intelligence dashboards consolidating operational performance databases.', icon: Settings },
    { title: 'Cyber Security', desc: 'Implement absolute endpoint encryption, vulnerability check triggers, and role-based login compliance.', icon: Shield }
  ];

  return (
    <>
      {/* Light Theme Background matching About, Services, and Industries */}
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-16">
        <Navbar />

        {/* HERO SECTION - Matching Portfolio and About */}
        <section 
          className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-36 md:pb-24 border-b border-zinc-900 text-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Shifting green waves / glow effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen"
              style={{ backgroundImage: `url(${workBg})` }}
            />
            <motion.div 
              animate={{ 
                x: [0, 20, -15, 0],
                y: [0, -15, 20, 0],
                scale: [1, 1.15, 0.9, 1]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[130px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -25, 20, 0],
                y: [0, 20, -25, 0],
                scale: [1, 0.85, 1.15, 1]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[130px]" 
            />
          </motion.div>

          <div className="container-custom max-w-7xl mx-auto px-6 relative z-10 space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Capabilities</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1]">
                Enterprise Solutions
              </h1>
              
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-semibold max-w-2xl">
                Deploying robust business automation, production-grade intelligence models, and highly secure cloud environments built to scale operations.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: BUSINESS SOLUTIONS */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10 space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Optimize Operations</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Business Solutions</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-2xl">
              Replace fragmented tools with centralized enterprise platforms built to automate workflows and preserve database compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessSolutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <motion.div 
                  key={sol.title}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-md hover:border-emerald-500/25 transition-colors text-slate-900"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{sol.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{sol.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION: AI SOLUTIONS */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="mb-10 space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Cognitive Systems</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">AI Solutions</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-2xl">
              Integrate autonomous intelligence agents, document classification solvers, and predictive models into your business backend.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiSolutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <motion.div 
                  key={sol.title}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-md hover:border-emerald-500/25 transition-colors text-slate-900"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{sol.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{sol.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION: DIGITAL SOLUTIONS */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/80">
          <div className="mb-10 space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Infrastructure & Security</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Digital Solutions</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-2xl">
              Establish secure API endpoints, redundant container networks, and encryption compliance protocols.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {digitalSolutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <motion.div 
                  key={sol.title}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-md hover:border-emerald-500/25 transition-colors text-slate-900"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{sol.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{sol.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TRUSTED BY CLIENT LOGOS SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-6 border-t border-slate-200/80 mt-10 relative z-10 text-center space-y-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-45">
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Microsoft</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Google</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">AWS</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Airbnb</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Intel</span>
            <span className="text-sm font-bold tracking-wider text-slate-600 hover:opacity-100 hover:text-emerald-600 transition-all cursor-default">Netflix</span>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="container-custom max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-3xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/85 p-8 sm:p-12 text-center relative overflow-hidden shadow-md text-slate-900"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-2xl mx-auto relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">Ready to Deploy a Solution?</h3>
              <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed">
                Connect with our engineering leads to outline timelines, compliance metrics, and technical requirements.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-md">
                    Book Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-12 px-8 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-slate-700 text-sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Solutions;
