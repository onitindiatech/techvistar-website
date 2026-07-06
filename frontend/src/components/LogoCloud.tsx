import { motion } from "framer-motion";

const logos = [
  {
    name: "Microsoft",
    svg: (
      <svg viewBox="0 0 23 23" className="h-5 w-auto fill-current">
        <path d="M0 0h11v11H0z" fill="#f25022" />
        <path d="M12 0h11v11H12z" fill="#7fba00" />
        <path d="M0 12h11v11H0z" fill="#00a4ef" />
        <path d="M12 12h11v11H12z" fill="#ffb900" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#f25022]"
  },
  {
    name: "Google",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#4285F4]"
  },
  {
    name: "AWS",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.58 14.62c-.93 0-1.63-.33-2.08-.98-.44-.65-.67-1.57-.67-2.77s.22-2.12.67-2.76c.45-.64 1.15-.97 2.08-.97.94 0 1.64.33 2.09.98.44.65.67 1.57.67 2.76s-.23 2.12-.67 2.77c-.45.65-1.15.97-2.09.97zm8.56.09h-1.66v-3.76c0-.98-.3-1.47-.9-1.47-.64 0-1.02.43-1.15 1.3v3.93h-1.66v-6.28h1.66v.85c.38-.63.92-.95 1.62-.95 1.39 0 2.09.84 2.09 2.53v3.85z" fill="#FF9900" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#FF9900]"
  },
  {
    name: "Netflix",
    svg: (
      <svg viewBox="0 0 100 100" className="h-6 w-auto fill-current">
        <path d="M30 15h12v70H30z" fill="#E50914" />
        <path d="M58 15h12v70H58z" fill="#E50914" />
        <path d="M30 15l40 70V15H58L30 85z" fill="#B00710" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#E50914]"
  },
  {
    name: "Intel",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M22 2H2v20h20V2zM7.2 16.5c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4zm9.6-1.4c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4.6-1.4 1.4-1.4 1.4.6 1.4 1.4z" fill="#0071C5" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#0071C5]"
  },
  {
    name: "Adobe",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M13.9 2h9.1v20h-9.1zM10.1 2H1v20h9.1zM12 8.7L17.2 21h-2.9l-1.9-4.7H8.7L12 8.7z" fill="#FF0000" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#FF0000]"
  },
  {
    name: "IBM",
    svg: (
      <svg viewBox="0 0 24 24" className="h-4 w-auto fill-current">
        <path d="M0 2h24v2H0zm0 3.5h24v2H0zm0 3.5h24v2H0zm0 3.5h24v2H0zm0 3.5h24v2H0zm0 3.5h24v2H0zm0 3.5h24v2H0z" fill="#052FAD" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#052FAD]"
  },
  {
    name: "NVIDIA",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.12 14.28c-1.39 0-2.52-1.13-2.52-2.52 0-1.39 1.13-2.52 2.52-2.52s2.52 1.13 2.52 2.52c0 1.39-1.13 2.52-2.52 2.52z" fill="#76B900" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#76B900]"
  },
  {
    name: "Oracle",
    svg: (
      <svg viewBox="0 0 24 24" className="h-4 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="#F80000" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#F80000]"
  },
  {
    name: "Cisco",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M3 14h2v4H3zm4-4h2v8H7zm4-4h2v12h-2zm4 4h2v8h-2zm4 4h2v4h-2z" fill="#1BA0D7" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#1BA0D7]"
  },
  {
    name: "Salesforce",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#00A1E0" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#00A1E0]"
  },
  {
    name: "SAP",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#008FD3" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#008FD3]"
  },
  {
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#24292e]"
  },
  {
    name: "Docker",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M13.983 8.878h-2.73v2.73h2.73zm-3.137 0h-2.73v2.73h2.73zm-3.137 0H3.98v2.73h2.73zm-3.137 0H1.114v2.73H3.84zm0-3.136H1.114v2.73H3.84zm6.273 3.136h-2.73v2.73h2.73zm-3.137-3.136h-2.73v2.73h2.73zm3.137 0h-2.73v2.73h2.73zm3.136 0h-2.73v2.73h2.73z" fill="#2496ED" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#2496ED]"
  },
  {
    name: "Kubernetes",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 .297l10.37 6v12L12 24.297l-10.37-6v-12zM12 4.1l7.8 4.5v9l-7.8 4.5-7.8-4.5v-9z" fill="#326CE5" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#326CE5]"
  },
  {
    name: "MongoDB",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 1.5C9.5 5 8 9 8 12.5c0 4 2 7.5 4 10 2-2.5 4-6 4-10 0-3.5-1.5-7.5-4-11zm0 3c1.5 3 2.5 6 2.5 8 0 3-1 6-2.5 8-1.5-2-2.5-5-2.5-8 0-2 1-5 2.5-8z" fill="#47A248" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#47A248]"
  },
  {
    name: "Vercel",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
    ),
    hoverColor: "group-hover:text-black"
  },
  {
    name: "OpenAI",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-5-3.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm6-4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#10a37f]"
  }
];

export const LogoCloud = () => {
  // Duplicate list to make infinite scrolling marquee transition seamless
  const extendedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full py-10 bg-transparent overflow-hidden relative select-none">
      {/* Title */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-[0.2em]">
          Trusted by innovative companies worldwide
        </p>
      </div>

      {/* Left/Right Edge Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 via-slate-50/70 to-transparent z-10 pointer-events-none" />

      {/* Marquee Wrapper */}
      <div className="relative flex w-full overflow-x-hidden">
        {/* Style block for css marquee logic to keep layout decoupled */}
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.33%); }
          }
          .marquee-container:hover .marquee-track {
            animation-play-state: paused;
          }
        `}</style>

        <div className="marquee-container flex w-full">
          <div 
            className="marquee-track flex gap-12 sm:gap-16 shrink-0 py-2"
            style={{
              animation: "marquee-scroll 35s linear infinite",
            }}
          >
            {extendedLogos.map((logo, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-center text-slate-400/80 transition-all duration-300 hover:scale-108 hover:shadow-[0_8px_30px_rgb(16,185,129,0.03)] cursor-pointer"
                title={logo.name}
              >
                <div className={`transition-colors duration-300 ${logo.hoverColor}`}>
                  {logo.svg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
