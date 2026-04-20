import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  Clock,
  ExternalLink,
  Layers,
  Phone,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { INTERNSHIP_PROGRAM } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export const InternshipProgramSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const phaseCount = INTERNSHIP_PROGRAM.phases.length;

  return (
    <section
      ref={ref}
      id="internship"
      aria-labelledby="internship-heading"
      className="relative overflow-hidden border-b border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-16 md:py-24 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(hsl(var(--border)_/_0.9)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)_/_0.9)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[min(42%,360px)] top-[8%] h-[min(80vw,440px)] w-[min(80vw,440px)] rounded-full bg-primary/[0.06] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[min(38%,300px)] bottom-[5%] h-[min(65vw,380px)] w-[min(65vw,380px)] rounded-full bg-sky-500/[0.05] blur-[90px]"
        aria-hidden
      />

      <div className="container-custom relative z-10">
        {/* Program header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <div className="mb-5 flex flex-col items-center gap-3">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-primary">
              {INTERNSHIP_PROGRAM.eyebrow}
            </span>
            <span className="h-px w-12 rounded-full bg-primary/35" aria-hidden />
          </div>
          <Badge
            variant="secondary"
            className="mb-5 border border-slate-200 bg-white/90 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm"
          >
            Now enrolling — new batch
          </Badge>
          <h2
            id="internship-heading"
            className="font-display text-[1.75rem] font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[2.5rem]"
          >
            {INTERNSHIP_PROGRAM.title}{' '}
            <span className="gradient-text">{INTERNSHIP_PROGRAM.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 md:text-lg">
            {INTERNSHIP_PROGRAM.subtitle}
          </p>
        </motion.div>

        {/* Overview metrics */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.06, ease }}
          className="mx-auto mb-12 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200/95 bg-slate-200/80 shadow-sm md:grid-cols-4"
          role="list"
          aria-label="Program overview"
        >
          {INTERNSHIP_PROGRAM.summaryStats.map((stat) => (
            <div
              key={stat.label}
              role="listitem"
              className="bg-white px-4 py-5 text-center sm:px-5 sm:py-6"
            >
              <p className="font-display text-lg font-bold tabular-nums tracking-tight text-slate-900 sm:text-xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mx-auto mb-8 flex items-center justify-center gap-2 text-slate-500">
          <Layers className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-sm font-semibold tracking-tight text-slate-700">Curriculum structure</span>
          <Separator className="hidden max-w-[120px] flex-1 sm:block" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 lg:items-start">
          {/* Phases + timeline */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden />
                Three-phase syllabus
              </h3>
              <span className="hidden text-xs text-slate-400 sm:inline">Week-by-week progression</span>
            </div>

            <div className="relative space-y-6 pl-0 sm:pl-2">
              <div
                className="pointer-events-none absolute left-[1.125rem] top-10 hidden h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent sm:left-[1.625rem] sm:block"
                aria-hidden
              />

              {INTERNSHIP_PROGRAM.phases.map((phase, pi) => (
                <motion.article
                  key={phase.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.1 + pi * 0.07, ease }}
                  className="relative flex gap-4 sm:gap-6"
                >
                  <div className="relative z-[1] flex shrink-0 flex-col items-center pt-1">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border-2 border-white font-display text-sm font-bold shadow-md sm:h-10 sm:w-10',
                        pi === 0 && 'bg-sky-600 text-white ring-2 ring-sky-200',
                        pi === 1 && 'bg-primary text-primary-foreground ring-2 ring-primary/25',
                        pi === 2 && 'bg-emerald-700 text-white ring-2 ring-emerald-200'
                      )}
                      aria-hidden
                    >
                      {pi + 1}
                    </div>
                  </div>

                  <div
                    className={cn(
                      'min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200/95 bg-white shadow-[0_8px_36px_-18px_rgba(15,23,42,0.1)]',
                      'ring-1 ring-slate-950/[0.025]'
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                          {phase.monthLabel}
                        </p>
                        <h4 className="mt-1 font-display text-lg font-bold tracking-tight text-slate-900 md:text-xl">
                          {phase.title}
                        </h4>
                      </div>
                      <Badge variant="outline" className="shrink-0 border-slate-200 bg-white text-slate-700">
                        Phase {pi + 1} of {phaseCount}
                      </Badge>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Weekly focus
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        {phase.weeks.map((w) => (
                          <li
                            key={w.label}
                            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-3 transition-colors hover:border-slate-200 hover:bg-white sm:px-3.5"
                          >
                            <span className="mt-0.5 flex h-7 min-w-[3.25rem] items-center justify-center self-start rounded-md bg-white font-mono text-[9px] font-bold uppercase tracking-wide text-primary shadow-sm ring-1 ring-primary/10 sm:min-w-[3.5rem] sm:text-[10px]">
                              {w.label.replace('Week ', 'W')}
                            </span>
                            <span className="text-sm leading-snug text-slate-700">{w.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.12, ease }}
              className="rounded-2xl border border-slate-200/95 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
                Program highlights
              </h3>
              <ul className="space-y-3.5">
                {INTERNSHIP_PROGRAM.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3 stroke-[3]" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.18, ease }}
              className="rounded-2xl border border-slate-200/95 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <Users className="h-4 w-4 text-sky-600" aria-hidden />
                Who should apply
              </h3>
              <ul className="space-y-2.5">
                {INTERNSHIP_PROGRAM.audience.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug text-slate-700">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.24, ease }}
              className="rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 text-white shadow-lg"
            >
              <p className="flex items-start gap-2 text-sm font-semibold leading-snug text-white">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                {INTERNSHIP_PROGRAM.cta.urgent}
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button
                  variant="secondary"
                  className="w-full border-0 bg-white text-slate-900 hover:bg-slate-100"
                  asChild
                >
                  <a href={`tel:${INTERNSHIP_PROGRAM.cta.phoneTel}`} className="gap-2">
                    <Phone className="h-4 w-4" aria-hidden />
                    {INTERNSHIP_PROGRAM.cta.phoneDisplay}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/25 bg-transparent text-white hover:bg-white/10"
                  asChild
                >
                  <a
                    href={INTERNSHIP_PROGRAM.cta.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    techvistar.com
                  </a>
                </Button>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link to="/#register" className="gap-2">
                    Enquire & register
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-300">
                <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden />
                Internship certificate and portfolio-ready project guidance on successful completion.
              </p>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
};
