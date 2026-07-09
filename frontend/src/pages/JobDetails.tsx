import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobBySlug, Job } from '@/services/job.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, Clock, Briefcase, DollarSign, Calendar, 
  ArrowLeft, CheckCircle2, ChevronRight, Users, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RichTextContent } from '@/components/common/RichTextContent';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical, seoFromApi } from '@/lib/seoResolve';
import { stripHtmlToText } from '@/lib/sanitizeHtml';
import { PageHeader } from '@/components/ui/PageHeader';
import careersBg from '../assets/careers-bg-new.png';

export const JobDetails = () => {
  const { slug } = useParams<{ slug: string }>();

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

  if (error) {
    return (
      <>
        {seoBlock}
        <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Opening Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            We couldn't retrieve the details for this position. It may have been closed or removed.
          </p>
          <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
            <Link to="/careers">Back to Careers</Link>
          </Button>
        </div>
        <Footer />
      </main>
      </>
    );
  }

  // Parse Short, Full, Banner, Office, Team Image URLs from standard description field
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

  // Fallbacks for empty image fields to keep page premium and realistic
  const resolvedBanner = bannerImg || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200";
  const resolvedOffice = officeImg || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800";
  const resolvedTeam = teamImg || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800";

  return (
    <>
      {seoBlock}
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Header Section */}
      <PageHeader
        title={
          <>
            <div className="mb-6">
              <Link 
                to="/careers" 
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Careers
              </Link>
            </div>
            {isLoading ? (
              <div className="h-10 w-2/3 bg-slate-800 rounded animate-pulse" />
            ) : (
              job?.title || 'Job Opening'
            )}
          </>
        }
        backgroundImage={careersBg}
      >
        {isLoading ? (
          <div className="flex gap-4 pt-2 animate-pulse mt-4">
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-800 rounded" />
          </div>
        ) : job ? (
          <div className="space-y-4 mt-2">
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-wider text-[9px] px-2.5 py-0.5 rounded inline-block">
              {job.department}
            </Badge>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-wider text-zinc-300 pt-2">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-500" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-emerald-500" /> {job.employmentType}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-emerald-500" /> {job.experience}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-emerald-500" /> {job.salary}</span>
            </div>
          </div>
        ) : null}
      </PageHeader>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-6">
        <div className="container mx-auto px-0 max-w-5xl flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-800 truncate max-w-[200px]">{isLoading ? 'Loading...' : job?.title}</span>
        </div>
      </div>

      {/* Detail Layout */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-slate-200 rounded-2xl" />
                <div className="h-40 bg-slate-200 rounded-2xl" />
              </div>
              <div className="h-72 bg-slate-200 rounded-2xl" />
            </div>
          ) : (
            job && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Side Content */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Short Description overview */}
                  {shortDesc && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      className="bg-emerald-50/20 border border-emerald-500/10 p-6 rounded-2xl"
                    >
                      <h2 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-3">Role Summary</h2>
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                        {shortDesc}
                      </p>
                    </motion.div>
                  )}

                  {/* Full Description role details */}
                  {fullDesc && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">Job Details</h2>
                      <RichTextContent
                        content={fullDesc}
                        className="text-sm text-slate-655 leading-relaxed font-semibold"
                      />
                    </motion.div>
                  )}

                  {/* Requirements & Skills tags */}
                  {job.requirements && job.requirements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">Requirements & Skills</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 border-none font-bold text-[10px] uppercase py-1 px-3.5 rounded-lg">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Responsibilities list */}
                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">Key Responsibilities</h2>
                      <ul className="space-y-3">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-slate-655 font-semibold leading-relaxed">
                            <ChevronRight className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Benefits grid */}
                  {job.benefits && job.benefits.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">What We Offer</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 leading-snug">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* About Team corporate photo showcases */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-6 pt-6 border-t border-slate-200/80"
                  >
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">About The Team</h2>
                      <p className="text-slate-500 text-xs font-semibold">We believe in structured execution, transparent pipelines, and collaborative problem-solving.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2 group">
                        <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                          <img src={resolvedOffice} alt="Office Workspace" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" /> Collaborative Workspace
                        </span>
                      </div>

                      <div className="space-y-2 group">
                        <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                          <img src={resolvedTeam} alt="Team Sync" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" /> Product Team Sync
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar Application Panel */}
                <div className="space-y-6 lg:sticky lg:top-28">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Card className="border-slate-200/80 shadow-lg overflow-hidden bg-white rounded-3xl">
                      <div className="bg-slate-950 p-6 text-white text-center border-b border-slate-900">
                        <h3 className="font-extrabold text-base mb-1 font-display tracking-tight">Interested in this role?</h3>
                        <p className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Apply today in just a few steps</p>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider">Department</span>
                            <span className="text-slate-800 font-bold">{job.department}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider">Employment Type</span>
                            <span className="text-slate-800 font-bold">{job.employmentType}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider">Location</span>
                            <span className="text-slate-800 font-bold">{job.location}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider">Experience</span>
                            <span className="text-slate-800 font-bold">{job.experience}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider">Salary</span>
                            <span className="text-slate-800 font-bold">{job.salary}</span>
                          </div>
                          {job.applicationDeadline && (
                            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                              <span className="text-slate-400 font-semibold uppercase tracking-wider">Deadline</span>
                              <span className="text-red-500 font-bold flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-11 font-bold shadow-md shadow-emerald-500/10">
                          <Link to={`/careers/apply/${job.slug}`}>Apply Now</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
};

export default JobDetails;
