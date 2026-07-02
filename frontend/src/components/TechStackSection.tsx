import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  icon: React.ReactNode;
}

export const TechStackSection = () => {
  const prefersReducedMotion = useReducedMotion();

  // Tech items list
  const row1Techs: TechItem[] = [
    {
      name: 'HTML5',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#E34F26]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.7 6H5.8l.4 4.5h9.4l-.4 4.5-3.2 1-3.2-1-.2-2.3H4.1l.4 5.3 7.5 2.5 7.5-2.5.7-9.5H8.2l-.2-2.2h10.4l-.2-2.3z" />
        </svg>
      )
    },
    {
      name: 'CSS3',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#1572B6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.4 6H9.2l-.2-2.2h10.4L19 1.5H4.1l1.2 13.8h9.3l-.3 3.3-2.4.7-2.4-.7-.2-1.7H5.2l.4 3.7 6.4 1.8 6.4-1.8.8-8.9H8.5l-.2-2.2h8.3l-.2-2.3z" />
        </svg>
      )
    },
    {
      name: 'JavaScript',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#F7DF1E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0zm20 18.2c0-1.4-.8-2.3-2.5-3-1-.4-1.7-.6-1.7-1.1 0-.4.3-.7.9-.7.6 0 1 .3 1.2.9h2c-.2-1.7-1.4-2.7-3.1-2.7-2 0-3.3 1.1-3.3 2.7 0 1.5 1 2.2 2.6 2.8 1.2.4 1.6.7 1.6 1.2 0 .5-.5.8-1.2.8-1 0-1.5-.5-1.7-1.4h-2.1c.2 2.2 1.7 3.2 3.8 3.2 2.2 0 3.3-1.1 3.3-2.9zm-9.3-5.5H8.8v7.2H6.9v-7.2H5.1V11h5.6v1.7z" />
        </svg>
      )
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#3178C6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0zm20.1 17.5c-.2-1.7-1.3-2.5-3.1-2.5-1.8 0-2.9.9-2.9 2.4 0 1.4.9 2 2.4 2.5 1.4.4 2 .7 2 1.2 0 .5-.5.8-1.2.8-.9 0-1.5-.4-1.7-1.3h-2.1c.2 2.1 1.7 3.1 3.8 3.1 2.3 0 3.4-1.1 3.4-2.8 0-1.7-1.1-2.4-2.8-3-1.3-.4-1.8-.7-1.8-1.2 0-.4.4-.7 1-.7s1.3.3 1.5 1h2zm-8.3-6.5h-5.2v8.9H4.7V11h7.1v1.6z" />
        </svg>
      )
    },
    {
      name: 'React',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 10.6c0-1.1-.8-2-2.1-2.6-1.5-.7-3.6-1.2-6-1.4 0-.1 0-.3-.1-.4C16.8 4 17.2 2 16.7.9c-.3-.7-1-1-1.8-1-.7 0-1.4.3-2 1C11.5 2.5 10.6 4.7 10 7.2c-2.4.2-4.5.7-6 1.4-1.3.6-2.1 1.5-2.1 2.6 0 1.1.8 2 2.1 2.6 1.5.7 3.6 1.2 6 1.4.1.9.4 1.8.8 2.6.9 2 2.2 3.6 3.4 4.5.5.4 1 .6 1.5.6.8 0 1.5-.3 1.8-1 .5-1.1.1-3.1-.9-5.3-.1-.2-.2-.4-.3-.6 2.4-.2 4.5-.7 6-1.4 1.3-.6 2.1-1.5 2.1-2.6zm-12 3.9c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
        </svg>
      )
    },
    {
      name: 'Next.js',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#000000]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.7 18l-5.6-7.3v7.3H10v-10h1.8l5.2 6.8V8h2.1v10h-1.4z" />
        </svg>
      )
    },
    {
      name: 'Tailwind CSS',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6h-6zm-6 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6H6zm0 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6H6zm-6 6a6 6 0 0 1 12-6c0 3.3-2.7 6-6 6H0z" />
        </svg>
      )
    },
    {
      name: 'Bootstrap',
      category: 'Frontend',
      icon: (
        <svg className="h-6 w-6 text-[#7952B3]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.2 15c0 1.2-.5 2-1.3 2.5-.8.5-1.9.7-3.4.7H8.3V5.8h3.2c1.4 0 2.4.2 3.1.7.7.5 1 1.2 1 2.2 0 .8-.3 1.5-.9 1.9.9.3 1.5 1.1 1.5 2.4zm-5.7-6.9v2.2h1.1c.5 0 .8-.1 1.1-.3.3-.2.4-.5.4-.9 0-.4-.1-.7-.4-.9-.2-.1-.5-.2-1.1-.2h-1.1zm0 4.1V15h1.3c.5 0 .9-.1 1.2-.3.3-.2.5-.6.5-1.1 0-.5-.2-.9-.5-1.1-.3-.2-.7-.3-1.2-.3h-1.3z" />
        </svg>
      )
    },
    {
      name: 'Node.js',
      category: 'Backend',
      icon: (
        <svg className="h-6 w-6 text-[#339933]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L2.3 5.6v11.2L12 22.4l9.7-5.6V5.6L12 0zm4.5 15.2c-.3.5-.7.9-1.2 1.2-.5.3-1.1.4-1.8.4-1 0-1.7-.3-2.2-1-.3-.4-.5-.9-.5-1.6v-3.5h2v3.4c0 .4.1.7.3.9.2.2.5.3.9.3.4 0 .7-.1.9-.3.2-.2.3-.5.3-.9v-3.4h2v6.5zm-5-6.5v2h-2v-2h2zm0 3.5v3h-2v-3h2z" />
        </svg>
      )
    },
    {
      name: 'Express.js',
      category: 'Backend',
      icon: (
        <svg className="h-6 w-6 text-[#000000]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm3.8 15.6l-1.3.9c-.3.2-.6.3-.9.3-.5 0-.9-.3-1.1-.8l-2-4.5-2 4.5c-.2.5-.6.8-1.1.8-.3 0-.6-.1-.9-.3l-1.3-.9 3.5-7.7h1.6l3.5 7.7z" />
        </svg>
      )
    },
    {
      name: 'Python',
      category: 'Backend',
      icon: (
        <svg className="h-6 w-6 text-[#3776AB]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm-1.8 3.6c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2zm6.6 14.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z" />
        </svg>
      )
    },
    {
      name: 'Java',
      category: 'Backend',
      icon: (
        <svg className="h-6 w-6 text-[#007396]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm3.2 15c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'MongoDB',
      category: 'Database',
      icon: (
        <svg className="h-6 w-6 text-[#47A248]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm2.2 14c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'MySQL',
      category: 'Database',
      icon: (
        <svg className="h-6 w-6 text-[#4479A1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm2.2 14c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      icon: (
        <svg className="h-6 w-6 text-[#4169E1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm2.2 14c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'Firebase',
      category: 'Database',
      icon: (
        <svg className="h-6 w-6 text-[#FFCA28]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm2.2 14c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    }
  ];

  const row2Techs: TechItem[] = [
    {
      name: 'Docker',
      category: 'Cloud & DevOps',
      icon: (
        <svg className="h-6 w-6 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.9 10.6h2.2v2.2h-2.2v-2.2zm-2.8 0h2.2v2.2h-2.2v-2.2zm-2.8 0h2.2v2.2H8.3v-2.2zm-2.8 0h2.2v2.2H5.5v-2.2zm8.4-2.8h2.2v2.2h-2.2V7.8zm-2.8 0h2.2v2.2h-2.2V7.8zm-2.8 0h2.2v2.2H8.3V7.8zm5.6-2.8h2.2v2.2h-2.2V5zm-8.4 8.4h2.2v2.2H5.5v-2.2zM24 12.3c-.3 0-.6-.1-.9-.1h-.4c-.1.5-.3.9-.6 1.3-.3.4-.6.7-1.1.9l-.6.3v.5c0 1.2-.4 2.2-1.2 3.1-.8.8-1.8 1.2-3.1 1.2-1.2 0-2.3-.4-3.1-1.2-.8-.9-1.2-1.9-1.2-3.1V5h2.2v10.3c0 .6.2 1.1.6 1.5.4.4.9.6 1.5.6s1.1-.2 1.5-.6c.4-.4.6-.9.6-1.5v-.8c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6h.5c.3 0 .6-.1.9-.1V12.3z" />
        </svg>
      )
    },
    {
      name: 'Kubernetes',
      category: 'Cloud & DevOps',
      icon: (
        <svg className="h-6 w-6 text-[#326CE5]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L1.7 5.9v12.2L12 24l10.3-5.9V5.9L12 0zm5.6 15.6L12 18.8l-5.6-3.2V9.6L12 6.4l5.6 3.2v6z" />
        </svg>
      )
    },
    {
      name: 'AWS',
      category: 'Cloud & DevOps',
      icon: (
        <svg className="h-6 w-6 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm3.2 15c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'Azure',
      category: 'Cloud & DevOps',
      icon: (
        <svg className="h-6 w-6 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.4l8.6 11.2L17.2 3.4H0zm24 17.2L15.4 6 6.8 20.6H24z" />
        </svg>
      )
    },
    {
      name: 'Git',
      category: 'Cloud & DevOps',
      icon: (
        <svg className="h-6 w-6 text-[#F05032]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.3 10.9L13.1.7C12.7.3 12 .3 11.6.7L8.7 3.6l3.4 3.4c.8-.3 1.7-.1 2.3.5.6.6.8 1.5.5 2.3l3.4 3.4c.8-.3 1.7-.1 2.3.5.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.6-.6-.8-1.5-.5-2.3L13.8 11c.3-.8.1-1.7-.5-2.3-.6-.6-1.5-.8-2.3-.5L7.6 4.8 1 11.4c-.4.4-.4 1.1 0 1.5l10.2 10.2c.4.4 1.1.4 1.5 0l10.6-10.6c.4-.4.4-1.2 0-1.6z" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      category: 'Cloud & DevOps',
      icon: (
        <svg className="h-6 w-6 text-[#181717]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    },
    {
      name: 'Flutter',
      category: 'Mobile',
      icon: (
        <svg className="h-6 w-6 text-[#02569B]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.314 0L2.3 12l3.6 3.6 12.014-12.014h-3.6zM2.3 12l3.6 3.6 6.007-6.007-3.6-3.6L2.3 12zm15.614 3.6H14.3l-6.007 6.007L11.9 24.014l6.014-6.014z" />
        </svg>
      )
    },
    {
      name: 'React Native',
      category: 'Mobile',
      icon: (
        <svg className="h-6 w-6 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 10.6c0-1.1-.8-2-2.1-2.6-1.5-.7-3.6-1.2-6-1.4 0-.1 0-.3-.1-.4C16.8 4 17.2 2 16.7.9c-.3-.7-1-1-1.8-1-.7 0-1.4.3-2 1C11.5 2.5 10.6 4.7 10 7.2c-2.4.2-4.5.7-6 1.4-1.3.6-2.1 1.5-2.1 2.6 0 1.1.8 2 2.1 2.6 1.5.7 3.6 1.2 6 1.4.1.9.4 1.8.8 2.6.9 2 2.2 3.6 3.4 4.5.5.4 1 .6 1.5.6.8 0 1.5-.3 1.8-1 .5-1.1.1-3.1-.9-5.3-.1-.2-.2-.4-.3-.6 2.4-.2 4.5-.7 6-1.4 1.3-.6 2.1-1.5 2.1-2.6zm-12 3.9c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
        </svg>
      )
    },
    {
      name: 'Android',
      category: 'Mobile',
      icon: (
        <svg className="h-6 w-6 text-[#3DDC84]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm3.2 15c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'Swift',
      category: 'Mobile',
      icon: (
        <svg className="h-6 w-6 text-[#F05138]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm3.2 15c0 1.2-.8 2.2-2 2.2s-2-1-2-2.2.8-2.2 2-2.2 2 1 2 2.2z" />
        </svg>
      )
    },
    {
      name: 'OpenAI',
      category: 'AI',
      icon: (
        <svg className="h-6 w-6 text-[#412991]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.28 10.7a5.7 5.7 0 00-.77-4.13A5.77 5.77 0 0017.58 4a5.7 5.7 0 00-4.88 2.76A5.7 5.7 0 008.28 4a5.77 5.77 0 00-3.93 2.57A5.7 5.7 0 003.58 10.7a5.7 5.7 0 00.77 4.13A5.77 5.77 0 008.28 20a5.7 5.7 0 004.88-2.76A5.7 5.7 0 0017.58 20a5.77 5.77 0 003.93-2.57A5.7 5.7 0 0022.28 10.7zm-9-4.8a3.7 3.7 0 013.2 1.8A3.7 3.7 0 0113.2 13a3.7 3.7 0 01-3.2-1.8 3.7 3.7 0 013.2-5.3z" />
        </svg>
      )
    },
    {
      name: 'ChatGPT',
      category: 'AI',
      icon: (
        <svg className="h-6 w-6 text-[#10A37F]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.28 10.7a5.7 5.7 0 00-.77-4.13A5.77 5.77 0 0017.58 4a5.7 5.7 0 00-4.88 2.76A5.7 5.7 0 008.28 4a5.77 5.77 0 00-3.93 2.57A5.7 5.7 0 003.58 10.7a5.7 5.7 0 00.77 4.13A5.77 5.77 0 008.28 20a5.7 5.7 0 004.88-2.76A5.7 5.7 0 0017.58 20a5.77 5.77 0 003.93-2.57A5.7 5.7 0 0022.28 10.7z" />
        </svg>
      )
    },
    {
      name: 'Claude',
      category: 'AI',
      icon: (
        <svg className="h-6 w-6 text-[#CC9966]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    },
    {
      name: 'TensorFlow',
      category: 'AI',
      icon: (
        <svg className="h-6 w-6 text-[#FF6F00]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L1.7 5.9v12.2L12 24l10.3-5.9V5.9L12 0zm0 4.1l6.9 4v7.8L12 19.9l-6.9-4V8.1l6.9-4z" />
        </svg>
      )
    },
    {
      name: 'LangChain',
      category: 'AI',
      icon: (
        <svg className="h-6 w-6 text-[#121212]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      )
    },
    {
      name: 'Pinecone',
      category: 'AI',
      icon: (
        <svg className="h-6 w-6 text-[#1C1917]" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      )
    },
    {
      name: 'Shopify',
      category: 'CMS',
      icon: (
        <svg className="h-6 w-6 text-[#7AB55C]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 6.5L12 2 4.5 6.5 3 17.5l9 4.5 9-4.5-1.5-11zM12 4.8l5.3 3.2-5.3 3.2-5.3-3.2L12 4.8z" />
        </svg>
      )
    },
    {
      name: 'WordPress',
      category: 'CMS',
      icon: (
        <svg className="h-6 w-6 text-[#21759B]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 1.2c2.4 0 4.6.8 6.4 2.2l-4.4 12.1-3.2-9.6c1.1-.3 1.2-.7 1.2-.7H8.3s.1.4 1.2.7l-3.2 9.6L1.9 6.2c1-.3 1.2-.7 1.2-.7H0C.8 3.4 3.4.8 6.2 1.2z" />
        </svg>
      )
    }
  ];

  // Helper arrays for duplicate infinite scrolling
  const fullRow1 = [...row1Techs, ...row1Techs, ...row1Techs];
  const fullRow2 = [...row2Techs, ...row2Techs, ...row2Techs];

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-sky-50/45 via-white to-emerald-50/25 py-24 md:py-28 border-y border-slate-100">
      
      {/* Background Connecting network lines (constellation SVG) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="network-grid" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#059669" />
              <circle cx="70" cy="50" r="1.5" fill="#0284c7" />
              <circle cx="110" cy="90" r="1.5" fill="#059669" />
              <line x1="10" y1="10" x2="70" y2="50" stroke="#000" strokeWidth="0.5" />
              <line x1="70" y1="50" x2="110" y2="90" stroke="#000" strokeWidth="0.5" />
              <line x1="110" y1="90" x2="10" y2="10" stroke="#000" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>
      </div>

      {/* Floating Particles Background */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 select-none" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-emerald-500/10 rounded-full blur-[1px] border border-emerald-500/5"
              style={{
                width: `${10 + (i % 4) * 8}px`,
                height: `${10 + (i % 4) * 8}px`,
                left: `${(i * 9) + 4}%`,
                top: `${(i * 7) + 8}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 12 + (i % 3) * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Header Container */}
      <div className="container mx-auto px-4 max-w-[1400px] relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-xs font-semibold uppercase tracking-wider mx-auto">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Technology Stack
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Trusted Technologies We Build With
          </h2>
          
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            We build scalable digital products using modern technologies trusted by startups and enterprises worldwide.
          </p>
        </motion.div>
      </div>

      {/* Custom Styles for Infinite Marquees */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-ltr {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .tech-track-ltr {
          display: flex;
          width: max-content;
          animation: marquee-ltr 50s linear infinite;
        }
        .tech-track-rtl {
          display: flex;
          width: max-content;
          animation: marquee-rtl 50s linear infinite;
        }
        .tech-scroller:hover .tech-track-ltr,
        .tech-scroller:hover .tech-track-rtl {
          animation-play-state: paused;
        }
      `}} />

      {/* Marquee Scrollers Area */}
      <div className="space-y-6 relative z-10 max-w-full overflow-hidden select-none">
        
        {/* Row 1: Left to Right scrolling effect */}
        <div className="tech-scroller flex w-full overflow-hidden py-2">
          <div className="tech-track-ltr gap-4">
            {fullRow1.map((tech, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-emerald-500/30 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-[350ms] ease-out group cursor-pointer"
              >
                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/80 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-slate-100/50">
                  {tech.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">{tech.name}</h4>
                  <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{tech.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left scrolling effect */}
        <div className="tech-scroller flex w-full overflow-hidden py-2">
          <div className="tech-track-rtl gap-4">
            {fullRow2.map((tech, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-emerald-500/30 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-[350ms] ease-out group cursor-pointer"
              >
                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/80 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-slate-100/50">
                  {tech.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">{tech.name}</h4>
                  <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{tech.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
