import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobBySlug, Job } from '@/services/job.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, Clock, Briefcase, DollarSign, Calendar, 
  ArrowLeft, CheckCircle, ChevronRight, Share2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import careersBg from '../assets/careers-bg.png';

export const JobDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug || ''),
    enabled: !!slug,
    retry: 1,
  });

  if (error) {
    return (
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
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 md:pt-32 md:pb-20 border-b border-zinc-900 text-white">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none z-0"
          style={{ 
            backgroundImage: `url(${careersBg})`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Link 
            to="/careers" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Careers
          </Link>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
              <div className="h-10 w-2/3 bg-zinc-800 rounded mb-6" />
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-zinc-800 rounded" />
                <div className="h-4 w-20 bg-zinc-800 rounded" />
                <div className="h-4 w-20 bg-zinc-800 rounded" />
              </div>
            </div>
          ) : (
            job && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {job.department}
                  </Badge>
                  {job.featured && (
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                      Featured Role
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 font-display">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-500" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-emerald-500" /> {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-emerald-500" /> {job.experience}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-500" /> {job.salary}
                  </span>
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="container mx-auto px-4 max-w-5xl flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-800 truncate max-w-[200px]">
            {isLoading ? 'Loading...' : job?.title}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-4 w-1/4 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
                <div className="h-40 w-full bg-slate-200 rounded" />
              </div>
              <div className="h-60 bg-slate-200 rounded" />
            </div>
          ) : (
            job && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Info Left Column */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Job Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Job Description</h2>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {job.description}
                    </p>
                  </motion.div>

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Requirements & Skills</h2>
                      <ul className="space-y-3">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-slate-600 font-semibold leading-relaxed">
                            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Responsibilities */}
                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Key Responsibilities</h2>
                      <ul className="space-y-3">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-slate-600 font-semibold leading-relaxed">
                            <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-4">What We Offer</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <CheckCircle className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sidebar Card */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="sticky top-28"
                  >
                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                      <div className="bg-slate-950 p-6 text-white text-center border-b border-slate-900">
                        <h3 className="font-bold text-lg mb-1">Interested in this role?</h3>
                        <p className="text-zinc-400 text-xs font-medium">Apply today in just a few steps</p>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase">Department</span>
                            <span className="text-slate-800 font-bold">{job.department}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase">Employment Type</span>
                            <span className="text-slate-800 font-bold">{job.employmentType}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase">Location</span>
                            <span className="text-slate-800 font-bold">{job.location}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase">Experience</span>
                            <span className="text-slate-800 font-bold">{job.experience}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                            <span className="text-slate-400 font-semibold uppercase">Salary</span>
                            <span className="text-slate-800 font-bold">{job.salary}</span>
                          </div>
                          {job.applicationDeadline && (
                            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                              <span className="text-slate-400 font-semibold uppercase">Deadline</span>
                              <span className="text-red-500 font-bold flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-500 font-bold shadow-sm shadow-emerald-500/10">
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
  );
};

export default JobDetails;
