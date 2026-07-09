import { SolutionDetail } from '@/data/solutions';
import { motion, useReducedMotion } from 'framer-motion';

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
              <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM13.43 19.313c-2.072 0-3.541-.832-4.475-2.457l2.091-1.378c.552 1.054 1.411 1.637 2.458 1.637 1.077 0 1.764-.51 1.764-1.317 0-2.42-5.63-1.076-5.63-5.362 0-1.848 1.498-3.238 3.593-3.238 1.776 0 3.037.66 3.918 2.016l-1.954 1.43c-.456-.833-1.139-1.258-1.964-1.258-.875 0-1.428.455-1.428 1.15 0 2.22 5.63.924 5.63 5.373 0 1.944-1.573 3.404-3.993 3.404h-.01zM7.742 10.74h-4.66V8.293h12.1v2.447H10.53v8.36h-2.79v-8.36z" />
            </svg>
          )
        };
      case 'nextjs':
        return {
          borderColor: 'rgba(0, 0, 0, 0.2)',
          bg: 'rgba(0, 0, 0, 0.04)',
          textColor: '#000000',
          hoverBg: 'rgba(0, 0, 0, 0.08)',
          glowColor: 'rgba(0, 0, 0, 0.15)',
          icon: (
            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.8C6.037 22.8 1.2 17.963 1.2 12S6.037 1.2 12 1.2 22.8 6.037 22.8 12 17.963 22.8 12 22.8zm6.545-6.527l-5.918-7.945H10.39v9.273h1.8v-6.982l5.427 7.282a10.77 10.77 0 001.29-1.628H18.5v-.01z" />
            </svg>
          )
        };
      case 'tailwindcss':
        return {
          borderColor: 'rgba(56, 189, 248, 0.4)',
          bg: 'rgba(56, 189, 248, 0.06)',
          textColor: '#0369a1',
          hoverBg: 'rgba(56, 189, 248, 0.12)',
          glowColor: 'rgba(56, 189, 248, 0.25)',
          icon: (
            <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
            </svg>
          )
        };
      case 'nodejs':
      case 'node':
        return {
          borderColor: 'rgba(51, 153, 51, 0.4)',
          bg: 'rgba(51, 153, 51, 0.06)',
          textColor: '#15803d',
          hoverBg: 'rgba(51, 153, 51, 0.12)',
          glowColor: 'rgba(51, 153, 51, 0.25)',
          icon: (
            <svg className="w-4 h-4 text-[#339933]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.83 22.25L3.08 17.2V7l8.75-5.05L20.58 7v10.2l-8.75 5.05zm-.15-18.42l-7.07 4.09v8.18l7.07 4.09 7.07-4.09V7.92l-7.07-4.09zM12 11.23l-3.32 1.9v3.83l3.32-1.93v-3.8zM8.68 11.24L12 9.33l3.32 1.9v3.82l-3.32-1.92v-3.8z" />
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
            <svg className="w-4 h-4 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5 12.3c0-2.3-1.8-4.2-4.2-4.2h-1.5c0-.9-.7-1.5-1.5-1.5-.9 0-1.5.7-1.5 1.5H8.7c0-2.3-1.8-4.2-4.2-4.2-2.3 0-4.2 1.8-4.2 4.2 0 .8.2 1.5.6 2.1C.4 11.3 0 12.2 0 13.2c0 2.3 1.8 4.2 4.2 4.2h15.6c1.5 0 2.7-1.2 2.7-2.7 0-.9-.5-1.7-1.2-2.2.8-.2 1.2-.9 1.2-1.6zm-18.3.3c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4zm5.1 0c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4zm5.1 0c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4zm5.1 0c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4z"/>
            </svg>
          )
        };
      case 'aws':
        return {
          borderColor: 'rgba(255, 153, 0, 0.4)',
          bg: 'rgba(255, 153, 0, 0.06)',
          textColor: '#b45309',
          hoverBg: 'rgba(255, 153, 0, 0.12)',
          glowColor: 'rgba(255, 153, 0, 0.25)',
          icon: (
            <svg className="w-4 h-4 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.015 15.602c-1.748 0-3.328-.46-4.664-1.285l1.042-1.398c1.077.726 2.373 1.15 3.738 1.15 2.115 0 3.328-.864 3.328-2.222 0-1.314-1.042-2.023-3.085-2.507C9.362 8.653 8.35 7.6 8.35 5.922 8.35 3.868 9.998 2.5 12.568 2.5c1.41 0 2.7.34 3.778 1.012l-.995 1.485c-.933-.614-2.022-.922-3.013-.922-1.77 0-2.735.803-2.735 1.956 0 1.118.847 1.705 2.802 2.19 3.125.756 4.318 1.838 4.318 3.792-.001 2.153-1.638 3.589-4.693 3.589zm10.742-1.921l-3.34-8.813h1.758l2.352 6.544 1.93-6.544h1.564l-3.238 8.813h-1.026zm-18.775 0l-3.23-8.813h1.59l2.253 6.513 1.907-6.513h1.517l2.02 6.513 2.176-6.513h1.55l-3.254 8.813H9.37l-2.01-6.26-1.942 6.26h-1.44zm11.398-1.503c-2.316 2.45-5.694 3.914-9.355 3.914-3.5 0-6.757-1.353-9.053-3.64l.872-1.127c2.096 2.05 4.992 3.238 8.163 3.238 3.21 0 6.2-1.282 8.444-3.44l.93 1.055z" />
            </svg>
          )
        };
      case 'postgresql':
        return {
          borderColor: 'rgba(51, 103, 145, 0.4)',
          bg: 'rgba(51, 103, 145, 0.06)',
          textColor: '#1e40af',
          hoverBg: 'rgba(51, 103, 145, 0.12)',
          glowColor: 'rgba(51, 103, 145, 0.25)',
          icon: (
            <svg className="w-4 h-4 text-[#336791]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-22c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm1 14.5c0 1.933-1.567 3.5-3.5 3.5S6 18.433 6 16.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5zm-5 0c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5zm6-5c0 1.933-1.567 3.5-3.5 3.5S7 13.433 7 11.5 8.567 8 10.5 8s3.5 1.567 3.5 3.5zM9 11.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5S11.328 10 10.5 10 9 10.672 9 11.5z" />
            </svg>
          )
        };
      case 'redis':
        return {
          borderColor: 'rgba(216, 44, 32, 0.4)',
          bg: 'rgba(216, 44, 32, 0.06)',
          textColor: '#b91c1c',
          hoverBg: 'rgba(216, 44, 32, 0.12)',
          glowColor: 'rgba(216, 44, 32, 0.25)',
          icon: (
            <svg className="w-4 h-4 text-[#D82C20]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.433 4.148c-1.39-1.047-3.232-1.782-5.433-2.133v11.751h1.5V11.23c2.201.351 4.043 1.086 5.433 2.133V4.148zM6.567 4.148c1.39-1.047 3.232-1.782 5.433-2.133v11.751h-1.5V11.23C8.299 11.58 6.457 10.846 5.067 9.799V4.148zm5.433 13.885v1.89c2.201-.35 4.043-1.086 5.433-2.133V6.262c-1.39 1.047-3.232 1.782-5.433 2.133v7.094l-1.5 1.834h3v-2.036c-1.39-1.047-3.232-1.781-5.433-2.132v7.093h1.5zm-3-8.926c-2.201-.351-4.043-1.086-5.433-2.133v11.528c1.39 1.047 3.232 1.782 5.433 2.133V9.107z"/>
            </svg>
          )
        };
      case 'vite':
        return {
          borderColor: 'rgba(100, 108, 255, 0.4)',
          bg: 'rgba(100, 108, 255, 0.06)',
          textColor: '#4338ca',
          hoverBg: 'rgba(100, 108, 255, 0.12)',
          glowColor: 'rgba(100, 108, 255, 0.25)',
          icon: (
            <svg className="w-4 h-4 text-[#646CFF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.362 1.588a1.05 1.05 0 00-.737-.736C22.043.684 15.69 2.227 12 3.664 8.31 2.227 1.957.684 1.375.852a1.05 1.05 0 00-.737.736C.46 2.17.004 8.8.847 11.233c.843 2.433 10.231 11.758 10.741 12.26.233.23.61.23.843 0 .51-.502 9.898-9.827 10.74-12.26.844-2.433.388-9.063.19-9.645zm-1.875.526c.073.493.187 6.13-.377 7.747-.565 1.616-9.141 10.158-9.141 10.158S3.447 11.477 2.882 9.86c-.564-1.616-.45-7.253-.377-7.746.046-.32.32-.593.64-.64.838-.124 5.992-1.353 8.855-2.585 2.863 1.232 8.017 2.46 8.855 2.585.32.046.594.32.64.64z" />
            </svg>
          )
        };
      default:
        return {
          borderColor: 'rgba(148, 163, 184, 0.4)',
          bg: 'rgba(241, 245, 249, 0.6)',
          textColor: '#475569',
          hoverBg: 'rgba(226, 232, 240, 0.8)',
          glowColor: 'rgba(148, 163, 184, 0.2)',
          icon: (
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          )
        };
    }
  };

  return (
    <section id="tech-stack" className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 scroll-mt-24 shadow-sm w-full h-fit">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Technology Stack</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
          Our core execution stacks and tools mapped to this service dynamic:
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
