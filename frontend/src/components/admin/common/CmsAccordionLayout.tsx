import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export interface CmsAccordionSection {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

interface CmsAccordionLayoutProps {
  sections: CmsAccordionSection[];
  defaultOpen?: string[];
  className?: string;
}

export const CmsAccordionLayout = ({
  sections,
  defaultOpen = ['hero'],
  className,
}: CmsAccordionLayoutProps) => (
  <Accordion type="multiple" defaultValue={defaultOpen} className={cn('space-y-3', className)}>
    {sections.map((section) => (
      <AccordionItem
        key={section.id}
        value={section.id}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-0"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-100">
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">{section.title}</p>
            {section.description ? (
              <p className="mt-0.5 text-xs font-normal text-slate-500">{section.description}</p>
            ) : null}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 px-6 pb-6 pt-2">{section.children}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

interface CmsStickySaveBarProps {
  onSave: () => void;
  isSaving: boolean;
  label?: string;
}

export const CmsStickySaveBar = ({ onSave, isSaving, label = 'Save Settings' }: CmsStickySaveBarProps) => (
  <div className="sticky bottom-4 z-20 flex justify-end">
    <button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-60"
    >
      {isSaving ? 'Saving…' : label}
    </button>
  </div>
);
