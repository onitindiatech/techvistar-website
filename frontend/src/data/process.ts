// ** Delivery process — homepage process block (VISTAR-inspired phases) */
import {
  FileSearch,
  Code2,
  Share2,
  Headset,
} from 'lucide-react';

export const SECTION_PROCESS = {
  tag: 'Delivery process',
  title: 'Vision to results,',
  highlight: 'without guesswork',
  description:
    'A four-phase VISTAR-style framework: align on vision and insight, lock strategy and build, ship technology with integration discipline, then accelerate with support and measurable optimization.',
  footnote:
    'The same phases apply whether discovery is a focused workshop or a full audit, and whether build is one squad or several—governance, documentation, and sign-off stay consistent throughout.',
} as const;

export const PROCESS_PILLARS = ['Insight', 'Strategy', 'Results'] as const;

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Insight & build',
    description:
      'Iterative delivery with demos, code review, and test evidence. You see product and metrics on a steady cadence—not a black box.',
    icon: Code2,
    deliverables: [
      'Incremental builds with review checkpoints',
      'Automated tests matched to critical paths',
      'Traceable backlog and release notes',
    ] as const,
  },
  {
    step: '02',
    title: 'Strategy & integration',
    description:
      'Deployment to your environments, integrations with CRM and ops tools, runbooks, and knowledge transfer so your team can operate and extend what we ship.',
    icon: Share2,
    deliverables: [
      'Environment-specific deploy and rollback paths',
      'Integration tests and data contracts',
      'Handover sessions and documentation',
    ] as const,
  },
  {
    step: '03',
    title: 'Technology & acceleration',
    description:
      'Post-launch fixes, enhancements, performance and cost tuning—with SLAs, escalation paths, and optimization tied to agreed KPIs.',
    icon: Headset,
    deliverables: [
      'Defined response times and escalation',
      'Triage for defects vs enhancements',
      'Ongoing performance, funnel, and cost visibility',
    ] as const,
  },
] as const;
