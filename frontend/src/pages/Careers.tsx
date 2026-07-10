import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import DEFAULT_CAREERS_HERO_BG from '../assets/careers-bg-new.png';
import { 
  Briefcase, MapPin, Clock, Search, Users,
  ArrowRight, ChevronRight, RotateCcw, HelpCircle, Mail, MessageSquare, Code, UserCheck
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

const LIFE_GALLERY = [
  { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop", title: "Collaborative Open Space" },
  { url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop", title: "Interactive Engineering Syncs" },
  { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop", title: "Staged Hackathons" },
  { url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=800&auto=format&fit=crop", title: "Product Focus Pods" },
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop", title: "Team Breakout Discussions" },
  { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop", title: "Workspace Celebrations" }
];

const PROCESS_STYLES = [
  { icon: Briefcase, color: "from-teal-400 to-teal-600", textCol: "text-teal-600", bgCol: "bg-teal-50" },
  { icon: Users, color: "from-emerald-400 to-emerald-600", textCol: "text-emerald-600", bgCol: "bg-emerald-50" },
  { icon: Code, color: "from-orange-400 to-orange-600", textCol: "text-orange-600", bgCol: "bg-orange-50" },
  { icon: MessageSquare, color: "from-pink-400 to-pink-650", textCol: "text-pink-600", bgCol: "bg-pink-50" },
  { icon: UserCheck, color: "from-purple-400 to-purple-600", textCol: "text-purple-650", bgCol: "bg-purple-50" },
  { icon: Mail, color: "from-blue-400 to-blue-600", textCol: "text-blue-600", bgCol: "bg-blue-50" },
];

const FAQS_LIST = [
  { q: "What does the typical hiring timeline look like?", a: "Our average hiring timeline is 2-3 weeks from initial application to final offer letter, depending on technical stage alignment." },
  { q: "Do you offer relocation support for office-based roles?", a: "Yes, we offer structured relocation packages for senior engineering and leadership roles requiring relocation to our regional hubs." },
  { q: "Can I apply to multiple open positions simultaneously?", a: "We recommend applying to the single role that matches your primary qualifications best, but our recruitment team automatically cross-reviews candidate applications for other open campaigns." },
  { q: "What is your remote/hybrid work structure policy?", a: "Our team operates on a flexible hybrid policy—remote-first workflows with option of working from regional collaboration spaces whenever needed." }
];

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedEmpType, setSelectedEmpType] = useState('All');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ['activeJobs'],
    queryFn: getActiveJobs,
    retry: 2,
  });

  const activeJobs = useMemo(() => {
    return (jobs || []).filter(job => job.status === 'active' && !job.isDeleted);
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
    staleTime: 60_000,
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
                {careers.hero.title}{' '}
                <span className="text-emerald-500">{careers.hero.subtitle}</span>
              </>
            ) : (
              careers.hero.title
            )
          }
          subtitle={careers.hero.eyebrow || 'Careers at TechVistar'}
          description={careers.hero.description}
          backgroundImage={heroBg}
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={handleScrollToPositions} size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20">
              View Open Positions
            </Button>
            <Button onClick={() => {
              const element = document.getElementById('life-at-techvistar');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }} variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white font-bold h-12 px-6 rounded-xl">
              Life at TechVistar
            </Button>
          </div>
        </PageHeader>

        {/* 2. Open Positions (Completely matching reference style) */}
        <section id="open-positions" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-6 md:space-y-8">
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
                  type="text"
                  placeholder="Search by job title, department, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 focus:border-emerald-500/40 rounded-xl text-xs focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full sm:w-[150px]">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-[11px] font-bold bg-white focus:outline-none"
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
                    className="h-10 px-3 rounded-xl border border-slate-200 text-[11px] font-bold bg-white focus:outline-none"
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
                    className="h-10 px-3 rounded-xl border border-slate-200 text-[11px] font-bold bg-white focus:outline-none"
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
                  className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 w-full sm:w-auto"
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
            ) : error ? (
              <p className="text-sm text-red-500 bg-red-50 border border-red-150 p-8 rounded-2xl text-center font-bold">
                Failed to load career listings. Please reload.
              </p>
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
                          <Badge className="absolute bottom-4 left-4 bg-emerald-600 hover:bg-emerald-500 text-white border-none font-bold uppercase tracking-wider text-[8px] px-2 py-0.5 rounded shadow-md z-10">
                            {job.department}
                          </Badge>
                        </div>

                        {/* Card Info */}
                        <div className="p-6 space-y-2.5">
                          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 font-extrabold uppercase">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.employmentType}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold line-clamp-3 pt-1">
                            {shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons matching Vercel/Stripe pills */}
                      <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between gap-4 mt-3">
                        <Link to={`/careers/apply/${job.slug}`} className="flex-1">
                          <Button className="w-full h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] tracking-wide shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-1">
                            Apply Now <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 duration-300" />
                          </Button>
                        </Link>
                        <Link to={`/careers/${job.slug}`} className="text-[11px] font-bold text-emerald-650 hover:text-emerald-700 flex items-center gap-1 transition-colors">
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

        {/* 3. Why Join TechVistar (Exactly matching reference card design) */}
        <section className="pt-4 pb-12 md:pt-6 md:pb-16 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-10 md:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">Why Join TechVistar?</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">We empower people to do their best work and grow together.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {benefitsList.map((benefit, idx) => {
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -6 }}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.12)] hover:border-emerald-500/20 transition-all duration-300 flex flex-col group h-full text-left"
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
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{benefit.title}</h3>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Hiring Process (Perfect horizontal step icons sequence) */}
        <section className="py-10 md:py-12 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">Our Hiring Process</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">Our simple and transparent hiring process</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative max-w-5xl mx-auto">
              {processTimeline.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-3 relative z-10 flex-1 group">
                    {idx < processTimeline.length - 1 && (
                      <div className="hidden md:block absolute left-[50%] right-[-50%] top-6 h-[2px] bg-slate-100 border-dashed border-t-2 pointer-events-none group-hover:border-emerald-250 transition-colors" />
                    )}

                    {/* Circular Colored floating icon */}
                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 4, delay: idx * 0.3 }}
                      className={`h-12 w-12 rounded-full bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-default`}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>

                    <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">{step.phase}</h4>
                    <p className="text-[9px] text-slate-400 font-semibold leading-relaxed max-w-[130px]">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Life at TechVistar */}
        <section id="life-at-techvistar" className="py-10 md:py-12 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">{careers.culture.title}</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">{careers.culture.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {LIFE_GALLERY.map((img, idx) => (
                <div key={idx} className="relative group rounded-3xl overflow-hidden shadow-md aspect-[4/3] border border-slate-200 bg-slate-200">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/95 text-slate-900 font-extrabold text-[10px] uppercase rounded-full shadow-lg border border-slate-100">{img.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ Accordion Block */}
        <section className="py-16 md:py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-10 md:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">Clear details about application guidelines and recruitment paths.</p>
            </div>

            <div className="space-y-4">
              {FAQS_LIST.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-500" /> {faq.q}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90 text-emerald-500' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-5 pb-5 pt-1 text-[11px] text-slate-500 leading-relaxed font-semibold border-t border-slate-150 bg-white"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Bottom CTA Block */}
        <section className="py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-900">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">{careers.cta.title}</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-medium">
              {careers.cta.description}
            </p>
            <div className="pt-2">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-full shadow-lg shadow-emerald-500/10">
                <Link to={careers.cta.buttonLink || '/contact'}>{careers.cta.buttonText}</Link>
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
