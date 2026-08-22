import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getActiveJobs, Job } from '@/services/job.service';
import { getPublicPagesConfig } from '@/services/pages.service';
import { mergePagesCmsConfig, DEFAULT_CAREERS_LANDING_CMS } from '@/types/pagesCms';
import { seoFromItem } from '@/lib/seoAdmin';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { CmsHref } from '@/components/common/CmsHref';
import DEFAULT_CAREERS_HERO_BG from '../assets/careers-bg-new.png';
import { 
  Briefcase, MapPin, Clock, Search, Users,
  ArrowRight, ChevronRight, RotateCcw, Mail, MessageSquare, Code, UserCheck
} from 'lucide-react';

const HERO_BG = DEFAULT_CAREERS_HERO_BG;

const BENEFIT_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=400&auto=format&fit=crop",
];

const PROCESS_STYLES = [
  { icon: Briefcase, color: "from-teal-400 to-teal-600", textCol: "text-teal-600", bgCol: "bg-teal-50" },
  { icon: Users, color: "from-emerald-400 to-emerald-600", textCol: "text-emerald-600", bgCol: "bg-emerald-50" },
  { icon: Code, color: "from-orange-400 to-orange-600", textCol: "text-orange-600", bgCol: "bg-orange-50" },
  { icon: MessageSquare, color: "from-pink-400 to-pink-650", textCol: "text-pink-600", bgCol: "bg-pink-50" },
  { icon: UserCheck, color: "from-purple-400 to-purple-600", textCol: "text-purple-650", bgCol: "bg-purple-50" },
  { icon: Mail, color: "from-blue-400 to-blue-600", textCol: "text-blue-600", bgCol: "bg-blue-50" },
];

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedEmpType, setSelectedEmpType] = useState('All');

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ['activeJobs'],
    queryFn: getActiveJobs,
    retry: 1,
  });

  const activeJobs = useMemo(() => {
    return (Array.isArray(jobs) ? jobs : []).filter(job => job.status === 'active' && !job.isDeleted);
  }, [jobs]);

  const departments = useMemo(() => {
    const list = new Set(activeJobs.map(j => j.department).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [activeJobs]);

  const locations = useMemo(() => {
    const list = new Set(activeJobs.map(j => j.location).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [activeJobs]);

  const employmentTypes = useMemo(() => {
    const list = new Set(activeJobs.map(j => j.employmentType).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [activeJobs]);

  const filteredJobs = useMemo(() => {
    return activeJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'All' || job.department === selectedDept;
      const matchesLoc = selectedLoc === 'All' || job.location === selectedLoc;
      const matchesEmpType = selectedEmpType === 'All' || job.employmentType === selectedEmpType;

      return matchesSearch && matchesDept && matchesLoc && matchesEmpType;
    });
  }, [activeJobs, searchTerm, selectedDept, selectedLoc, selectedEmpType]);

  const { data: pagesConfig } = useQuery({
    queryKey: ['pages-config'],
    queryFn: getPublicPagesConfig,
  });

  const careers = mergePagesCmsConfig(pagesConfig).careers;
  const careersSeo = seoFromItem(careers as unknown as Record<string, unknown>);
  const heroBg = careers.hero.backgroundImage?.trim() || HERO_BG;

  const benefitsList = careers.benefits.map((benefit, idx) => ({
    title: benefit.title,
    desc: benefit.description,
    image: BENEFIT_IMAGES[idx] || BENEFIT_IMAGES[0],
  }));

  const processTimeline = careers.hiringProcess.map((step, idx) => {
    const style = PROCESS_STYLES[idx] || PROCESS_STYLES[0];
    return {
      phase: `${step.step}. ${step.title}`,
      desc: step.description,
      ...style,
    };
  });

  const handleScrollToPositions = () => {
    const el = document.getElementById('open-positions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <PageSeo
        seo={careersSeo}
        defaults={{
          title: careers.seoTitle || DEFAULT_CAREERS_LANDING_CMS.seoTitle || 'Careers at TechVistar | Join our engineering team',
          description: careers.seoDescription || DEFAULT_CAREERS_LANDING_CMS.seoDescription || '',
          url: buildCanonical('/careers'),
        }}
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />

        {/* 1. Hero Section */}
        <PageHeader
          title={
            careers.hero.subtitle ? (
              <>
                {careers.hero.title}
                <br />
                <span className="hero-highlight-text--static inline-block font-black">
                  {careers.hero.subtitle}
                </span>
              </>
            ) : (
              careers.hero.title
            )
          }
          description={careers.hero.description}
          backgroundImage={heroBg}
          bgPosition="right bottom"
        >
          <div className="flex flex-wrap items-center gap-4">
            <motion.button 
              whileHover={{ y: -1 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleScrollToPositions} 
              className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#041a3d] hover:bg-[#021028] text-white rounded-xl transition-all duration-200 text-sm font-extrabold tracking-tight shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] group cursor-pointer"
            >
              <span>View Open Positions</span>
            </motion.button>

          </div>
        </PageHeader>

        {/* 2. Open Positions (Completely matching reference style) */}
        <section id="open-positions" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-white border-b border-slate-100">
          <div className="container mx-auto px-6 sm:px-12 md:px-14 lg:px-16 max-w-7xl space-y-6 md:space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <Briefcase className="h-4.5 w-4.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Available Roles</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold font-display text-slate-900 tracking-tight">Open Positions</h2>
            </div>

            {/* Filter Bar (One Rounded Container) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="search"
                  id="careers-job-search"
                  aria-label="Search open positions"
                  placeholder="Search by job title, department, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 focus:border-emerald-500/40 rounded-xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full sm:w-[150px]">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-[150px]">
                  <select
                    value={selectedLoc}
                    onChange={(e) => setSelectedLoc(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                  >
                    <option value="All">All Locations</option>
                    {locations.filter(l => l !== 'All').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-[150px]">
                  <select
                    value={selectedEmpType}
                    onChange={(e) => setSelectedEmpType(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    {employmentTypes.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDept('All');
                    setSelectedLoc('All');
                    setSelectedEmpType('All');
                  }}
                  className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-sm font-bold text-slate-700 w-full sm:w-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[360px] bg-slate-50 border border-slate-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredJobs.map((job) => {
                  const parts = (job.description || "").split("<!-- split -->");
                  const shortDesc = parts[0] || "";
                  const banner = parts[2] || job.bannerImage || "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600";

                  return (
                    <motion.div
                      key={job._id}
                      whileHover={{ y: -6 }}
                      className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group h-full"
                    >
                      <div>
                        {/* Banner Image Container */}
                        <div className="h-44 bg-slate-200 overflow-hidden relative border-b border-slate-100 flex items-center justify-center">
                          <img 
                            src={banner} 
                            alt={job.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none" />
                          <Badge className="absolute bottom-4 left-4 bg-emerald-600 hover:bg-emerald-500 text-white border-none font-bold uppercase tracking-wider text-xs px-2.5 py-1 rounded shadow-md z-10">
                            {job.department}
                          </Badge>
                        </div>

                        {/* Card Info */}
                        <div className="p-6 space-y-2.5">
                          <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs md:text-sm text-slate-500 font-bold uppercase">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.employmentType}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>
                          </div>
                          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal line-clamp-3 pt-1">
                            {shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons matching Vercel/Stripe pills */}
                      <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between gap-4 mt-3">
                        <Link to={`/careers/apply/${job.slug}`} className="flex-1">
                          <Button className="w-full h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-1">
                            Apply Now <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-300" />
                          </Button>
                        </Link>
                        <Link to={`/careers/${job.slug}`} className="text-sm font-bold text-emerald-650 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                          View Details <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-300" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-2xl text-center max-w-md mx-auto shadow-sm">
                <p className="text-slate-500 text-sm font-semibold">No open positions match your search selections.</p>
              </div>
            )}
          </div>
        </section>

        {/* 3. Why Join TechVistar */}
        <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-6 sm:px-12 md:px-14 lg:px-16 max-w-7xl space-y-8 md:space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 tracking-tight">Why Join TechVistar?</h2>
              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">We empower people to do their best work and grow together.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {benefitsList.map((benefit, idx) => {
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -6 }}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(14,165,233,0.12)] hover:border-emerald-500/20 transition-all duration-300 flex flex-col group h-full text-left"
                  >
                    {/* Landscape image */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={benefit.image} 
                        alt={benefit.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">{benefit.title}</h3>
                      <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Hiring Process */}
        <section className="py-12 md:py-16 bg-white border-b border-slate-100">
          <div className="container mx-auto px-6 sm:px-12 md:px-14 lg:px-16 max-w-7xl space-y-10 md:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 tracking-tight">Our Hiring Process</h2>
              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">Our simple and transparent hiring process</p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              {/* Continuous horizontal line behind step icons on desktop */}
              <div className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-[2px] border-t-2 border-dashed border-slate-200 -translate-y-1/2 z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
                {processTimeline.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center text-center space-y-3 group">
                      {/* Circular Colored floating icon */}
                      <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 4, delay: idx * 0.3 }}
                        className={`h-12 w-12 rounded-full bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-default relative z-10`}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>

                      <div className="space-y-1">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">{step.phase}</h3>
                        <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Bottom CTA Block */}
        <section className="py-14 md:py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-900">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">{careers.cta.title}</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium">
              {careers.cta.description}
            </p>
            <div className="pt-2">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-full shadow-lg shadow-emerald-500/10">
                <CmsHref href={careers.cta.buttonLink || '/contact'}>{careers.cta.buttonText}</CmsHref>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default Careers;
