import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJobBySlug, Job } from '@/services/job.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';
import careersBg from '../assets/careers-bg.png';

const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  linkedinUrl: z.string().url('Invalid URL').or(z.literal('')),
  portfolioUrl: z.string().url('Invalid URL').or(z.literal('')),
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const JobApplication = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug || ''),
    enabled: !!slug,
  });

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
      linkedinUrl: '',
      portfolioUrl: '',
      coverLetter: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume file size must be less than 5MB.');
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected resume: ${file.name}`);
    }
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!selectedFile) {
      toast.error('Please upload your resume to complete the application.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast.success('Application submitted successfully! Our talent acquisition team will review your application soon.');
    reset();
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-xl">
            <div className="h-6 w-1/4 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-200 rounded" />
            <div className="h-40 w-full bg-slate-200 rounded" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Opening Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            The job you are trying to apply for does not exist or has been closed.
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

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-zinc-950 pt-28 pb-12 border-b border-zinc-900 text-white">
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none z-0"
          style={{ 
            backgroundImage: `url(${careersBg})`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <Link 
            to={`/careers/${job.slug}`} 
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Role Details
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-display">
            Apply for {job.title}
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm font-medium">
            {job.department} &bull; {job.location} &bull; {job.employmentType}
          </p>
        </div>
      </section>

      {/* Main Application Form Container */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                <CardTitle className="text-lg font-bold text-slate-900">Personal Details & Career History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="border-slate-200 focus-visible:ring-emerald-500"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="border-slate-200 focus-visible:ring-emerald-500"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        className="border-slate-200 focus-visible:ring-emerald-500"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn & Portfolio Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-xs font-bold text-slate-700">LinkedIn Profile URL</Label>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/in/username"
                        className="border-slate-200 focus-visible:ring-emerald-500"
                        {...register('linkedinUrl')}
                      />
                      {errors.linkedinUrl && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.linkedinUrl.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolioUrl" className="text-xs font-bold text-slate-700">Portfolio / GitHub URL</Label>
                      <Input
                        id="portfolioUrl"
                        placeholder="https://github.com/username"
                        className="border-slate-200 focus-visible:ring-emerald-500"
                        {...register('portfolioUrl')}
                      />
                      {errors.portfolioUrl && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.portfolioUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resume Upload UI */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Resume / CV *</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors relative cursor-pointer bg-slate-50/50">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        {selectedFile ? (
                          <>
                            <FileText className="h-10 w-10 text-emerald-600 animate-bounce" />
                            <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Click or drag to change
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-slate-400" />
                            <p className="text-sm font-bold text-slate-700">Click or drag your CV here</p>
                            <p className="text-[10px] text-slate-400">Supports PDF, DOC, DOCX up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="text-xs font-bold text-slate-700">Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      rows={6}
                      placeholder="Describe why you are a great fit for this position..."
                      className="border-slate-200 focus-visible:ring-emerald-500 resize-none"
                      {...register('coverLetter')}
                    />
                    {errors.coverLetter && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.coverLetter.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3 transition-colors h-11"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default JobApplication;
