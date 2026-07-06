import { Service } from '@/data/services';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { ConsultationForm } from './ConsultationForm';

interface SectionProps {
  service: Service;
}

export const CTASection = ({ service }: SectionProps) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      id="contact" 
      className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_50px_rgba(16,185,129,0.15)] scroll-mt-24 text-center max-w-4xl mx-auto"
    >
      {/* Blurred background glows */}
      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="cta-mesh" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-mesh)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Floating badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-semibold select-none">
          <Sparkles className="h-3 w-3 text-emerald-100 animate-pulse" />
          <span>Let's collaborate</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black font-display tracking-tight leading-tight max-w-2xl mx-auto">
          Ready to build your next digital product?
        </h2>
        
        <p className="text-emerald-50/90 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
          {service.cta || 'Let\'s collaborate on structuring and engineering your next web portal or AI integration.'}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-white text-emerald-700 hover:bg-slate-50 font-bold border-none shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.2)] px-7 py-3 rounded-xl inline-flex items-center gap-2 transition-all h-11 text-xs md:text-sm"
                >
                  <Calendar className="h-4.5 w-4.5" />
                  Book Free Consultation
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="border-none bg-transparent shadow-none p-0 w-[calc(100%-2rem)] sm:w-full max-w-2xl">
              <ConsultationForm serviceTitle={service.title} />
            </DialogContent>
          </Dialog>
          
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              className="border-white/30 hover:border-white text-white hover:bg-white/10 font-bold px-7 py-3 rounded-xl inline-flex items-center gap-2 h-11 text-xs md:text-sm transition-all"
              asChild
            >
              <a href="mailto:architect@techvistar.com?subject=Consultation%20Escalation">
                <MessageSquare className="h-4.5 w-4.5" />
                Talk to an Expert
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
export default CTASection;
