import { SolutionDetail } from '@/data/solutions';
import { ProcessTimeline, TimelineStep } from '@/components/common/ProcessTimeline';

interface SectionProps {
  solution: SolutionDetail;
}

export const SolutionProcessSection = ({ solution }: SectionProps) => {
  const steps: TimelineStep[] = (solution.howItWorks ?? []).map((step) => ({
    title: step.title,
    description: step.desc,
  }));

  return (
    <ProcessTimeline
      steps={steps}
      title={solution.sectionCopy?.processTitle || 'Development Process'}
      subtitle={solution.sectionCopy?.processSubtitle}
      showSparkles={true}
    />
  );
};

export default SolutionProcessSection;
