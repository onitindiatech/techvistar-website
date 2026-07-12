import { useState } from 'react';
import {
  ENTERPRISE_MARQUEE_BRANDS,
  getEnterpriseLogoSvgUrl,
  type EnterpriseMarqueeBrand,
} from '@/data/enterpriseMarqueeLogos';
import { cn } from '@/lib/utils';

/** Uniform logo slot — fixed box keeps height, width, and spacing consistent. */
const LOGO_SLOT_CLASS = 'h-8 w-[7.5rem] sm:h-8 sm:w-32 md:h-9 md:w-36';

function EnterpriseLogo({ brand }: { brand: EnterpriseMarqueeBrand }) {
  const [failed, setFailed] = useState(false);
  const src = getEnterpriseLogoSvgUrl(brand);

  if (failed) {
    return null;
  }

  return (
    <div
      className={cn(
        LOGO_SLOT_CLASS,
        'enterprise-marquee-logo group/logo flex shrink-0 items-center justify-center',
        'cursor-pointer opacity-[0.65] transition-[opacity,transform] duration-300 ease-out',
        'hover:scale-[1.08] hover:opacity-100',
        'motion-reduce:transition-none motion-reduce:hover:scale-100',
      )}
      title={brand.name}
      role="img"
      aria-label={brand.name}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        width={144}
        height={36}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
}

function LogoRow({
  brands,
  rowKey,
  ariaHidden = false,
}: {
  brands: EnterpriseMarqueeBrand[];
  rowKey: string;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="enterprise-marquee-row flex shrink-0 items-center gap-10 sm:gap-12 md:gap-14 lg:gap-16"
      aria-hidden={ariaHidden || undefined}
    >
      {brands.map((brand) => (
        <EnterpriseLogo key={`${rowKey}-${brand.slug}`} brand={brand} />
      ))}
    </div>
  );
}

export const LogoCloud = () => {
  return (
    <div className="enterprise-marquee relative w-full select-none overflow-hidden bg-transparent py-10">
      <div className="mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-450">
          Trusted by innovative companies worldwide
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-slate-50 via-slate-50/70 to-transparent sm:w-24" />

      <div className="enterprise-marquee-scroller relative flex w-full overflow-hidden">
        <div className="enterprise-marquee-track flex w-max items-center gap-10 will-change-transform sm:gap-12 md:gap-14 lg:gap-16">
          <LogoRow brands={ENTERPRISE_MARQUEE_BRANDS} rowKey="primary" />
          <LogoRow brands={ENTERPRISE_MARQUEE_BRANDS} rowKey="primary-clone" ariaHidden />
        </div>
      </div>
    </div>
  );
};
