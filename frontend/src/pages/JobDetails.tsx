import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobBySlug, Job } from '@/services/job.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Users,
  Building2,
  Code2,
  Rocket,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RichTextContent } from '@/components/common/RichTextContent';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical, seoFromApi } from '@/lib/seoResolve';
import { stripHtmlToText } from '@/lib/sanitizeHtml';
import { MobileBackButton } from '@/components/ui/MobileBackButton';
import { cn } from '@/lib/utils';

const MODULE_SHELL =
  'relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8';

export const JobDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeId, setActiveId] = useState('summary');
  const subnavRef = useRef<HTMLElement>(null);

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug || ''),
    enabled: !!slug,
    retry: 1,
  });

  const jobSeo = job ? seoFromApi(job as unknown as Record<string, unknown>) : undefined;

  const seoBlock = (
    <PageSeo
      seo={jobSeo}
      defaults={{
        title: job ? `${job.title} | TechVistar Careers` : 'Job Opening Not Found | TechVistar',
        description: job ? stripHtmlToText(job.description).slice(0, 160) : '',
        url: job ? buildCanonical(`/careers/${job.slug}`) : buildCanonical('/careers'),
      }}
    />
  );

  const rawDesc = job?.description || '';
  let shortDesc = rawDesc;
  let fullDesc = '';
  let bannerImg = '';
  let officeImg = '';
  let teamImg = '';

  if (rawDesc.includes('<!-- split -->')) {
    const parts = rawDesc.split('<!-- split -->');
    shortDesc = parts[0] || '';
    fullDesc = parts[1] || '';
    bannerImg = parts[2] || '';
    officeImg = parts[3] || '';
    teamImg = parts[4] || '';
  } else {
    bannerImg = job?.bannerImage || '';
  }

  const resolvedBanner =
    bannerImg ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200';
  const resolvedOffice =
    officeImg ||
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800';
  const resolvedTeam =
    teamImg ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800';

  const heroOverview = job?.roleOverview?.trim() || (shortDesc && shortDesc !== job?.title ? shortDesc : '');
  const heroHighlights = job?.keyHighlights?.length
    ? job.keyHighlights
    : (job?.responsibilities?.length ? job.responsibilities.slice(0, 3) : (job?.requirements?.length ? job.requirements.slice(0, 3) : []));
  const heroSkills = job?.skills?.length
    ? job.skills
    : (job?.techStack?.length ? job.techStack : (job?.requirements || []).slice(0, 6));

  const navItems = useMemo(() => {
    if (!job) return [];
    return [
      ...(shortDesc || job.roleOverview ? [{ id: 'summary', label: 'Summary' }] : []),
      ...(fullDesc ? [{ id: 'details', label: 'Details' }] : []),
      ...(job.whatYouWillWorkOn?.length ? [{ id: 'work-on', label: 'Work Focus' }] : []),
      ...(job.responsibilities?.length ? [{ id: 'responsibilities', label: 'Responsibilities' }] : []),
      ...(job.requirements?.length ? [{ id: 'requirements', label: 'Requirements' }] : []),
      ...(job.preferredQualifications?.length ? [{ id: 'preferred', label: 'Preferred' }] : []),
      ...(job.techStack?.length ? [{ id: 'tech-stack', label: 'Tech Stack' }] : []),
      ...(job.benefits?.length ? [{ id: 'benefits', label: 'Benefits' }] : []),
      ...(job.hiringProcess?.length ? [{ id: 'hiring-process', label: 'Hiring Process' }] : []),
      { id: 'team', label: 'Team' },
      { id: 'apply', label: 'Apply' },
    ];
  }, [job, shortDesc, fullDesc]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const subnav = subnavRef.current;
    if (!subnav) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty(
        '--secondary-nav-height',
        `${subnav.offsetHeight}px`
      );
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(subnav);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--secondary-nav-height');
    };
  }, [navItems.length]);

  useEffect(() => {
    if (navItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: 0 }
    );
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navItems, job]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 140;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
  };

  if (error) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 pt-20">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
            <h1 className="mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Job Opening Not Found
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-slate-600">
              We couldn&apos;t retrieve the details for this position. It may have been closed or removed.
            </p>
            <Button asChild className="w-full bg-primary text-white hover:bg-primary/95">
              <Link to="/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Careers
              </Link>
            </Button>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  if (isLoading || !job) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <div className="font-display text-slate-500">Loading job details...</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        {/* Redesigned Career Details Hero */}
        <section className="mb-6 border-b border-slate-200/80 bg-white pb-8 pt-[4.5rem] md:mb-8 md:pb-12 md:pt-24">
          <div className="detail-page-gutter mx-auto w-full px-4 md:px-6 lg:px-12 xl:px-20 max-w-7xl">
            <div className="mb-5">
              <Link
                to="/careers"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
                <span>All Careers</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left Column (~58% width -> lg:col-span-7) */}
              <div className="space-y-5 lg:col-span-7">
                {job.department && (
                  <Badge className="border-none bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-none">
                    {job.department}
                  </Badge>
                )}

                <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.15]">
                  {job.title}
                </h1>

                {shortDesc && (
                  <p className="text-base md:text-xl font-bold leading-snug text-emerald-600">
                    {stripHtmlToText(shortDesc).split(/(?<=[.!?])\s+/)[0]}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 border-y border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    {job.experience}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    {job.salary}
                  </span>
                </div>

                {heroOverview && (
                  <RichTextContent
                    content={heroOverview}
                    className="text-slate-600 !text-base md:!text-lg leading-relaxed font-normal [&_p]:!text-base md:[&_p]:!text-lg"
                  />
                )}

                {/* Key Highlights (Responsive 3-Card Grid matching reference) */}
                {heroHighlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                      Key Highlights
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {heroHighlights.map((highlight, idx) => {
                        const iconList = [Code2, Rocket, ShieldCheck, Zap, Sparkles, CheckCircle2];
                        const IconComp = iconList[idx % iconList.length];
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 transition-all hover:border-emerald-500/30 hover:bg-white hover:shadow-sm"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                              <IconComp className="h-4.5 w-4.5" />
                            </div>
                            <p className="text-base md:text-lg font-normal leading-relaxed text-slate-700">{highlight}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Core Competencies */}
                {heroSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Core Competencies:
                    </span>
                    {heroSkills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="rounded-lg border border-slate-200/70 bg-slate-100/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-none hover:bg-slate-200/80"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column (~42% width -> lg:col-span-5) with Dedicated Image Panel */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-sky-50/40 via-slate-50/60 to-white p-6 md:p-8 shadow-sm flex flex-col items-center justify-center min-h-[340px] lg:min-h-[420px] group">
                  {/* Subtle ambient lighting & backdrop dots */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.08),transparent_70%)] opacity-80" />
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/10 blur-2xl" />
                  <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />

                  {/* Cloudinary Career Image Container */}
                  <img
                    src={resolvedBanner}
                    alt={job.title}
                    className="relative z-10 h-auto max-h-[340px] sm:max-h-[380px] lg:max-h-[420px] w-auto max-w-full object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Section Navigation */}
        {navItems.length > 0 && (
          <nav
            ref={subnavRef}
            className="sticky z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-300"
            style={{ top: 'var(--primary-nav-height, 80px)' }}
          >
            <div className="detail-page-gutter mx-auto w-full px-4 md:px-6 lg:px-12 xl:px-20">
              <div className="scrollbar-none flex items-center gap-4 overflow-x-auto scroll-smooth whitespace-nowrap py-2.5 md:gap-8 md:py-3">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={scrollToSection(item.id)}
                    className={cn(
                      'shrink-0 border-b-2 pb-1.5 px-3 text-sm md:text-base font-semibold transition-all focus:outline-none mobile-touch-target',
                      activeId === item.id
                        ? 'border-emerald-600 text-emerald-700 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        )}

        <section className="detail-page-gutter mx-auto mt-8 w-full px-4 pb-16 md:px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {shortDesc && (
                <motion.section
                  id="summary"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">Role Summary</h2>
                  <RichTextContent
                    content={shortDesc}
                    className="!text-base leading-relaxed text-slate-600 [&_p]:!text-base"
                  />
                </motion.section>
              )}

              {fullDesc && (
                <motion.section
                  id="details"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">Job Details</h2>
                  <RichTextContent
                    content={fullDesc}
                    className="!text-base leading-relaxed text-slate-600 [&_p]:!text-base"
                  />
                </motion.section>
              )}

              {job.whatYouWillWorkOn && job.whatYouWillWorkOn.length > 0 && (
                <motion.section
                  id="work-on"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">What You'll Work On</h2>
                  <ul className="space-y-3">
                    {job.whatYouWillWorkOn.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-base font-medium leading-relaxed text-slate-600">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <motion.section
                  id="responsibilities"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-base font-medium leading-relaxed text-slate-600"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <motion.section
                  id="requirements"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">
                    Requirements & Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-lg border-none bg-slate-100 px-3.5 py-1 text-xs font-bold uppercase text-slate-700"
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>
                </motion.section>
              )}

              {job.preferredQualifications && job.preferredQualifications.length > 0 && (
                <motion.section
                  id="preferred"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">Preferred Qualifications & Nice-to-Haves</h2>
                  <ul className="space-y-3">
                    {job.preferredQualifications.map((pref, index) => (
                      <li key={index} className="flex items-start gap-3 text-base font-medium leading-relaxed text-slate-600">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{pref}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {job.techStack && job.techStack.length > 0 && (
                <motion.section
                  id="tech-stack"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-4 font-display text-heading-sm text-slate-900">Technology Stack</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {job.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="px-3.5 py-1 bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 rounded-lg text-xs font-semibold">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </motion.section>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <motion.section
                  id="benefits"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  className={cn(MODULE_SHELL, 'md:p-10')}
                >
                  <h2 className="mb-6 font-display text-heading-sm text-slate-900">What We Offer</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {job.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-base font-medium leading-snug text-slate-700">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {job.hiringProcess && job.hiringProcess.length > 0 && (
                <motion.section
                  id="hiring-process"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={MODULE_SHELL}
                >
                  <h2 className="mb-6 font-display text-heading-sm text-slate-900">Our Hiring Process</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.hiringProcess.map((stepItem, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#041a3d] text-white font-bold text-sm">
                          {stepItem.step || index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug">{stepItem.title}</h3>
                          {stepItem.description && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{stepItem.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              <motion.section
                id="team"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.14 }}
                className="scroll-mt-24 border-t border-slate-200/80 pt-12"
              >
                <h2 className="mb-2 font-display text-heading-sm text-slate-900">About The Team</h2>
                <p className="mb-6 text-base leading-relaxed text-slate-600">
                  We believe in structured execution, transparent pipelines, and collaborative
                  problem-solving.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="relative h-44 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100">
                      <img
                        src={resolvedOffice}
                        alt="Office Workspace"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <Building2 className="h-3.5 w-3.5" /> Collaborative Workspace
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="relative h-44 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100">
                      <img
                        src={resolvedTeam}
                        alt="Team Sync"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <Users className="h-3.5 w-3.5" /> Product Team Sync
                    </span>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Sidebar — Service Sidebar visual language */}
            <div
              className="space-y-6 lg:sticky"
              style={{
                top: 'calc(var(--primary-nav-height, 80px) + var(--secondary-nav-height, 48px) + 16px)',
              }}
            >
              <div
                id="apply"
                className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white p-6 shadow-sm scroll-mt-24"
              >
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl" />

                <h3 className="border-b border-slate-100 pb-3 font-display text-base md:text-lg font-bold text-slate-900 leading-snug">
                  Role Metadata
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 text-xs md:text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">Department</p>
                      <p className="mt-0.5 text-xs md:text-sm text-slate-600 font-medium">{job.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs md:text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">Employment Type</p>
                      <p className="mt-0.5 text-xs md:text-sm text-slate-600 font-medium">{job.employmentType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs md:text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">Location</p>
                      <p className="mt-0.5 text-xs md:text-sm text-slate-600 font-medium">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs md:text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">Experience</p>
                      <p className="mt-0.5 text-xs md:text-sm text-slate-600 font-medium">{job.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs md:text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">Salary</p>
                      <p className="mt-0.5 text-xs md:text-sm text-slate-600 font-medium">{job.salary}</p>
                    </div>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex items-start gap-4 text-xs md:text-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-bold text-slate-900">Deadline</p>
                        <p className="mt-0.5 text-xs md:text-sm text-slate-600 font-medium">
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    className="h-11 w-full rounded-xl bg-emerald-600 py-2.5 text-sm md:text-base font-extrabold text-white shadow-sm transition-all hover:bg-emerald-700"
                  >
                    <Link to={`/careers/apply/${job.slug}`}>Apply Now</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default JobDetails;
