import { useState } from 'react';
import {
  Loader2, Plus, Edit, Trash2, ArrowUp, ArrowDown,
  MapPin, X, Eye, EyeOff, Building2, Phone, Megaphone,
  Search, ImageOff,
} from 'lucide-react';
import { SeoManager } from '@/components/admin/common/SeoManager';
import { CmsImageField } from '@/components/admin/common/CmsImageField';
import { CmsSectionCard, CmsTextFields, CmsFieldRow, CmsTwoCol } from '@/components/admin/common/CmsSettingsFields';
import { CmsPageLayout, CmsSectionAnchor } from '@/components/admin/common/CmsPageLayout';
import { usePagesCmsSettings } from '@/hooks/usePagesCmsSettings';
import { seoFromItem } from '@/lib/seoAdmin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  getAllOffices,
  createOffice,
  updateOffice,
  deleteOffice,
  reorderOffices,
  OfficeData,
} from '@/services/office.service';

// ─── Section nav config ───────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'hero',    label: 'Hero',             icon: ImageOff   },
  { id: 'info',    label: 'Contact Info',      icon: Phone      },
  { id: 'offices', label: 'Our Offices',       icon: Building2  },
  { id: 'cta',     label: 'CTA',               icon: Megaphone  },
  { id: 'seo',     label: 'SEO',               icon: Search     },
];

// ─── OfficeCard (read-only list item) ────────────────────────────────────────

interface OfficeCardProps {
  office: OfficeData & { _id?: string };
  index: number;
  total: number;
  onEdit: (o: OfficeData & { _id?: string }) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const OfficeCard = ({ office, index, total, onEdit, onDelete, onToggle, onMoveUp, onMoveDown }: OfficeCardProps) => (
  <div className="group relative rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-slate-300/60 transition-all duration-200">
    {/* Cover image */}
    <div className="relative h-32 bg-slate-100 overflow-hidden">
      {office.image ? (
        <img
          src={office.image}
          alt={office.imageAlt || office.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-1 text-slate-300">
          <MapPin className="w-7 h-7" />
          <span className="text-[10px] font-semibold">No image</span>
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      {/* Badge */}
      <div className="absolute top-2.5 left-2.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-white bg-emerald-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-400/30">
          {office.badge}
        </span>
      </div>
      {/* Status */}
      <div className="absolute top-2.5 right-2.5">
        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          office.isActive
            ? 'text-emerald-700 bg-emerald-50/90 border-emerald-200'
            : 'text-slate-500 bg-white/80 border-slate-200'
        }`}>
          {office.isActive ? 'Active' : 'Hidden'}
        </span>
      </div>
    </div>

    {/* Info */}
    <div className="px-4 py-3">
      <h4 className="font-bold text-sm text-slate-900 truncate">{office.name}</h4>
      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{office.city}, {office.country}</p>
      <p className="text-[10px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{office.address}</p>
    </div>

    {/* Actions bar */}
    <div className="flex items-center justify-between gap-1 px-3 py-2.5 border-t border-slate-100 bg-slate-50/50">
      {/* Reorder */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMoveUp(index)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMoveDown(index)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        {/* Toggle active */}
        <button
          type="button"
          onClick={() => onToggle(office._id!, !office.isActive)}
          title={office.isActive ? 'Hide office' : 'Show office'}
          className="h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:bg-slate-100"
        >
          {office.isActive
            ? <Eye className="w-3.5 h-3.5 text-emerald-600" />
            : <EyeOff className="w-3.5 h-3.5 text-slate-400" />
          }
        </button>

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(office)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(office._id!)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

const OfficesEmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-300">
      <Building2 className="w-8 h-8" />
    </div>
    <h3 className="text-sm font-bold text-slate-800">No offices yet</h3>
    <p className="mt-1 text-xs font-medium text-slate-400 max-w-xs leading-relaxed">
      Add your first office location to display it on the Contact page.
    </p>
    <button
      type="button"
      onClick={onAdd}
      className="mt-5 h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
    >
      <Plus className="w-3.5 h-3.5" /> Add Office
    </button>
  </div>
);

// ─── ContactSettings ──────────────────────────────────────────────────────────

const ContactSettings = () => {
  const { form, setForm, isLoading, save, isSaving } = usePagesCmsSettings('contact');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Partial<OfficeData> | null>(null);

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: offices = [], isLoading: isLoadingOffices } = useQuery({
    queryKey: ['admin-offices'],
    queryFn: () => getAllOffices(),
  });

  // ── Mutations ───────────────────────────────────────────────────────────────
  const refreshOfficeQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-offices'] });
    queryClient.invalidateQueries({ queryKey: ['public-offices'] });
  };

  const createMutation = useMutation({
    mutationFn: createOffice,
    onSuccess: () => {
      refreshOfficeQueries();
      toast({ title: 'Office added successfully' });
      setIsOfficeModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: 'Failed to add office', description: err.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OfficeData> }) => updateOffice(id, data),
    onSuccess: () => {
      refreshOfficeQueries();
      toast({ title: 'Office updated successfully' });
      setIsOfficeModalOpen(false);
    },
    onError: (err: any) => {
      toast({ title: 'Failed to update office', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffice,
    onSuccess: () => {
      refreshOfficeQueries();
      toast({ title: 'Office deleted successfully' });
    },
    onError: (err: any) => {
      toast({ title: 'Failed to delete office', description: err.message, variant: 'destructive' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderOffices,
    onSuccess: () => refreshOfficeQueries(),
    onError: (err: any) => {
      toast({ title: 'Failed to reorder offices', description: err.message, variant: 'destructive' });
    },
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading settings...
      </div>
    );
  }

  const patchNested = (section: 'hero' | 'office' | 'contactInfo' | 'cta', key: string, value: string) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await save();
    setIsDirty(false);
    setLastSaved(new Date());
  };

  const handleDiscard = () => {
    setIsDirty(false);
  };

  const openAddOffice = () => {
    setEditingOffice({
      officeId: '', name: '', badge: 'HEAD OFFICE', address: '',
      city: '', country: '', googleMapsUrl: '', image: '', imagePublicId: '', imageAlt: '', isActive: true,
    });
    setIsOfficeModalOpen(true);
  };

  const handleSaveOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;

    if (!editingOffice.officeId?.trim()) { toast({ title: 'Office ID is required', variant: 'destructive' }); return; }
    if (!editingOffice.name?.trim())     { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    if (!editingOffice.badge?.trim())    { toast({ title: 'Badge is required', variant: 'destructive' }); return; }
    if (!editingOffice.address?.trim())  { toast({ title: 'Address is required', variant: 'destructive' }); return; }
    if (!editingOffice.city?.trim())     { toast({ title: 'City is required', variant: 'destructive' }); return; }
    if (!editingOffice.country?.trim())  { toast({ title: 'Country is required', variant: 'destructive' }); return; }
    if (!editingOffice.googleMapsUrl?.trim()) { toast({ title: 'Google Maps URL is required', variant: 'destructive' }); return; }
    if (!editingOffice.image?.trim())    { toast({ title: 'Image URL is required', variant: 'destructive' }); return; }

    const payload: OfficeData = {
      officeId:      editingOffice.officeId!.trim().toLowerCase(),
      name:          editingOffice.name!.trim(),
      badge:         editingOffice.badge!.trim(),
      address:       editingOffice.address!.trim(),
      city:          editingOffice.city!.trim(),
      country:       editingOffice.country!.trim(),
      googleMapsUrl: editingOffice.googleMapsUrl!.trim(),
      image:         editingOffice.image!.trim(),
      imagePublicId: editingOffice.imagePublicId || '',
      imageAlt:      editingOffice.imageAlt || editingOffice.name!,
      isActive:      editingOffice.isActive !== false,
    };

    if (editingOffice._id) {
      updateMutation.mutate({ id: editingOffice._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newIds = offices.map((o) => o._id!);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    reorderMutation.mutate(newIds);
  };

  // ── Render ───────────────────────────────────────────────────────────────────────────
  return (
    <>
    <CmsPageLayout
      title="Contact CMS"
      description="Manage Contact page hero, office locations, contact info, CTA, and SEO."
      sections={NAV_SECTIONS}
      onSave={handleSave}
      onDiscard={handleDiscard}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <CmsSectionAnchor id="hero">
        <CmsSectionCard
          title="Hero"
          description="Page headline, sub-heading, and background image shown at the top of the Contact page."
          icon={ImageOff}
        >
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'eyebrow',     label: 'Eyebrow tag',  placeholder: 'e.g. Get In Touch' },
              { key: 'title',       label: 'Page title',   placeholder: 'e.g. Contact Us' },
              { key: 'description', label: 'Description',  type: 'textarea', fullWidth: true, placeholder: 'Brief introductory description…' },
            ]}
            values={form.hero as unknown as Record<string, string>}
            onChange={(k, v) => patchNested('hero', k, v)}
          />
          <CmsImageField
            label="Hero Background Image"
            value={form.hero.backgroundImage || ''}
            onChange={(url) => patchNested('hero', 'backgroundImage', url)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      {/* ── Contact Info ──────────────────────────────────────────────────── */}
      <CmsSectionAnchor id="info">
        <CmsSectionCard
          title="Contact Information"
          description="Email address, phone number, and support text displayed in the contact section."
          icon={Phone}
        >
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'email',       label: 'Email address', placeholder: 'info@techvistar.com' },
              { key: 'phone',       label: 'Phone number',  placeholder: '+91 98765 43210' },
              { key: 'supportText', label: 'Support text',  type: 'textarea', fullWidth: true, placeholder: 'We usually respond within…' },
            ]}
            values={form.contactInfo as unknown as Record<string, string>}
            onChange={(k, v) => patchNested('contactInfo', k, v)}
          />
        </CmsSectionCard>

        <CmsSectionCard
          title="HQ summary (contact cards)"
          description="Heading, address, and hours shown in the contact info cards and HQ map section."
          icon={MapPin}
        >
          <CmsTextFields
            fields={[
              { key: 'heading', label: 'Office heading', placeholder: 'TechVistar HQ' },
              { key: 'address', label: 'Address', type: 'textarea', fullWidth: true },
              { key: 'hours', label: 'Working hours', placeholder: 'Mon–Sat, 9 AM – 7 PM IST' },
            ]}
            values={form.office as unknown as Record<string, string>}
            onChange={(k, v) => patchNested('office', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      {/* ── Our Offices ───────────────────────────────────────────────────── */}
      <CmsSectionAnchor id="offices">
        <CmsSectionCard
          title="Our Offices"
          description="Office locations with cover images, badges, and addresses displayed on the Contact page."
          icon={Building2}
        >
          {/* Header actions */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">
              {offices.length} {offices.length === 1 ? 'location' : 'locations'} configured
            </p>
            <button
              type="button"
              onClick={openAddOffice}
              className="h-8 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Office
            </button>
          </div>

          {isLoadingOffices ? (
            <div className="flex justify-center p-8 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : offices.length === 0 ? (
            <OfficesEmptyState onAdd={openAddOffice} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offices.map((office, index) => (
                <OfficeCard
                  key={office._id}
                  office={office}
                  index={index}
                  total={offices.length}
                  onEdit={(o) => { setEditingOffice({ ...o }); setIsOfficeModalOpen(true); }}
                  onDelete={(id) => {
                    if (confirm(`Delete ${office.name}?`)) deleteMutation.mutate(id);
                  }}
                  onToggle={(id, active) => updateMutation.mutate({ id, data: { isActive: active } })}
                  onMoveUp={(i) => handleReorder(i, 'up')}
                  onMoveDown={(i) => handleReorder(i, 'down')}
                />
              ))}
            </div>
          )}
        </CmsSectionCard>
      </CmsSectionAnchor>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CmsSectionAnchor id="cta">
        <CmsSectionCard
          title="CTA"
          description="Call-to-action section encouraging visitors to get in touch or book a consultation."
          icon={Megaphone}
        >
          <CmsTextFields
            twoColumn
            fields={[
              { key: 'title',       label: 'CTA Title',     placeholder: 'Ready to work with us?' },
              { key: 'buttonText',  label: 'Button text',   placeholder: 'Get in Touch' },
              { key: 'description', label: 'Description',   type: 'textarea', fullWidth: true },
              { key: 'buttonLink',  label: 'Button link',   placeholder: '/contact', fullWidth: true },
            ]}
            values={form.cta as unknown as Record<string, string>}
            onChange={(k, v) => patchNested('cta', k, v)}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

      {/* ── SEO ──────────────────────────────────────────────────────────── */}
      <CmsSectionAnchor id="seo">
        <CmsSectionCard
          title="SEO"
          description="Search engine optimisation settings for the Contact page."
          icon={Search}
        >
          <SeoManager
            value={seoFromItem(form as unknown as Record<string, unknown>)}
            onChange={(seo) => {
              setForm((prev) => ({ ...prev, ...seo }));
              setIsDirty(true);
            }}
            pathPrefix="/contact"
            defaultTitle={form.seoTitle || ''}
            defaultDescription={form.seoDescription || ''}
          />
        </CmsSectionCard>
      </CmsSectionAnchor>

    </CmsPageLayout>

    {/* ── Add / Edit Office Modal ─────────────────────────────────────────── */}
    {isOfficeModalOpen && editingOffice && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingOffice._id ? 'Edit Office' : 'Add New Office'}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                {editingOffice._id ? 'Update office details and cover image' : 'Fill in all required fields to add a new location'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOfficeModalOpen(false)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSaveOffice} className="p-6 space-y-5 flex-1">
            {/* Row 1: Office ID + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Office ID (slug)</label>
                <Input
                  value={editingOffice.officeId || ''}
                  onChange={e => setEditingOffice(prev => ({ ...prev, officeId: e.target.value }))}
                  placeholder="e.g. hyderabad"
                  disabled={!!editingOffice._id}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                />
                {editingOffice._id && <p className="text-[10px] text-slate-400">ID cannot be changed after creation</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Badge</label>
                <Input
                  value={editingOffice.badge || ''}
                  onChange={e => setEditingOffice(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. HEAD OFFICE"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Office Name</label>
              <Input
                value={editingOffice.name || ''}
                onChange={e => setEditingOffice(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Hyderabad, Telangana"
                className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Address</label>
              <Textarea
                value={editingOffice.address || ''}
                onChange={e => setEditingOffice(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street address, area, pincode…"
                className="min-h-[80px] rounded-xl border-slate-200 bg-slate-50/50 text-sm"
              />
            </div>

            {/* City + Country */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</label>
                <Input
                  value={editingOffice.city || ''}
                  onChange={e => setEditingOffice(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g. Hyderabad"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</label>
                <Input
                  value={editingOffice.country || ''}
                  onChange={e => setEditingOffice(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="e.g. India"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                />
              </div>
            </div>

            {/* Google Maps URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Maps Link</label>
              <Input
                value={editingOffice.googleMapsUrl || ''}
                onChange={e => setEditingOffice(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                placeholder="https://maps.google.com/?q=..."
                className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-mono text-xs"
              />
            </div>

            {/* Cover image */}
            <CmsImageField
              label="Cover Image"
              value={editingOffice.image || ''}
              onChange={(url, publicId) => setEditingOffice(prev => ({ ...prev, image: url, imagePublicId: publicId || '' }))}
            />

            {/* Active status toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-800">Active Status</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Controls visibility on the public website</p>
              </div>
              <Switch
                checked={editingOffice.isActive !== false}
                onCheckedChange={checked => setEditingOffice(prev => ({ ...prev, isActive: checked }))}
              />
            </div>

            {/* Footer actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsOfficeModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : 'Save Office'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default ContactSettings;
