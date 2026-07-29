interface CmsFutureFeatureCalloutProps {
  title?: string;
  children: React.ReactNode;
}

export function CmsFutureFeatureCallout({
  title = 'Future Feature — Not Live Yet',
  children,
}: CmsFutureFeatureCalloutProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-1 text-[12px] leading-relaxed text-amber-900/90">{children}</div>
    </div>
  );
}
