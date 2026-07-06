import { motion } from "framer-motion";

const logos = [
  {
    name: "OpenAI",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M21.743 12.316a3.89 3.89 0 0 0-.173-3.616l.169-.098a3.89 3.89 0 0 0 1.41-5.26 3.89 3.89 0 0 0-5.26-1.41l-.169.098a3.89 3.89 0 0 0-3.616-.173 3.89 3.89 0 0 0-5.26 1.41L8.85 3.28a3.89 3.89 0 0 0-3.616.173A3.89 3.89 0 0 0 3.824 8.71l-.169-.098a3.89 3.89 0 0 0-5.26 1.41 3.89 3.89 0 0 0 1.41 5.26l.169.098a3.89 3.89 0 0 0 3.616.173 3.89 3.89 0 0 0 5.26-1.41l.036-.021a3.89 3.89 0 0 0 3.616.173 3.89 3.89 0 0 0 5.26-1.41l.169.098a3.89 3.89 0 0 0 5.26-1.41 3.89 3.89 0 0 0-1.41-5.26zm-4.73 6.942l-5.013-2.894V10.57l5.013-2.894v5.789zm-1.077-8.487l-5.013 2.894-5.013-2.894 5.013-2.894 5.013 2.894zm-11.103 2.7l5.013 2.894v5.789l-5.013-2.894V13.47z" fill="#10A37F" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#10A37F]"
  },
  {
    name: "Microsoft",
    svg: (
      <svg viewBox="0 0 23 23" className="h-5 w-auto">
        <path d="M0 0h11v11H0z" fill="#F25022" />
        <path d="M12 0h11v11H12z" fill="#7FBA00" />
        <path d="M0 12h11v11H0z" fill="#00A4EF" />
        <path d="M12 12h11v11H12z" fill="#FFB900" />
      </svg>
    ),
    hoverColor: ""
  },
  {
    name: "Google Cloud",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#4285F4]"
  },
  {
    name: "AWS",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12.012 16.63c-3.153 0-5.71-2.557-5.71-5.71s2.557-5.71 5.71-5.71 5.71 2.557 5.71 5.71-2.557 5.71-5.71 5.71zm5.289-5.71c0-2.917-2.372-5.29-5.289-5.29s-5.29 2.372-5.29 5.29 2.372 5.29 5.29 5.29 5.289-2.372 5.289-5.29zm-6.666 7.42h2.754V21.1h-2.754z" fill="#FF9900" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#FF9900]"
  },
  {
    name: "Microsoft Azure",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M5.483 21.3h13.034l3.354-4.8H8.837l-3.354 4.8zm9.68-18.6L2.129 16.5h13.034l3.354-4.8H5.483l9.68-13.8z" fill="#0089D6" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#0089D6]"
  },
  {
    name: "MongoDB",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M17.15 11.23c-.35-3.52-2.18-7.85-4.47-11.23a.38.38 0 0 0-.68 0C9.7 3.38 7.87 7.71 7.52 11.23c-.87 1.58-1.52 3.32-1.52 5.22 0 4.14 2.8 7.55 6 7.55s6-3.41 6-7.55c0-1.9-.65-3.64-1.52-5.22zm-4.47 9.87v-7.35a.69.69 0 0 0-1.38 0v7.35c-1.88-.63-3-2.67-3-4.77 0-2.48 1.4-5.46 3-8.22 1.6 2.76 3 5.74 3 8.22 0 2.1-1.12 4.14-3 4.77z" fill="#47A248" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#47A248]"
  },
  {
    name: "Node.js",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5l-4.5-4.5 1.4-1.4 3.1 3.1 6.1-6.1 1.4 1.4-7.5 7.5z" fill="#339933" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#339933]"
  },
  {
    name: "React",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 14.8c1.55 0 2.8-1.25 2.8-2.8s-1.25-2.8-2.8-2.8-2.8 1.25-2.8 2.8 1.25 2.8 2.8 2.8z" fill="#61DAFB" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#61DAFB" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#61DAFB]"
  },
  {
    name: "TypeScript",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm16.71 11.233h2.38v8.665c0 .355-.062.67-.184.945a2.03 2.03 0 0 1-.527.734c-.227.202-.513.355-.858.46a3.84 3.84 0 0 1-1.118.158c-.604 0-1.118-.088-1.542-.263a2.91 2.91 0 0 1-1.076-.757c-.276-.328-.485-.75-.626-1.267l2.12-.865c.14.394.34.7.595.918.254.22.586.328.997.328.328 0 .584-.078.77-.235a.82.82 0 0 0 .28-.655v-8.467zm-7.666 2.378h2.38v6.287h-2.38v-6.287z" fill="#3178C6" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#3178C6]"
  },
  {
    name: "Docker",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M13.983 8.878h-2.73v2.73h2.73zm-3.137 0h-2.73v2.73h2.73zm-3.137 0H3.98v2.73h2.73zm-3.137 0H1.114v2.73H3.84zm0-3.136H1.114v2.73H3.84zm6.273 3.136h-2.73v2.73h2.73zm-3.137-3.136h-2.73v2.73h2.73zm3.137 0h-2.73v2.73h2.73zm3.136 0h-2.73v2.73h2.73z" fill="#2496ED" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#2496ED]"
  },
  {
    name: "Kubernetes",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 .297l10.37 6v12L12 24.297l-10.37-6v-12zM12 4.1l7.8 4.5v9l-7.8 4.5-7.8-4.5v-9z" fill="#326CE5" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#326CE5]"
  },
  {
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    hoverColor: "group-hover:text-black"
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
    name: "Cloudflare",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="#F38020" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#F38020]"
  },
  {
    name: "Redis",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#DC382D" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#DC382D]"
  },
  {
    name: "PostgreSQL",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#4169E1" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#4169E1]"
  },
  {
    name: "Express.js",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#000000" />
      </svg>
    ),
    hoverColor: "group-hover:text-black"
  },
  {
    name: "Tailwind CSS",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-auto fill-current">
        <path d="M12 6.036c-2.285 0-3.81 1.143-4.57 3.429 1.523-1.524 3.047-.762 4.57 2.286 1.524 3.047 3.048 2.285 4.572-.762-.762-2.286-2.286-4.953-4.572-4.953zM7.43 12.13c-2.286 0-3.81 1.142-4.57 3.428 1.523-1.524 3.047-.762 4.57 2.286 1.524 3.048 3.048 2.286 4.572-.762-.762-2.286-2.286-4.952-4.572-4.952z" fill="#06B6D4" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#06B6D4]"
  },
  {
    name: "Figma",
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#F24E1E" />
      </svg>
    ),
    hoverColor: "group-hover:text-[#F24E1E]"
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
                className="group flex items-center justify-center text-slate-450 transition-all duration-300 hover:scale-108 hover:shadow-[0_8px_30px_rgb(16,185,129,0.03)] cursor-pointer"
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
