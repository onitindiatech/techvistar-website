import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobBySlug, Job, submitJobApplication } from '@/services/job.service';
import { uploadResumeFile, validateResumeFile } from '@/services/upload.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertCircle,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageSeo } from '@/components/common/PageSeo';
import { buildCanonical } from '@/lib/seoResolve';
import { MobileBackButton } from '@/components/ui/MobileBackButton';

import { FALLBACK_JOBS } from '@/data/jobs';

const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  currentLocation: z.string().min(2, 'Current location is required'),
  yearsOfExperience: z.coerce.number().min(0, 'Years of experience cannot be negative'),
  linkedinUrl: z.string().url('Invalid URL').or(z.literal('')),
  portfolioUrl: z.string().url('Invalid URL').or(z.literal('')),
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
  whyJoinVeenero: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const MODULE_SHELL =
  'relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8';

export const JobApplication = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug || ''),
    enabled: !!slug,
  });

  const activeJob = (() => {
    if (job) return job;
    if (!slug) return undefined;
    return FALLBACK_JOBS.find((j) => j.slug === slug);
  })();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      currentLocation: '',
      yearsOfExperience: 0,
      linkedinUrl: '',
      portfolioUrl: '',
      coverLetter: '',
      whyJoinVeenero: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateResumeFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected resume: ${file.name}`);
    }
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!job) {
      toast.error('Unable to submit. Job details not fully loaded.');
      return;
    }
    if (!selectedFile) {
      toast.error('Please upload your resume to complete the application.');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedResume = await uploadResumeFile(selectedFile);
      await submitJobApplication({
        jobId: job._id,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        currentLocation: values.currentLocation,
        yearsOfExperience: values.yearsOfExperience,
        linkedin: values.linkedinUrl,
        portfolio: values.portfolioUrl,
        coverLetter: values.coverLetter,
        whyJoinVeenero: values.whyJoinVeenero || '',
        resumeUrl: uploadedResume.resumeUrl,
        resumePublicId: uploadedResume.publicId,
        resumeMimeType: uploadedResume.mimeType,
        originalFileName: uploadedResume.originalFileName,
      });

      toast.success(
        'Application submitted successfully! Our talent acquisition team will review your application soon.'
      );
      reset();
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoBlock = (
    <PageSeo
      seo={{ robotsIndex: false, robotsFollow: true }}
      defaults={{
        title: job ? `Apply: ${job.title} | TechVistar Careers` : 'Job Application | TechVistar',
        description: job
          ? `Submit your application for the ${job.title} role at TechVistar.`
          : 'Submit your job application to TechVistar.',
        url: job ? buildCanonical(`/careers/apply/${job.slug}`) : buildCanonical('/careers'),
      }}
    />
  );

  if (isLoading) {
    return (
      <>
        {seoBlock}
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <div className="font-display text-slate-500">Loading application form...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !job) {
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
              The job you are trying to apply for does not exist or has been closed.
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

  return (
    <>
      {seoBlock}
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-0">
        {/* Hero — Services Detail architecture */}
        <section className="mb-6 border-b border-slate-200 bg-white pb-8 pt-[4.5rem] md:mb-8 md:pb-14 md:pt-28">
          <div className="detail-page-gutter mx-auto w-full px-4 md:px-6 lg:px-12 xl:px-20">
            <MobileBackButton to={`/careers/${job.slug}`} label="Role Details" className="mb-6" />

            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                {job.department}
              </div>

              <h1 className="font-display text-[1.75rem] font-extrabold leading-[1.12] text-slate-900 md:text-5xl md:leading-tight">
                Apply for {job.title}
              </h1>

              <p className="text-base font-bold leading-snug text-emerald-600 md:text-lg">
                {job.department}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2.5 pt-1 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" /> {job.employmentType}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-600" /> {job.experience}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-page-gutter mx-auto mt-8 w-full px-4 pb-16 md:px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className={MODULE_SHELL}>
                <h2 className="mb-6 border-b border-slate-100 pb-4 font-display text-heading-sm text-slate-900">
                  Personal Details & Career History
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentLocation" className="text-xs font-bold text-slate-700">
                        Current Location *
                      </Label>
                      <Input
                        id="currentLocation"
                        placeholder="e.g. Hyderabad, India"
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                        {...register('currentLocation')}
                      />
                      {errors.currentLocation && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.currentLocation.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience" className="text-xs font-bold text-slate-700">
                        Years of Experience *
                      </Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 2.5"
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                        {...register('yearsOfExperience')}
                      />
                      {errors.yearsOfExperience && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" />{' '}
                          {errors.yearsOfExperience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-xs font-bold text-slate-700">
                        LinkedIn Profile URL
                      </Label>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/in/username"
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                        {...register('linkedinUrl')}
                      />
                      {errors.linkedinUrl && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.linkedinUrl.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolioUrl" className="text-xs font-bold text-slate-700">
                        Portfolio / GitHub URL
                      </Label>
                      <Input
                        id="portfolioUrl"
                        placeholder="https://github.com/username"
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                        {...register('portfolioUrl')}
                      />
                      {errors.portfolioUrl && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.portfolioUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume-upload" className="text-xs font-bold text-slate-700">
                      Resume / CV *
                    </Label>
                    <div className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:border-emerald-500">
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        {selectedFile ? (
                          <>
                            <FileText className="h-10 w-10 text-emerald-600" />
                            <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Click or
                              drag to change
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-slate-400" />
                            <p className="text-sm font-bold text-slate-700">
                              Click or drag your CV here
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Supports PDF, DOC, DOCX, PNG, JPG up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="text-xs font-bold text-slate-700">
                      Cover Letter *
                    </Label>
                    <Textarea
                      id="coverLetter"
                      rows={6}
                      placeholder="Describe why you are a great fit for this position..."
                      className="resize-none rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                      {...register('coverLetter')}
                    />
                    {errors.coverLetter && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.coverLetter.message}
                      </p>
                    )}
                  </div>

                  {/* Why Join Veenero */}
                  <div className="space-y-2">
                    <Label htmlFor="whyJoinVeenero" className="text-xs font-bold text-slate-700">Why do you want to join Veenero?</Label>
                    <Textarea
                      id="whyJoinVeenero"
                      rows={3}
                      placeholder="Share your motivation..."
                      className="resize-none rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                      {...register('whyJoinVeenero')}
                    />
                    {errors.whyJoinVeenero && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.whyJoinVeenero.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar — Service Sidebar visual language */}
            <div
              className="space-y-6 lg:sticky"
              style={{
                top: 'calc(var(--primary-nav-height, 80px) + 16px)',
              }}
            >
              <div className="relative space-y-6 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white p-6 shadow-sm">
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl" />

                <h3 className="border-b border-slate-100 pb-3 font-display text-xs font-black uppercase tracking-wider text-slate-900">
                  Applying For
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 text-xs">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Role</p>
                      <p className="mt-0.5 text-slate-500">{job.title}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Location</p>
                      <p className="mt-0.5 text-slate-500">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Employment Type</p>
                      <p className="mt-0.5 text-slate-500">{job.employmentType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-xs">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Salary</p>
                      <p className="mt-0.5 text-slate-500">{job.salary}</p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="h-10 w-full rounded-xl border-slate-200 text-xs font-bold"
                >
                  <Link to={`/careers/${job.slug}`}>View Role Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default JobApplication;
