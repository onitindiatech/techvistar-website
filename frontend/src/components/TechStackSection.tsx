import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { TechStackLogo } from '@/components/common/TechStackLogo';

interface TechItem {
  name: string;
  category: string;
}

export const TechStackSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const row1Techs: TechItem[] = [
    { name: 'HTML5', category: 'Frontend' },
    { name: 'CSS3', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Bootstrap', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Java', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Firebase', category: 'Database' },
  ];

  const row2Techs: TechItem[] = [
    { name: 'Docker', category: 'Cloud & DevOps' },
    { name: 'Kubernetes', category: 'Cloud & DevOps' },
    { name: 'AWS', category: 'Cloud & DevOps' },
    { name: 'Azure', category: 'Cloud & DevOps' },
    { name: 'Git', category: 'Cloud & DevOps' },
    { name: 'GitHub', category: 'Cloud & DevOps' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'Android', category: 'Mobile' },
    { name: 'Swift', category: 'Mobile' },
    { name: 'OpenAI', category: 'AI' },
    { name: 'ChatGPT', category: 'AI' },
    { name: 'Claude', category: 'AI' },
    { name: 'TensorFlow', category: 'AI' },
    { name: 'LangChain', category: 'AI' },
    { name: 'Pinecone', category: 'AI' },
    { name: 'Shopify', category: 'CMS' },
    { name: 'WordPress', category: 'CMS' },
  ];

  const fullRow1 = [...row1Techs, ...row1Techs, ...row1Techs];
  const fullRow2 = [...row2Techs, ...row2Techs, ...row2Techs];

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-sky-50/45 via-white to-emerald-50/25 pt-10 pb-10 md:pt-12 md:pb-12 border-y border-slate-100">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="network-grid" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#059669" />
              <circle cx="70" cy="50" r="1.5" fill="#0284c7" />
              <circle cx="110" cy="90" r="1.5" fill="#059669" />
              <line x1="10" y1="10" x2="70" y2="50" stroke="#000" strokeWidth="0.5" />
              <line x1="70" y1="50" x2="110" y2="90" stroke="#000" strokeWidth="0.5" />
              <line x1="110" y1="90" x2="10" y2="10" stroke="#000" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>
      </div>

      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 select-none" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-emerald-500/10 rounded-full blur-[1px] border border-emerald-500/5"
              style={{
                width: `${10 + (i % 4) * 8}px`,
                height: `${10 + (i % 4) * 8}px`,
                left: `${i * 9 + 4}%`,
                top: `${i * 7 + 8}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 12 + (i % 3) * 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-xs font-semibold uppercase tracking-wider mx-auto">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Technology Stack
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Trusted Technologies We Build With
          </h2>

          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            We build scalable digital products using modern technologies trusted by startups and enterprises worldwide.
          </p>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee-ltr {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .tech-track-ltr {
          display: flex;
          width: max-content;
          animation: marquee-ltr 50s linear infinite;
        }
        .tech-track-rtl {
          display: flex;
          width: max-content;
          animation: marquee-rtl 50s linear infinite;
        }
        .tech-scroller:hover .tech-track-ltr,
        .tech-scroller:hover .tech-track-rtl {
          animation-play-state: paused;
        }
      `,
        }}
      />

      <div className="space-y-6 relative z-10 max-w-full overflow-hidden select-none">
        <div className="tech-scroller flex w-full overflow-hidden py-2">
          <div className="tech-track-ltr gap-4">
            {fullRow1.map((tech, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-emerald-500/30 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-[350ms] ease-out group cursor-pointer"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100/50 bg-white/80 p-1.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <TechStackLogo
                    name={tech.name}
                    size="sm"
                    loading="eager"
                    priority
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 leading-none">{tech.name}</div>
                  <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {tech.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tech-scroller flex w-full overflow-hidden py-2">
          <div className="tech-track-rtl gap-4">
            {fullRow2.map((tech, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-emerald-500/30 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-[350ms] ease-out group cursor-pointer"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100/50 bg-white/80 p-1.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <TechStackLogo
                    name={tech.name}
                    size="sm"
                    loading="eager"
                    priority
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 leading-none">{tech.name}</div>
                  <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {tech.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
