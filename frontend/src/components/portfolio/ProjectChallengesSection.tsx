import { Project } from '@/data/projects';
import { ProcessTimeline, TimelineStep } from '@/components/common/ProcessTimeline';

interface SectionProps {
  project: Project;
}

export const ProjectChallengesSection = ({ project }: SectionProps) => {
  if (!project.challenges?.length) return null;

  const steps: TimelineStep[] = project.challenges.map((challenge) => ({
    description: challenge,
  }));

  return (
    <ProcessTimeline
      steps={steps}
      title="Challenges & Solutions"
      showSparkles={true}
      labelPrefix="Challenge"
    />
  );
};

export default ProjectChallengesSection;
