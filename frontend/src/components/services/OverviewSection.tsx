import { Service } from '@/data/services';
import { Brain, Lightbulb } from 'lucide-react';
import '../ui/GlassIcons.css';

// Import high-fidelity dashboard assets
import aiOverviewIllustration from '../../assets/ai_overview_illustration.png';
import mobilityDashboard from '../../assets/mobility_routing_dashboard.png';
import sustainabilityDashboard from '../../assets/sustainability_dashboard.png';
import aiTranslator from '../../assets/ai_translator.png';
import aiTranslatorBatches from '../../assets/ai_translator_batches.png';
import clinicalRiskScoring from '../../assets/clinical_risk_scoring.png';
import cropHealthAnalysis from '../../assets/crop_health_analysis.png';
import sentimentNlpDashboard from '../../assets/sentiment_nlp_dashboard.png';
import resumeReviewAssistant from '../../assets/resume_review_assistant.png';

interface SectionProps {
  service: Service;
}

export const OverviewSection = ({ service }: SectionProps) => {
  const IconComponent = service.icon || Brain;

  // Dynamically map high-fidelity project images based on the service data
  const getDashboardImage = () => {
    if (!service.dashboardImage) {
      return sustainabilityDashboard;
    }
    
    const mapping: Record<string, string> = {
      ai_overview_illustration: aiOverviewIllustration,
      mobility_routing_dashboard: mobilityDashboard,
      sustainability_dashboard: sustainabilityDashboard,
      ai_translator: aiTranslator,
      ai_translator_batches: aiTranslatorBatches,
      clinical_risk_scoring: clinicalRiskScoring,
      crop_health_analysis: cropHealthAnalysis,
      sentiment_nlp_dashboard: sentimentNlpDashboard,
      resume_review_assistant: resumeReviewAssistant
    };

    return mapping[service.dashboardImage] || sustainabilityDashboard;
  };

  return (
    <section id="overview" className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 scroll-mt-24 shadow-sm relative overflow-hidden">
      
      {/* Light mesh grid backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="overview-mesh" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#overview-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Content Column */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Header with 3D GlassIcon Wrapper */}
          <div className="flex items-center gap-4">
            <div className="icon-btn pointer-events-none scale-75 origin-top-left -mb-4 -mr-4">
              <span className="icon-btn__back" style={{ background: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))' }}></span>
              <span className="icon-btn__front">
                <span className="icon-btn__icon">
                  <IconComponent className="w-6 h-6 text-white" />
                </span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Overview</h2>
          </div>

          {/* Decorative bar */}
          <div className="w-12 h-1 bg-emerald-500 rounded-full" />

          {/* Description */}
          <p className="text-slate-600 text-sm md:text-sm leading-relaxed">
            {service.longDescription}
          </p>

          {/* Key Insight callout box */}
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex gap-4 items-start transition-all duration-300 hover:bg-emerald-50/80">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100">
              <Lightbulb className="h-5 w-5 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-800 mb-0.5">Key Insight</h4>
              <p className="text-xs text-emerald-700/90 leading-relaxed font-medium">
                {service.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Right Dashboard Image Column */}
        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative group/image">
            {/* Soft background glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 opacity-75 blur-lg group-hover/image:opacity-100 transition duration-300" />
            
            <img 
              src={getDashboardImage()} 
              alt={`${service.title} Overview Illustration`} 
              className="relative w-full max-w-[230px] md:max-w-full h-auto object-contain transition-transform duration-300 group-hover/image:scale-[1.04] mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default OverviewSection;
