import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Check,
  ArrowRight,
  Sparkles,
  Send,
  Lock,
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';
import { Service } from '@/data/services';
import { useToast } from '@/hooks/use-toast';
import ElectricBorder from '@/components/ui/ElectricBorder';

interface ServiceHeroProps {
  service: Service;
}

export const ServiceHero = ({ service }: ServiceHeroProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
    description: '',
    agree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.agree) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all required fields and accept the agreement.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Inquiry Submitted',
      description: `Thank you, ${formData.name}! We will get back to you in under 4 business hours regarding ${service.title}.`,
    });

    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      budget: '',
      timeline: '',
      description: '',
      agree: false,
    });
  };

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const getStatIcon = (iconType: string) => {
    switch (iconType) {
      case 'rocket':
        return Rocket;
      case 'clock':
        return Clock;
      case 'dollar':
        return DollarSign;
      case 'chart':
        return TrendingUp;
      case 'shield':
        return Shield;
      case 'star':
        return Star;
      default:
        return Rocket;
    }
  };

  const getThemeClasses = (colorTheme: string) => {
    switch (colorTheme) {
      case 'green':
        return {
          iconBg: 'bg-emerald-100 text-emerald-600',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 text-purple-600',
        };
      case 'gold':
        return {
          iconBg: 'bg-amber-100 text-amber-600',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-100 text-blue-600',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-600',
        };
    }
  };

  return (
    <section className="bg-[#f8fafc] border-b border-slate-200 py-10 md:py-14 mb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/services" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all services
        </Link>

        {/* Main Grid: Left Side Content (spans 8 cols) vs Right Side Consultation Card (spans 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Columns (8/12 width) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Half: Text Details & Robot Illustration side by side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Text Area */}
              <div className="md:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  {service.title} Solutions
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 leading-tight">
                  {service.title}
                </h1>
                
                <p className="text-base md:text-lg font-bold text-emerald-600 leading-snug">
                  Accelerate your digital footprint with custom {service.title.toLowerCase()} configurations.
                </p>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.longDescription}
                </p>

                {/* Key Highlights */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-semibold">
                    Key Highlights
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                    {service.benefits.map((highlight, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 font-medium">
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 flex items-center justify-center p-0.5 mt-0.5 shrink-0 border border-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Image / Illustration Area */}
              <div className="md:col-span-5 flex items-center justify-center py-4 md:py-0">
                <img
                  src={service.coverImage}
                  alt={service.title}
                  className="w-full max-w-[280px] md:max-w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Bottom Half: Stats, Buttons, and Partner Logos */}
            <div className="space-y-6 pt-6 border-t border-slate-200/60">
              
              {/* Stats Cards */}
              {service.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {service.stats.map((stat, idx) => {
                    const IconComponent = getStatIcon(stat.iconType);
                    const theme = getThemeClasses(stat.colorTheme);
                    return (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`h-8 w-8 rounded-full ${theme.iconBg} flex items-center justify-center shrink-0`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">{stat.value}</p>
                          <p className="text-[10px] text-slate-500 leading-tight font-semibold">{stat.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 px-6 rounded-lg transition-all shadow-sm">
                  <a href="#inquiry-form-card" onClick={scrollToSection('inquiry-form-card')}>
                    <Send className="h-3.5 w-3.5" /> Request Proposal
                  </a>
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg transition-all" asChild>
                  <a href="#case-studies" onClick={scrollToSection('case-studies')}>
                    View Case Studies <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </a>
                </Button>
              </div>

            </div>
          </div>

          {/* Right Column: Inquiry Form Card (4/12 width) */}
          <div id="inquiry-form-card" className="lg:col-span-4 scroll-mt-24 w-full">
            <ElectricBorder
              color="#10b981"
              speed={0}
              chaos={0}
              borderRadius={16}
            >
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Request Free Consultation
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mb-5 leading-relaxed">
                  Describe your requirements and obtain a custom SOW draft from our engineering leads.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="inquiry-name" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="inquiry-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="bg-white border-slate-200 text-xs h-9"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inquiry-company" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Company Name
                      </label>
                      <Input
                        id="inquiry-company"
                        type="text"
                        placeholder="Acme Corp"
                        className="bg-white border-slate-200 text-xs h-9"
                        value={formData.company}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry-phone" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="inquiry-phone"
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        className="bg-white border-slate-200 text-xs h-9"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="inquiry-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className="bg-white border-slate-200 text-xs h-9"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inquiry-budget" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Estimated Budget
                      </label>
                      <Input
                        id="inquiry-budget"
                        type="text"
                        placeholder="e.g. $10k - $20k"
                        className="bg-white border-slate-200 text-xs h-9"
                        value={formData.budget}
                        onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry-timeline" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Timeline
                      </label>
                      <Input
                        id="inquiry-timeline"
                        type="text"
                        placeholder="e.g. 2-3 months"
                        className="bg-white border-slate-200 text-xs h-9"
                        value={formData.timeline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-desc" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Project Description
                    </label>
                    <Textarea
                      id="inquiry-desc"
                      placeholder="Outline your milestones or technical stack goals..."
                      className="bg-white border-slate-200 text-xs min-h-[60px]"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="inquiry-agree"
                      type="checkbox"
                      required
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                      checked={formData.agree}
                      onChange={(e) => setFormData((prev) => ({ ...prev, agree: e.target.checked }))}
                    />
                    <label htmlFor="inquiry-agree" className="text-[10px] text-slate-500 leading-snug cursor-pointer selection:bg-transparent">
                      I agree to be contacted by the TechVistar engineering team.
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors h-10">
                    Request Free Consultation
                  </Button>
                </form>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-4 font-medium">
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Your information is secure and confidential.</span>
                </div>
              </div>
            </ElectricBorder>
          </div>
        </div>
      </div>
    </section>
  );
};
