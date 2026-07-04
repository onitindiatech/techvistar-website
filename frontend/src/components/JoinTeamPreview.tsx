import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';

const CAREER_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', // Great Culture
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80', // Learning & Growth
  'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=150&auto=format&fit=crop&q=80', // Impactful Work
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&auto=format&fit=crop&q=80', // GenAI & Automation
];

export const JoinTeamPreview = () => {
  const benefits = [
    { label: 'Great Culture', desc: 'Collaborative, open, and friendly workspaces.' },
    { label: 'Learning & Growth', desc: 'Tuition support and fast professional pathways.' },
    { label: 'Impactful Work', desc: 'Build tools used daily by enterprise companies.' },
    { label: 'GenAI & Automation', desc: 'Stay at the frontier of AI research and systems.' }
  ];

  return (
    <section className="pt-12 pb-12 md:pt-16 md:pb-16 bg-slate-50 relative overflow-hidden border-t border-slate-200/60">
      {/* Grid Pattern Background */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1.5px,transparent_1.5px),linear-gradient(to_bottom,#ffffff_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] opacity-40" 
        aria-hidden 
      />
      
      {/* Decorative Glow Blob */}
      <div className="absolute -bottom-20 right-1/4 -z-10 w-[480px] h-[480px] rounded-full bg-emerald-500/[0.04] blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-6 text-left space-y-6">
            <FadeIn direction="right" delay={0.1} duration={0.65}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Careers at TechVistar
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15] mt-4">
                Build Your Future <br />
                <span className="gradient-text">With TechVistar</span>
              </h2>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
                Mark on meaningful projects, solve real-world problems and grow with a team that values engineering discipline and product innovation.
              </p>

              <div className="pt-4">
                <Button 
                  asChild 
                  className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] transition-all duration-300 rounded-xl font-semibold hover:-translate-y-0.5"
                >
                  <Link to="/careers" className="group inline-flex items-center gap-2">
                    View Openings
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Benefits Grid */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => {
              return (
                <FadeIn 
                  key={benefit.label} 
                  direction="up" 
                  delay={0.15 + idx * 0.08} 
                  duration={0.55}
                  className="h-full"
                >
                  <div className="group relative p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:border-emerald-500/20 transition-all duration-300 h-full flex flex-col justify-between hover:shadow-md hover:bg-emerald-500/[0.01]">
                    {/* Hover micro glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-slate-100 shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:ring-emerald-500/20">
                        <img
                          src={CAREER_IMAGES[idx]}
                          alt={benefit.label}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {benefit.label}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1 font-semibold">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default JoinTeamPreview;
