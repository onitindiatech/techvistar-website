import { Service } from '@/data/services';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Check, Globe, Smartphone, Palette, Cpu, Cloud, 
  PenTool, Megaphone, Terminal, MessageSquare, Bot, Repeat, Database, 
  UserCheck, Settings, Code2, Target, Layers, Shield, Wrench, Search, 
  Layout, FileText, CheckCircle, Brain, LayoutTemplate, Network, FileSearch
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import '../ui/GlassIcons.css';

interface SectionProps {
  service: Service;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

const getIconElement = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    globe: <Globe className="w-6 h-6 text-white" />,
    smartphone: <Smartphone className="w-6 h-6 text-white" />,
    palette: <Palette className="w-6 h-6 text-white" />,
    cpu: <Cpu className="w-6 h-6 text-white" />,
    cloud: <Cloud className="w-6 h-6 text-white" />,
    pentool: <PenTool className="w-6 h-6 text-white" />,
    megaphone: <Megaphone className="w-6 h-6 text-white" />,
    terminal: <Terminal className="w-6 h-6 text-white" />,
    message: <MessageSquare className="w-6 h-6 text-white" />,
    bot: <Bot className="w-6 h-6 text-white" />,
    repeat: <Repeat className="w-6 h-6 text-white" />,
    sparkles: <Sparkles className="w-6 h-6 text-white" />,
    database: <Database className="w-6 h-6 text-white" />,
    usercheck: <UserCheck className="w-6 h-6 text-white" />,
    settings: <Settings className="w-6 h-6 text-white" />,
    code: <Code2 className="w-6 h-6 text-white" />,
    target: <Target className="w-6 h-6 text-white" />,
    layers: <Layers className="w-6 h-6 text-white" />,
    shield: <Shield className="w-6 h-6 text-white" />,
    wrench: <Wrench className="w-6 h-6 text-white" />,
    search: <Search className="w-6 h-6 text-white" />,
    layout: <Layout className="w-6 h-6 text-white" />,
    filetext: <FileText className="w-6 h-6 text-white" />,
    checkcircle: <CheckCircle className="w-6 h-6 text-white" />,
    brain: <Brain className="w-6 h-6 text-white" />,
    layouttemplate: <LayoutTemplate className="w-6 h-6 text-white" />,
    network: <Network className="w-6 h-6 text-white" />,
    filesearch: <FileSearch className="w-6 h-6 text-white" />
  };
  return icons[iconName.toLowerCase()] || <Sparkles className="w-6 h-6 text-white" />;
};

export const SolutionsSection = ({ service }: SectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const offeringsData = service.detailedOfferings || [];
  const hasDetailedOfferings = offeringsData.length > 0;

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

      {hasDetailedOfferings ? (
        /* Premium redesigned offerings grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          {offeringsData.map((offering, idx) => (
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
                        {getIconElement(offering.iconName)}
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
