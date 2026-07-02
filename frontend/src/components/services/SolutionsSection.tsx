import { Service } from '@/data/services';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import '../ui/GlassIcons.css';

interface SectionProps {
  service: Service;
}

interface DetailedOffering {
  title: string;
  description: string;
  badges: string[];
  illustration: React.ReactNode;
  color: string;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

export const SolutionsSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Custom data specifically for the AI & Automation page with color themes
  const aiOfferings: DetailedOffering[] = [
    {
      title: 'AI Chatbots',
      description: 'Intelligent conversational assistants powered by LLMs for automated customer service.',
      badges: ['GPT-4', 'WhatsApp', 'Website'],
      color: 'green',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'AI Agents',
      description: 'Autonomous agents that plan and execute multi-step workflows with external tools.',
      badges: ['LangChain', 'CrewAI', 'Python'],
      color: 'blue',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="3" />
          <path d="M12 8v3M9 16h6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Workflow Automation',
      description: 'Connect internal apps to automate data entries, syncs, and notification schedules.',
      badges: ['n8n', 'Make', 'REST APIs'],
      color: 'purple',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="6" cy="15" r="2.5" />
          <circle cx="18" cy="15" r="2.5" />
          <path d="M12 7.5v5m0 0L7.75 14M12 12.5l4.25 1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'LLM Integration',
      description: 'Wire state-of-the-art language models directly into your business services database.',
      badges: ['OpenAI', 'Claude', 'Llama 3'],
      color: 'orange',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707.707m2.808 13.066l.233-1.296M16.657 6.343l-.707-.707" />
        </svg>
      )
    },
    {
      title: 'RAG Systems',
      description: 'Implement Retrieval-Augmented Generation to restrict LLMs to your secure documentation.',
      badges: ['Pinecone', 'Pgvector', 'PDFs'],
      color: 'red',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17h6M9 13h6M9 9h6" strokeLinecap="round" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      title: 'AI Assistants',
      description: 'Custom integrated tools that run contextually inside slack, browsers or local software.',
      badges: ['Copilot', 'Chrome Ext', 'Slack'],
      color: 'indigo',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.813 15.904L9 21l5.426-3.305L20 21V9a2 2 0 00-2-2h-8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 5.5l1.5-1.5 1.5 1.5M13 4v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Custom AI Solutions',
      description: 'Completely customized models, data pipelines, and private servers configured for operations.',
      badges: ['PyTorch', 'AWS GPU', 'Custom API'],
      color: 'green',
      illustration: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0h1.5m-9-9v-1.5m0 16.5V18m-6-6l-1.05-1.05m14.1 14.1l-1.05-1.05m0-12l1.05-1.05M5.55 18.45l1.05-1.05" />
        </svg>
      )
    }
  ];

  const isAiService = service.slug === 'ai-automation';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getBackgroundStyle = (color: string) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <section id="offerings" className="relative overflow-hidden bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-6 md:p-10 scroll-mt-24 shadow-sm">
      
      {/* Light mesh and blurred radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="card-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#card-mesh)" />
        </svg>
      </div>

      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl pointer-events-none z-0" />

      {/* Title */}
      <div className="relative z-10 flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Offerings</h2>
      </div>

      {isAiService ? (
        /* Premium redesigned offerings grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          {aiOfferings.map((offering, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-slate-100 hover:border-emerald-500/30 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(16,185,129,0.12)] transition-all duration-300"
            >
              <div>
                {/* Header: Glass Icon Wrapper and Label */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  
                  {/* Integrated GlassIcon style wrapper */}
                  <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
                    <span className="icon-btn__back" style={getBackgroundStyle(offering.color)}></span>
                    <span className="icon-btn__front">
                      <span className="icon-btn__icon">
                        {offering.illustration}
                      </span>
                    </span>
                  </div>
                  
                  {/* Learn More arrow sliding on hover */}
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors font-display">
                  {offering.title}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {offering.description}
                </p>
              </div>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-100/50">
                {offering.badges.map((tech, techIdx) => (
                  <Badge
                    key={techIdx}
                    variant="secondary"
                    className="text-[9px] font-semibold bg-emerald-50/60 text-emerald-700 border border-emerald-100/30 px-2 py-0.5 rounded-md"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Fallback standard offerings grid for other pages */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {service.offerings.map((offering, i) => (
            <div
              key={i}
              className="flex gap-3 text-sm text-slate-700 leading-relaxed items-start p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-emerald-500/20 hover:shadow transition-all"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="font-medium">{offering}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default SolutionsSection;
