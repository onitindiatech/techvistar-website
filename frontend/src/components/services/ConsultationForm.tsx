import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/services/contact.service';
import { ServiceConsultationBlock } from '@/types/servicesCms';

interface ConsultationFormProps {
  serviceTitle?: string;
  serviceSlug?: string;
  formConfig: ServiceConsultationBlock;
  onSuccess?: () => void;
  inline?: boolean;
}

export const ConsultationForm = ({
  serviceTitle = 'your project',
  serviceSlug,
  formConfig,
  onSuccess,
  inline = false,
}: ConsultationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    agree: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.phone?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Phone number is required.',
        variant: 'destructive',
      });
      return;
    }

    const message =
      formData.description.trim() ||
      `Consultation request for ${serviceTitle}${serviceSlug ? ` (${serviceSlug})` : ''}.`;

    setIsSubmitting(true);
    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: message.length >= 10 ? message : `${message} `.padEnd(10, '.'),
        serviceInterested: serviceTitle,
      });

      toast({
        title: formConfig.successTitle,
        description: formConfig.successMessage.replace('your project', serviceTitle),
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        agree: false,
      });

      onSuccess?.();
    } catch (err) {
      toast({
        title: 'Submission Failed',
        description: err instanceof Error ? err.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={
      inline 
        ? "text-left w-full" 
        : "bg-white border-2 border-[#0b2859] transition-colors duration-500 rounded-2xl p-6 md:p-7 shadow-[0_15px_35px_rgba(11,40,89,0.2)] text-left min-h-[80vh] sm:min-h-0 flex flex-col justify-center sm:block"
    }>
      <h3 className="mb-1.5 text-base font-bold text-slate-900">{formConfig.title}</h3>
      <p className="text-[11px] text-slate-500 mb-5 leading-relaxed">{formConfig.description}</p>

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
            className="bg-white border-slate-200 text-xs h-9 focus-visible:ring-sky-500/30 focus-visible:border-[#041a3d] focus-visible:shadow-[0_0_15px_rgba(14,165,233,0.25)]"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="inquiry-phone" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="inquiry-phone"
              type="tel"
              required
              placeholder="+1 (555) 019-2834"
              className="bg-white border-slate-200 text-xs h-9 focus-visible:ring-sky-500/30 focus-visible:border-[#041a3d] focus-visible:shadow-[0_0_15px_rgba(14,165,233,0.25)]"
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
            className="bg-white border-slate-200 text-xs h-9 focus-visible:ring-sky-500/30 focus-visible:border-[#041a3d] focus-visible:shadow-[0_0_15px_rgba(14,165,233,0.25)]"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="inquiry-desc" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Project Description
          </label>
          <Textarea
            id="inquiry-desc"
            placeholder="Outline your milestones or technical stack goals..."
            className="bg-white border-slate-200 text-xs min-h-[140px] sm:min-h-[80px] resize-none focus-visible:ring-sky-500/30 focus-visible:border-[#041a3d] focus-visible:shadow-[0_0_15px_rgba(14,165,233,0.25)]"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="inquiry-agree"
            className="mt-0.5 rounded border-slate-300 text-[#0b2859] focus:ring-[#0b2859]/20"
            checked={formData.agree}
            onChange={(e) => setFormData((prev) => ({ ...prev, agree: e.target.checked }))}
          />
          <label htmlFor="inquiry-agree" className="text-[10px] text-slate-500 leading-snug">
            {formConfig.privacyText}
          </label>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ y: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#041a3d] hover:bg-[#021028] text-white font-extrabold h-11 text-sm mt-2 rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>{formConfig.submitLabel}</span>
        </motion.button>
      </form>
    </div>
  );
};
