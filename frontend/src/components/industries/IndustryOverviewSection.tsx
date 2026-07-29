import { Industry } from '@/data/industries';

import { getIndustryHeroImage } from '@/data/industry.adapter';

import { Brain, Lightbulb } from 'lucide-react';

import { RichTextContent } from '@/components/common/RichTextContent';

import '../ui/GlassIcons.css';



interface IndustryOverviewSectionProps {

  industry: Industry;

}



export const IndustryOverviewSection = ({ industry }: IndustryOverviewSectionProps) => {

  const IconComponent = industry.icon || Brain;

  const insight = industry.overviewQuote?.trim();

  const overviewImage =

    industry.dashboardImage?.trim() ||

    industry.coverImage?.trim() ||

    getIndustryHeroImage(industry);



  return (

    <section

      id="overview"

      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8"

    >

      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]" aria-hidden="true">

        <svg width="100%" height="100%">

          <pattern id="industry-overview-mesh" width="20" height="20" patternUnits="userSpaceOnUse">

            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />

          </pattern>

          <rect width="100%" height="100%" fill="url(#industry-overview-mesh)" />

        </svg>

      </div>



      <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-12">

        <div className="space-y-5 md:col-span-7">

          <div className="flex items-center gap-4">

            <div className="icon-btn pointer-events-none -mb-4 -mr-4 origin-top-left scale-75">

              <span

                className="icon-btn__back"

                style={{ background: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))' }}

              />

              <span className="icon-btn__front">

                <span className="icon-btn__icon">

                  <IconComponent className="h-6 w-6 text-white" />

                </span>

              </span>

            </div>

            <h2 className="font-display text-heading-sm text-slate-900">Overview</h2>

          </div>



          <div className="h-1 w-12 rounded-full bg-emerald-500" />



          <RichTextContent
            content={industry.overview || industry.description}
            className="text-sm leading-relaxed text-slate-600 md:text-sm"
          />



          {insight && (

            <div className="flex items-start gap-4 rounded-2xl border border-emerald-100/50 bg-emerald-50/50 p-4 transition-all duration-300 hover:bg-emerald-50/80">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-500/10">

                <Lightbulb className="h-5 w-5 animate-pulse text-emerald-600" />

              </div>

              <div>

                <div className="mb-0.5 text-xs font-bold text-emerald-800">Sector Focus</div>

                <RichTextContent content={insight} className="text-xs font-medium leading-relaxed text-emerald-700/90" />

              </div>

            </div>

          )}

        </div>



        <div className="flex items-center justify-center md:col-span-5">

          <div className="group/image relative w-full">

            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 opacity-75 blur-xl transition duration-300 group-hover/image:opacity-100" />

            <div className="relative z-10 w-full transition-transform duration-300 group-hover/image:scale-[1.03]">

              <img

                src={overviewImage}

                alt={`${industry.title} overview`}

                className="h-auto max-h-[300px] w-full rounded-2xl object-contain drop-shadow-xl"

                style={{ animation: 'float3d 4s ease-in-out infinite' }}

              />

            </div>

          </div>

        </div>

      </div>

    </section>

  );

};



export default IndustryOverviewSection;

