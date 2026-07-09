import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea';
  rows?: number;
}

interface CmsTextFieldsProps {
  fields: FieldConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export const CmsTextFields = ({ fields, values, onChange }: CmsTextFieldsProps) => (
  <div className="space-y-4">
    {fields.map(({ key, label, type = 'text', rows = 3 }) => (
      <div key={key}>
        <label className="text-[10px] font-bold uppercase text-slate-500">{label}</label>
        {type === 'textarea' ? (
          <Textarea
            value={values[key] ?? ''}
            onChange={(e) => onChange(key, e.target.value)}
            className="mt-1 min-h-[80px]"
            rows={rows}
          />
        ) : (
          <Input value={values[key] ?? ''} onChange={(e) => onChange(key, e.target.value)} className="mt-1" />
        )}
      </div>
    ))}
  </div>
);

interface CmsSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const CmsSectionCard = ({ title, description, children }: CmsSectionCardProps) => (
  <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
    <div>
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
    </div>
    {children}
  </section>
);

interface CmsSaveBarProps {
  onSave: () => void;
  isSaving: boolean;
}

export const CmsSaveBar = ({ onSave, isSaving }: CmsSaveBarProps) => (
  <Button onClick={onSave} disabled={isSaving} className="gap-2">
    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
    Save Settings
  </Button>
);
