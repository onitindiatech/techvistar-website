import { motion, useReducedMotion } from 'framer-motion';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Quote, Star } from 'lucide-react';
import { useMemo } from 'react';
import { useAnimatedSection } from '@/hooks/useAnimatedSection';
import { SiteSection } from '@/components/SiteSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SECTION_TESTIMONIALS, TESTIMONIAL_AGGREGATE, TESTIMONIALS } from '@/data';
import { HoverCard } from '@/components/animations/HoverCard';
import { CountUp } from '@/components/animations/CountUp';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

export const TestimonialsSection = () => {
  const { ref, isInView } = useAnimatedSection();
  const reduceMotion = useReducedMotion();

  const autoScrollPlugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [
            AutoScroll({
              speed: 0.45,
              startDelay: 500,
              playOnInit: true,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              stopOnFocusIn: false,
            }),
          ],
    [reduceMotion]
  );

  return (
    <SiteSection ref={ref} id="testimonials" variant="slate" aria-labelledby="testimonials-heading">
      <div
        className="pointer-events-none absolute -right-[min(40%,320px)] top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[min(35%,280px)] top-[15%] h-[min(70vw,400px)] w-[min(70vw,400px)] rounded-full bg-emerald-500/[0.05] blur-[90px]"
        aria-hidden
      />

      <div className="container-custom relative z-10">
        <SectionHeader
          tag={SECTION_TESTIMONIALS.tag}
          title={SECTION_TESTIMONIALS.title}
          highlight={SECTION_TESTIMONIALS.highlight}
          description={SECTION_TESTIMONIALS.description}
          isInView={isInView}
          headingId="testimonials-heading"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="relative"
        >
          <p className="mb-6 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {reduceMotion ? SECTION_TESTIMONIALS.clientVoicesLabel : SECTION_TESTIMONIALS.clientVoicesAnimatedLabel}
          </p>

          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-10 bg-gradient-to-r from-slate-50 to-transparent sm:w-14 md:w-20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-10 bg-gradient-to-l from-slate-50 to-transparent sm:w-14 md:w-20"
              aria-hidden
            />

            <Carousel
              opts={{ align: 'start', loop: true, dragFree: false }}
              plugins={autoScrollPlugins}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {TESTIMONIALS.map((testimonial) => (
                  <CarouselItem
                    key={`${testimonial.name}-${testimonial.company}`}
                    className="pl-3 md:pl-4 basis-[88%] sm:basis-[75%] md:basis-1/2 lg:basis-[38%] xl:basis-[32%]"
                  >
                    <div
                      className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_45px_rgba(34,197,94,0.12)] hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] transition-all duration-300 hover:-translate-y-1"
                    >
                      <div
                        className="h-1 w-full shrink-0 bg-gradient-to-r from-primary via-emerald-500 to-teal-600"
                        aria-hidden
                      />

                      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                        <Quote
                          className="pointer-events-none absolute right-5 top-5 h-12 w-12 text-primary/[0.06] sm:h-14 sm:w-14 transition-transform duration-300 group-hover:scale-105"
                          strokeWidth={1}
                          aria-hidden
                        />

                        <div
                          className="relative z-[1] mb-4 inline-flex w-fit items-center gap-0.5 rounded-full border border-amber-200/90 bg-amber-50/95 px-2.5 py-1"
                          aria-label={`${testimonial.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < testimonial.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-200 text-slate-200'
                              }`}
                              aria-hidden
                            />
                          ))}
                        </div>

                        <blockquote className="relative z-[1] flex-1 text-[0.9375rem] font-medium leading-[1.65] text-slate-700 sm:text-[1.03rem]">
                          <span className="text-slate-300">&ldquo;</span>
                          {testimonial.content}
                          <span className="text-slate-300">&rdquo;</span>
                        </blockquote>

                        <div className="relative z-[1] mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
                          <div
                            className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-md ring-2 ring-white sm:h-12 sm:w-12"
                            aria-hidden
                          >
                            {testimonial.avatar ? (
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-emerald-600 text-xs font-bold tracking-tight text-white">
                                {initials(testimonial.name)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <div className="font-display text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                              {testimonial.name}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                              <span className="font-medium text-slate-600">{testimonial.role}</span>
                              {testimonial.company ? (
                                <>
                                  <span className="mx-1.5 text-slate-300" aria-hidden>
                                    ·
                                  </span>
                                  <span>{testimonial.company}</span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-2 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-primary lg:-left-4" />
                <CarouselNext className="-right-2 border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-primary lg:-right-4" />
              </div>
            </Carousel>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mx-auto mt-14 max-w-5xl rounded-2xl border border-slate-200/90 bg-white px-4 py-8 shadow-[0_8px_32px_-20px_rgba(15,23,42,0.1)] sm:px-8 md:py-10"
        >
          <p className="mb-6 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {SECTION_TESTIMONIALS.deliveryIndicatorsLabel}
          </p>
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-slate-100">
            {TESTIMONIAL_AGGREGATE.map((stat, idx) => {
              const percentage = idx === 0 ? 98 : idx === 1 ? 75 : 98;
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;

              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center px-4 py-8 text-center first:pt-0 last:pb-0 sm:py-6 sm:first:pt-6 sm:last:pb-6"
                >
                  <div className="relative flex items-center justify-center h-24 w-24 mb-4 select-none">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r={radius} className="stroke-slate-100 fill-none" strokeWidth="5" />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className="stroke-emerald-500 fill-none"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={isInView ? { strokeDashoffset } : {}}
                        transition={{ duration: 1.6, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                        style={{ strokeDasharray: circumference }}
                      />
                    </svg>
                    <span className="font-display text-xl sm:text-2xl font-black text-slate-900 z-10">
                      <CountUp value={stat.value} />
                    </span>
                  </div>
                  <div className="max-w-[14rem] text-xs font-bold leading-snug text-slate-600 sm:text-[0.85rem]">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
            {SECTION_TESTIMONIALS.footnote}
          </p>
        </motion.div>
      </div>
    </SiteSection>
  );
};
