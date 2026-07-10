import { SolutionDetail } from '@/data/solutions';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionProps {
  solution: SolutionDetail;
}

interface TechStyle {
  borderColor: string;
  textColor: string;
  bg: string;
  hoverBg: string;
  glowColor: string;
  icon: React.ReactNode;
}

export const SolutionTechStackSection = ({ solution }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  // Helper dictionary of brand styles, text colors, background colors and SVG logos for each technology
  const getTechStyle = (name: string): TechStyle => {
    const formattedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    switch (formattedName) {
      case 'react':
      case 'reactnative':
        return {
          borderColor: 'rgba(97, 218, 251, 0.4)',
          bg: 'rgba(97, 218, 251, 0.06)',
          textColor: '#0284c7',
          hoverBg: 'rgba(97, 218, 251, 0.12)',
          glowColor: 'rgba(97, 218, 251, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 10.6c0-1.1-.8-2-2.1-2.6-1.5-.7-3.6-1.2-6-1.4 0-.1 0-.3-.1-.4C16.8 4 17.2 2 16.7.9c-.3-.7-1-1-1.8-1-.7 0-1.4.3-2 1C11.5 2.5 10.6 4.7 10 7.2c-2.4.2-4.5.7-6 1.4-1.3.6-2.1 1.5-2.1 2.6 0 1.1.8 2 2.1 2.6 1.5.7 3.6 1.2 6 1.4.1.9.4 1.8.8 2.6.9 2 2.2 3.6 3.4 4.5.5.4 1 .6 1.5.6.8 0 1.5-.3 1.8-1 .5-1.1.1-3.1-.9-5.3-.1-.2-.2-.4-.3-.6 2.4-.2 4.5-.7 6-1.4 1.3-.6 2.1-1.5 2.1-2.6zm-12 3.9c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
            </svg>
          )
        };
      case 'typescript':
        return {
          borderColor: 'rgba(49, 120, 198, 0.4)',
          bg: 'rgba(49, 120, 198, 0.06)',
          textColor: '#1e3a8a',
          hoverBg: 'rgba(49, 120, 198, 0.12)',
          glowColor: 'rgba(49, 120, 198, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#3178C6]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h24v24H0V0zm20.1 17.5c-.2-1.7-1.3-2.5-3.1-2.5-1.8 0-2.9.9-2.9 2.4 0 1.4.9 2 2.4 2.5 1.4.4 2 .7 2 1.2 0 .5-.5.8-1.2.8-.9 0-1.5-.4-1.7-1.3h-2.1c.2 2.1 1.7 3.1 3.8 3.1 2.3 0 3.4-1.1 3.4-2.8 0-1.7-1.1-2.4-2.8-3-1.3-.4-1.8-.7-1.8-1.2 0-.4.4-.7 1-.7s1.3.3 1.5 1h2zm-8.3-6.5h-5.2v8.9H4.7V11h7.1v1.6z" />
            </svg>
          )
        };
      case 'nextjs':
        return {
          borderColor: 'rgba(0, 0, 0, 0.3)',
          bg: 'rgba(0, 0, 0, 0.04)',
          textColor: '#0f172a',
          hoverBg: 'rgba(0, 0, 0, 0.08)',
          glowColor: 'rgba(0, 0, 0, 0.15)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#000000]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.7 18l-5.6-7.3v7.3H10v-10h1.8l5.2 6.8V8h2.1v10h-1.4z" />
            </svg>
          )
        };
      case 'tailwindcss':
      case 'tailwindtokens':
        return {
          borderColor: 'rgba(6, 182, 212, 0.4)',
          bg: 'rgba(6, 182, 212, 0.06)',
          textColor: '#0891b2',
          hoverBg: 'rgba(6, 182, 212, 0.12)',
          glowColor: 'rgba(6, 182, 212, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6h-6zm-6 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6H6zm0 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6H6zm-6 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6H0z" />
            </svg>
          )
        };
      case 'nodejs':
        return {
          borderColor: 'rgba(51, 153, 51, 0.4)',
          bg: 'rgba(51, 153, 51, 0.06)',
          textColor: '#15803d',
          hoverBg: 'rgba(51, 153, 51, 0.12)',
          glowColor: 'rgba(51, 153, 51, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#339933]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L2.3 5.6v11.2L12 22.4l9.7-5.6V5.6L12 0zm4.5 15.2c-.3.5-.7.9-1.2 1.2-.5.3-1.1.4-1.8.4-1 0-1.7-.3-2.2-1-.3-.4-.5-.9-.5-1.6v-3.5h2v3.4c0 .4.1.7.3.9.2.2.5.3.9.3.4 0 .7-.1.9-.3.2-.2.3-.5.3-.9v-3.4h2v6.5zm-5-6.5v2h-2v-2h2zm0 3.5v3h-2v-3h2z" />
            </svg>
          )
        };
      case 'vite':
        return {
          borderColor: 'rgba(100, 108, 255, 0.4)',
          bg: 'rgba(100, 108, 255, 0.06)',
          textColor: '#6d28d9',
          hoverBg: 'rgba(100, 108, 255, 0.12)',
          glowColor: 'rgba(100, 108, 255, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#646CFF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L1.5 4l2.5 16.5L12 24l8-3.5L22.5 4z" />
            </svg>
          )
        };
      case 'flutter':
        return {
          borderColor: 'rgba(2, 86, 155, 0.4)',
          bg: 'rgba(2, 86, 155, 0.06)',
          textColor: '#0369a1',
          hoverBg: 'rgba(2, 86, 155, 0.12)',
          glowColor: 'rgba(2, 86, 155, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#02569B]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.314 0L2.3 12l3.6 3.6 12.014-12.014h-3.6zM2.3 12l3.6 3.6 6.007-6.007-3.6-3.6L2.3 12zm15.614 3.6H14.3l-6.007 6.007L11.9 24.014l6.014-6.014z" />
            </svg>
          )
        };
      case 'swift':
        return {
          borderColor: 'rgba(240, 81, 56, 0.4)',
          bg: 'rgba(240, 81, 56, 0.06)',
          textColor: '#c2410c',
          hoverBg: 'rgba(240, 81, 56, 0.12)',
          glowColor: 'rgba(240, 81, 56, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#F05138]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )
        };
      case 'firebase':
        return {
          borderColor: 'rgba(255, 202, 40, 0.4)',
          bg: 'rgba(255, 202, 40, 0.06)',
          textColor: '#b45309',
          hoverBg: 'rgba(255, 202, 40, 0.12)',
          glowColor: 'rgba(255, 202, 40, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )
        };
      case 'figma':
        return {
          borderColor: 'rgba(242, 78, 30, 0.4)',
          bg: 'rgba(242, 78, 30, 0.06)',
          textColor: '#c2410c',
          hoverBg: 'rgba(242, 78, 30, 0.12)',
          glowColor: 'rgba(242, 78, 30, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#F24E1E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C9.2 0 7 2.2 7 5v4c0 2.8 2.2 5 5 5s5-2.2 5-5V5c0-2.8-2.2-5-5-5zm0 10c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2s2 .9 2 2v3c0 1.1-.9 2-2 2z" />
            </svg>
          )
        };
      case 'openaiapi':
        return {
          borderColor: 'rgba(65, 41, 145, 0.4)',
          bg: 'rgba(65, 41, 145, 0.06)',
          textColor: '#4338ca',
          hoverBg: 'rgba(65, 41, 145, 0.12)',
          glowColor: 'rgba(65, 41, 145, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#412991]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.28 10.7a5.7 5.7 0 00-.77-4.13A5.77 5.77 0 0017.58 4a5.7 5.7 0 00-4.88 2.76A5.7 5.7 0 008.28 4a5.77 5.77 0 00-3.93 2.57A5.7 5.7 0 003.58 10.7a5.7 5.7 0 00.77 4.13A5.77 5.77 0 008.28 20a5.7 5.7 0 004.88-2.76A5.7 5.7 0 0017.58 20a5.77 5.77 0 003.93-2.57A5.7 5.7 0 0022.28 10.7z" />
            </svg>
          )
        };
      case 'langchain':
        return {
          borderColor: 'rgba(18, 18, 18, 0.3)',
          bg: 'rgba(18, 18, 18, 0.04)',
          textColor: '#1e293b',
          hoverBg: 'rgba(18, 18, 18, 0.08)',
          glowColor: 'rgba(18, 18, 18, 0.15)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#121212]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          )
        };
      case 'python':
        return {
          borderColor: 'rgba(55, 118, 171, 0.4)',
          bg: 'rgba(55, 118, 171, 0.06)',
          textColor: '#1d4ed8',
          hoverBg: 'rgba(55, 118, 171, 0.12)',
          glowColor: 'rgba(55, 118, 171, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#3776AB]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )
        };
      case 'n8n':
        return {
          borderColor: 'rgba(255, 108, 55, 0.4)',
          bg: 'rgba(255, 108, 55, 0.06)',
          textColor: '#ea580c',
          hoverBg: 'rgba(255, 108, 55, 0.12)',
          glowColor: 'rgba(255, 108, 55, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#FF6C37]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )
        };
      case 'pinecone':
        return {
          borderColor: 'rgba(28, 25, 23, 0.3)',
          bg: 'rgba(28, 25, 23, 0.04)',
          textColor: '#292524',
          hoverBg: 'rgba(28, 25, 23, 0.08)',
          glowColor: 'rgba(28, 25, 23, 0.15)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#1C1917]" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,22 2,22" />
            </svg>
          )
        };
      case 'huggingface':
        return {
          borderColor: 'rgba(255, 210, 30, 0.4)',
          bg: 'rgba(255, 210, 30, 0.06)',
          textColor: '#a16207',
          hoverBg: 'rgba(255, 210, 30, 0.12)',
          glowColor: 'rgba(255, 210, 30, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#FFD21E]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" />
            </svg>
          )
        };
      case 'aws':
        return {
          borderColor: 'rgba(255, 153, 0, 0.4)',
          bg: 'rgba(255, 153, 0, 0.06)',
          textColor: '#d97706',
          hoverBg: 'rgba(255, 153, 0, 0.12)',
          glowColor: 'rgba(255, 153, 0, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm3.2 15c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
            </svg>
          )
        };
      case 'azure':
        return {
          borderColor: 'rgba(0, 120, 212, 0.4)',
          bg: 'rgba(0, 120, 212, 0.06)',
          textColor: '#0369a1',
          hoverBg: 'rgba(0, 120, 212, 0.12)',
          glowColor: 'rgba(0, 120, 212, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.4l8.6 11.2L17.2 3.4H0zm24 17.2L15.4 6 6.8 20.6H24z" />
            </svg>
          )
        };
      case 'docker':
        return {
          borderColor: 'rgba(36, 150, 237, 0.4)',
          bg: 'rgba(36, 150, 237, 0.06)',
          textColor: '#0284c7',
          hoverBg: 'rgba(36, 150, 237, 0.12)',
          glowColor: 'rgba(36, 150, 237, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.9 10.6h2.2v2.2h-2.2v-2.2zm-2.8 0h2.2v2.2h-2.2v-2.2zm-2.8 0h2.2v2.2H8.3v-2.2zm-2.8 0h2.2v2.2H5.5v-2.2zm8.4-2.8h2.2v2.2h-2.2V7.8zm-2.8 0h2.2v2.2h-2.2V7.8zm-2.8 0h2.2v2.2H8.3V7.8zm5.6-2.8h2.2v2.2h-2.2V5zm-8.4 8.4h2.2v2.2H5.5v-2.2zM24 12.3c-.3 0-.6-.1-.9-.1h-.4c-.1.5-.3.9-.6 1.3-.3.4-.6.7-1.1.9l-.6.3v.5c0 1.2-.4 2.2-1.2 3.1-.8.8-1.8 1.2-3.1 1.2-1.2 0-2.3-.4-3.1-1.2-.8-.9-1.2-1.9-1.2-3.1V5h2.2v10.3c0 .6.2 1.1.6 1.5.4.4.9.6 1.5.6s1.1-.2 1.5-.6c.4-.4.6-.9.6-1.5v-.8c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6h.5c.3 0 .6-.1.9-.1V12.3z" />
            </svg>
          )
        };
      case 'kubernetes':
        return {
          borderColor: 'rgba(50, 108, 229, 0.4)',
          bg: 'rgba(50, 108, 229, 0.06)',
          textColor: '#1d4ed8',
          hoverBg: 'rgba(50, 108, 229, 0.12)',
          glowColor: 'rgba(50, 108, 229, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#326CE5]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L1.7 5.9v12.2L12 24l10.3-5.9V5.9L12 0zm5.6 15.6L12 18.8l-5.6-3.2V9.6L12 6.4l5.6 3.2v6z" />
            </svg>
          )
        };
      case 'hubspot':
        return {
          borderColor: 'rgba(255, 122, 89, 0.4)',
          bg: 'rgba(255, 122, 89, 0.06)',
          textColor: '#ea580c',
          hoverBg: 'rgba(255, 122, 89, 0.12)',
          glowColor: 'rgba(255, 122, 89, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#FF7A59]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )
        };
      case 'postgresql':
        return {
          borderColor: 'rgba(65, 105, 225, 0.4)',
          bg: 'rgba(65, 105, 225, 0.06)',
          textColor: '#2563eb',
          hoverBg: 'rgba(65, 105, 225, 0.12)',
          glowColor: 'rgba(65, 105, 225, 0.25)',
          icon: (
            <svg className="w-3.5 h-3.5 text-[#4169E1]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )
        };
      default:
        return {
          borderColor: 'rgba(16, 185, 129, 0.4)',
          bg: 'rgba(16, 185, 129, 0.06)',
          textColor: '#059669',
          hoverBg: 'rgba(16, 185, 129, 0.12)',
          glowColor: 'rgba(16, 185, 129, 0.2)',
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        };
    }
  };

  return (
    <section id="tech-stack" className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 scroll-mt-24 shadow-sm w-full h-fit">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">{solution.sectionCopy?.techStackTitle || 'Core Technology Stack'}</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
          {solution.sectionCopy?.techStackSubtitle || 'Built with enterprise-grade tools'}
        </p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex overflow-x-auto whitespace-nowrap gap-2.5 pb-2.5 scrollbar-none w-full"
        >
          {solution.techStack.map((tech) => {
            const style = getTechStyle(tech);
            return (
              <motion.span 
                key={tech} 
                variants={itemVariants}
                whileHover={prefersReducedMotion ? {} : { 
                  scale: 1.06, 
                  y: -2,
                  boxShadow: `0 4px 12px ${style.glowColor}`,
                  borderColor: style.borderColor.replace('0.4', '0.7'),
                  backgroundColor: style.hoverBg,
                  color: style.textColor
                }}
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.borderColor,
                  color: style.textColor
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold cursor-default select-none transition-all duration-200 shrink-0"
              >
                {style.icon}
                {tech}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionTechStackSection;
