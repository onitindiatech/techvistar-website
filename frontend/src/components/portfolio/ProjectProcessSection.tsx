import { Project } from '@/data/projects';
import { ProcessTimeline, TimelineStep } from '@/components/common/ProcessTimeline';

interface SectionProps {
  project: Project;
}

export const ProjectProcessSection = ({ project }: SectionProps) => {
  if (!project.process?.length) return null;

  const steps: TimelineStep[] = project.process.map((step) => ({
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

export default ProjectProcessSection;
