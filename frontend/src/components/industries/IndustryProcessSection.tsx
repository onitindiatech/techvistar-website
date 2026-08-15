import { Industry } from '@/data/industries';
import { ProcessTimeline, TimelineStep } from '@/components/common/ProcessTimeline';

interface IndustryProcessSectionProps {
  industry: Industry;
}

export const IndustryProcessSection = ({ industry }: IndustryProcessSectionProps) => {
  if (!industry.process || industry.process.length === 0) {
    return null;
  }

  const steps: TimelineStep[] = industry.process.map((step) => ({
    title: step.title,
    description: step.description,
  }));

  return (
    <ProcessTimeline
      steps={steps}
      title="Development Process"
      showSparkles={true}
    />
  );
};

export default IndustryProcessSection;
