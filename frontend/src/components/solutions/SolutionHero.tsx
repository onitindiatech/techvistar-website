import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ArrowRight, Calendar, TrendingUp, Shield, Users, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { SolutionDetail } from '@/data/solutions';
import dashboardImg from '@/assets/portfolio_laptop_mockup.jpg';

interface SolutionHeroProps {
  solution: SolutionDetail;
}

export const SolutionHero = ({ solution }: SolutionHeroProps) => {
  // Grab up to 4 features to show as bullet points
  const topFeatures = solution.features.slice(0, 4);

  return (
    <section className="relative bg-gradient-to-b from-emerald-50/40 to-white pt-20 pb-4 md:pt-24 md:pb-8 overflow-hidden">
      
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
        
        {/* Top Back Link */}
        <Link to="/solutions" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-4 transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all solutions
        </Link>

        {/* Hero Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-6">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              {solution.category}
            </motion.div>
            
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold font-display text-slate-900 leading-[1.1] tracking-tight mb-6">
                {solution.title}
              </h1>
            </motion.div>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base md:text-lg font-bold text-emerald-600 leading-snug mb-4 max-w-xl"
            >
              {solution.subtitle}
            </motion.p>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-slate-600 leading-relaxed mb-8 max-w-xl"
            >
              {solution.desc && solution.desc !== solution.subtitle 
                ? solution.desc 
                : `Empower your organization with scalable, secure, and intuitive ${solution.title.toLowerCase()} systems. We build customized architectures that seamlessly integrate with your existing workflows, bridging the gap between legacy processes and modern innovation to drive measurable growth.`}
            </motion.p>
            
            {/* 4 Feature Bullets */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 w-full"
            >
              {topFeatures.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                      <FeatIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{feat.title}</span>
                  </div>
                );
              })}
            </motion.div>



          </div>

          {/* Right Column - Dashboard Mockup & Floating Cards */}
          <div className="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end mt-10 lg:mt-0">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-[600px] xl:max-w-[700px] z-10 perspective-1000"
            >
              {/* Dashboard Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-white"
              >
                <img
                  src={dashboardImg}
                  alt="Dashboard Preview"
                  className="w-full h-auto object-cover object-top"
                />
              </motion.div>

              {/* Floating Card 1 - Top Left */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-6 -left-6 md:-left-10 bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-1 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-lg font-black text-slate-900">99.9%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Uptime</span>
              </motion.div>

              {/* Floating Card 2 - Bottom Left */}
              <motion.div 
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute top-1/2 -left-8 md:-left-12 bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-1 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-lg font-black text-slate-900">500+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enterprise Clients</span>
              </motion.div>

              {/* Floating Card 3 - Right Side (AI) */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-4 -right-4 md:-right-8 bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-1 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-lg font-black text-slate-900">AI</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Enabled</span>
              </motion.div>
              
              {/* Floating Card 4 - Bottom Right */}
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 -right-6 md:-right-10 bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-1 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-sm font-black text-slate-900">Enterprise</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security</span>
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm border border-slate-100/60"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {/* Stat 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-[12px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                  <TrendingUp className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[24px] font-black text-slate-900 leading-none mb-1.5">40%</h3>
                  <p className="text-[13px] font-bold text-slate-800 mb-1.5">Efficiency Gain</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Improve operational efficiency across your organization</p>
                </div>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-[12px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                  <Shield className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[24px] font-black text-slate-900 leading-none mb-1.5">99.9%</h3>
                  <p className="text-[13px] font-bold text-slate-800 mb-1.5">System Uptime</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Enterprise-grade reliability and performance</p>
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-[12px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                  <Users className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[24px] font-black text-slate-900 leading-none mb-1.5">500+</h3>
                  <p className="text-[13px] font-bold text-slate-800 mb-1.5">Projects Delivered</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Successfully delivered enterprise solutions worldwide</p>
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-[12px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                  <HeadphonesIcon className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[24px] font-black text-slate-900 leading-none mb-1.5">24/7</h3>
                  <p className="text-[13px] font-bold text-slate-800 mb-1.5">Expert Support</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Round-the-clock support from our expert team</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SolutionHero;
