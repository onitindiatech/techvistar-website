import { Service } from '@/data/services';
import { ProcessTimeline, TimelineStep } from '@/components/common/ProcessTimeline';

interface SectionProps {
  service: Service;
}

export const ProcessSection = ({ service }: SectionProps) => {
  const steps: TimelineStep[] = (service.process ?? []).map((step) => ({
    title: step.title,
    description: step.description,
  }));

  return (
    <ProcessTimeline
      steps={steps}
      title="Development Process"
      showSparkles={false}
    />
  );
};

export default ProcessSection;
