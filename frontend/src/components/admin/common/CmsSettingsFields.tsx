import { Loader2, Save, LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── CmsTextFields ────────────────────────────────────────────────────────────

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea';
  rows?: number;
  /** If true this field always spans full width even inside a twoColumn layout */
  fullWidth?: boolean;
  placeholder?: string;
  helperText?: string;
}

interface CmsTextFieldsProps {
  fields: FieldConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  /** Render text-only fields in a responsive two-column grid */
  twoColumn?: boolean;
}

export const CmsTextFields = ({ fields, values, onChange, twoColumn = false }: CmsTextFieldsProps) => {
  const renderField = (field: FieldConfig) => {
    const { key, label, type = 'text', rows = 3, placeholder, helperText } = field;
    return (
      <div key={key} className="space-y-1.5">
        <label className="text-label uppercase text-slate-400">{label}</label>
        {type === 'textarea' ? (
          <Textarea
            value={values[key] ?? ''}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            className="mt-1 min-h-[90px] rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50/80 focus-visible:bg-white focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/10 transition-all text-slate-800 text-body-sm placeholder:text-slate-400"
            rows={rows}
          />
        ) : (
          <Input
            value={values[key] ?? ''}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            className="mt-1 h-10 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50/80 focus-visible:bg-white focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/10 transition-all text-slate-800 text-body-sm placeholder:text-slate-400"
          />
        )}
        {helperText && (
          <p className="mt-1 text-label normal-case tracking-normal text-slate-400">{helperText}</p>
        )}
      </div>
    );
  };

  if (!twoColumn) {
    return <div className="space-y-4">{fields.map(renderField)}</div>;
  }

  // Two-column: group consecutive non-textarea fields into pairs; textareas always full-width
  const rows: FieldConfig[][] = [];
  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    const isWide = field.type === 'textarea' || field.fullWidth;
    if (isWide) {
      rows.push([field]);
      i++;
    } else if (i + 1 < fields.length && fields[i + 1].type !== 'textarea' && !fields[i + 1].fullWidth) {
      rows.push([field, fields[i + 1]]);
      i += 2;
    } else {
      rows.push([field]);
      i++;
    }
  }

  return (
    <div className="space-y-4">
      {rows.map((row, ri) =>
        row.length === 2 ? (
          <div key={ri} className="grid grid-cols-2 gap-4">
            {row.map(renderField)}
          </div>
        ) : (
          <div key={ri}>{row.map(renderField)}</div>
        )
      )}
    </div>
  );
};

// ─── CmsSectionCard ───────────────────────────────────────────────────────────

interface CmsSectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  /** Optional badge shown alongside the title */
  badge?: string;
}

export const CmsSectionCard = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  badge,
}: CmsSectionCardProps) => (
  <section
    className={cn(
      'space-y-5 rounded-2xl border border-slate-200/60 bg-white p-6 md:p-8',
      'shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.025)]',
      'transition-all duration-300',
      className
    )}
  >
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-body-sm font-black uppercase tracking-wider text-slate-900">
              {title}
            </h2>
            {badge && (
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-label font-black uppercase text-emerald-700">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 text-caption text-slate-400">{description}</p>
          )}
        </div>
      </div>
    </div>
    <div className="space-y-4 pt-1">{children}</div>
  </section>
);

// ─── CmsSaveBar (kept for backward-compatibility) ─────────────────────────────

interface CmsSaveBarProps {
  onSave: () => void;
  isSaving: boolean;
}

export const CmsSaveBar = ({ onSave, isSaving }: CmsSaveBarProps) => (
  <Button
    onClick={onSave}
    disabled={isSaving}
    className="gap-2 h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm hover:shadow transition-all text-button font-bold"
  >
    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
    Save Settings
  </Button>
);

// ─── CmsFieldRow ──────────────────────────────────────────────────────────────
/** Labelled wrapper for any arbitrary input component */
interface CmsFieldRowProps {
  label: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const CmsFieldRow = ({ label, helperText, children, className }: CmsFieldRowProps) => (
  <div className={cn('space-y-1.5', className)}>
    <label className="text-label uppercase text-slate-400">{label}</label>
    {children}
    {helperText && <p className="text-label normal-case tracking-normal text-slate-400">{helperText}</p>}
  </div>
);

// ─── CmsTwoCol ────────────────────────────────────────────────────────────────
/** Simple responsive two-column grid wrapper */
export const CmsTwoCol = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4', className)}>{children}</div>
);
