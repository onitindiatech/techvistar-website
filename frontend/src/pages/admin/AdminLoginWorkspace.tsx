import { motion } from "framer-motion";

const CODE_LINES = [
  "$ npm run deploy --env production",
  "✓ Build completed in 42s",
  "✓ Health checks passed",
];

const TYPING_CHARS = "$ git push origin main";

export const AdminLoginWorkspace = () => {
  return (
    <svg
      viewBox="0 0 960 720"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4f6f5" />
          <stop offset="100%" stopColor="#e8ecea" />
        </linearGradient>
        <linearGradient id="windowSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="55%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="sunRay" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="deskTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4d8d6" />
          <stop offset="50%" stopColor="#e8ecea" />
          <stop offset="100%" stopColor="#cdd2d0" />
        </linearGradient>
        <linearGradient id="monitorScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#134e4a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
        <filter id="deskShadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#0f172a" floodOpacity="0.15" />
        </filter>
        <clipPath id="monitorClip">
          <rect x="498" y="198" width="248" height="148" rx="4" />
        </clipPath>
        <clipPath id="laptopClip">
          <rect x="358" y="318" width="148" height="92" rx="3" />
        </clipPath>
      </defs>

      {/* Room */}
      <rect width="960" height="720" fill="url(#wallGrad)" />
      <rect x="0" y="520" width="960" height="200" fill="#e2e6e4" />

      {/* Window frame */}
      <g filter="url(#softShadow)">
        <rect x="72" y="88" width="300" height="340" rx="6" fill="#ffffff" />
        <rect x="88" y="104" width="268" height="308" rx="4" fill="url(#windowSky)" />
        {/* Window mullions */}
        <rect x="220" y="104" width="4" height="308" fill="#ffffff" fillOpacity="0.7" />
        <rect x="88" y="254" width="268" height="4" fill="#ffffff" fillOpacity="0.7" />
        {/* City silhouette */}
        <path
          d="M100 360 L130 320 L155 340 L180 300 L210 330 L240 290 L270 320 L300 280 L340 350 L356 360 Z"
          fill="#94a3b8"
          fillOpacity="0.25"
        />
      </g>

      {/* Animated sunlight */}
      <motion.rect
        x="88"
        y="104"
        width="268"
        height="308"
        fill="url(#sunRay)"
        animate={{ opacity: [0.4, 0.65, 0.45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="180"
        cy="200"
        rx="120"
        ry="80"
        fill="#fef08a"
        fillOpacity="0.15"
        animate={{ opacity: [0.1, 0.22, 0.12], scaleX: [0.916, 1.041, 0.958] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floor ambient shadow */}
      <ellipse cx="520" cy="560" rx="340" ry="40" fill="#0f172a" fillOpacity="0.06" />

      {/* Ergonomic chair */}
      <g filter="url(#softShadow)">
        <ellipse cx="248" cy="498" rx="72" ry="14" fill="#cbd5e1" />
        <path d="M210 420 Q200 460 215 500 L280 500 Q295 460 285 420 Z" fill="#334155" />
        <path d="M215 420 L215 360 Q230 340 255 340 Q280 340 295 360 L295 420 Z" fill="#475569" />
        <rect x="240" y="500" width="24" height="48" rx="4" fill="#64748b" />
        <rect x="220" y="544" width="64" height="10" rx="5" fill="#475569" />
        {/* Armrest */}
        <rect x="200" y="400" width="100" height="12" rx="6" fill="#334155" />
      </g>

      {/* Person — subtle breathing */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Torso */}
        <path d="M230 310 Q255 295 280 310 L275 390 Q255 400 235 390 Z" fill="#1e293b" />
        {/* Head */}
        <circle cx="255" cy="288" r="22" fill="#fcd9b6" />
        <path d="M233 280 Q255 268 277 280 Q275 295 255 298 Q235 295 233 280" fill="#334155" />
        {/* Arms */}
        <path d="M235 330 Q210 350 220 370 L235 365 Q225 350 240 340 Z" fill="#1e293b" />
        <path d="M275 330 Q300 345 310 360 L295 368 Q285 352 270 342 Z" fill="#1e293b" />
        {/* Hands on keyboard area */}
        <ellipse cx="318" cy="372" rx="10" ry="6" fill="#fcd9b6" />
        <ellipse cx="348" cy="370" rx="10" ry="6" fill="#fcd9b6" />
      </motion.g>

      {/* Desk */}
      <g filter="url(#deskShadow)">
        <rect x="300" y="380" width="480" height="18" rx="3" fill="url(#deskTop)" />
        <rect x="318" y="398" width="14" height="148" rx="2" fill="#b8c0bc" />
        <rect x="748" y="398" width="14" height="148" rx="2" fill="#b8c0bc" />
      </g>

      {/* Desk lamp */}
      <g>
        <rect x="718" y="352" width="8" height="30" fill="#94a3b8" />
        <path d="M700 352 Q730 330 758 348 L752 358 Q728 344 706 360 Z" fill="#e2e8f0" />
        <motion.ellipse
          cx="720"
          cy="378"
          rx="60"
          ry="30"
          fill="#10b981"
          fillOpacity="0.08"
          animate={{ opacity: [0.06, 0.14, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Plant */}
      <g filter="url(#softShadow)">
        <path d="M738 378 Q748 340 758 378 Z" fill="#4ade80" />
        <path d="M728 378 Q738 345 748 378 Z" fill="#22c55e" />
        <path d="M748 378 Q758 348 768 378 Z" fill="#16a34a" />
        <rect x="742" y="378" width="22" height="4" fill="#a8a29e" />
        <path d="M736 382 Q750 392 764 382 L762 378 L738 378 Z" fill="#d6d3d1" />
      </g>

      {/* Coffee mug */}
      <g filter="url(#softShadow)">
        <rect x="668" y="356" width="28" height="24" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M696 362 Q708 362 708 372 Q708 378 696 378" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        <motion.path
          d="M676 352 Q680 340 684 352"
          stroke="#94a3b8"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Mechanical keyboard */}
      <rect x="302" y="368" width="130" height="14" rx="3" fill="#1e293b" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`key-${i}`} x={308 + i * 10} y="371" width="7" height="8" rx="1" fill="#334155" />
      ))}

      {/* External monitor */}
      <g filter="url(#softShadow)">
        <rect x="480" y="188" width="284" height="172" rx="10" fill="#1e293b" />
        <rect x="488" y="196" width="268" height="152" rx="4" fill="url(#monitorScreen)" />
        <rect x="598" y="360" width="48" height="24" rx="3" fill="#334155" />
        <rect x="570" y="380" width="104" height="6" rx="3" fill="#475569" />
      </g>

      {/* Monitor screen content */}
      <g clipPath="url(#monitorClip)">
        <motion.rect
          x="498"
          y="198"
          width="248"
          height="148"
          fill="url(#emeraldGlow)"
          animate={{ opacity: [0.15, 0.35, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Window chrome */}
        <circle cx="512" cy="210" r="3" fill="#ef4444" fillOpacity="0.8" />
        <circle cx="522" cy="210" r="3" fill="#eab308" fillOpacity="0.8" />
        <circle cx="532" cy="210" r="3" fill="#22c55e" fillOpacity="0.8" />
        <text x="508" y="232" fill="#64748b" fontSize="9" fontFamily="ui-monospace, monospace">
          Veenero CMS — Dashboard
        </text>
        {/* Chart bars */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.rect
            key={`bar-${i}`}
            x={508 + i * 22}
            y={280 - (i % 3) * 12 - 20}
            width="14"
            height={(i % 3) * 12 + 28}
            rx="2"
            fill="#10b981"
            fillOpacity="0.7"
            animate={{ opacity: [0.5, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        {/* Code panel */}
        {CODE_LINES.map((line, i) => (
          <motion.text
            key={line}
            x="620"
            y={248 + i * 16}
            fill={i === 0 ? "#94a3b8" : "#34d399"}
            fontSize="8"
            fontFamily="ui-monospace, monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 1.2 }}
          >
            {line}
          </motion.text>
        ))}
        {/* Blinking cursor */}
        <motion.rect
          x="720"
          y="290"
          width="2"
          height="10"
          fill="#10b981"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      </g>

      {/* Laptop */}
      <g filter="url(#softShadow)">
        <path d="M340 410 L360 318 L510 318 L530 410 Z" fill="#cbd5e1" />
        <rect x="350" y="308" width="160" height="12" rx="2" fill="#94a3b8" />
        <rect x="358" y="318" width="148" height="92" rx="3" fill="url(#laptopScreen)" />
        <path d="M330 410 L540 410 L550 422 L320 422 Z" fill="#e2e8f0" />
      </g>

      {/* Laptop screen */}
      <g clipPath="url(#laptopClip)">
        <motion.rect
          x="358"
          y="318"
          width="148"
          height="92"
          fill="#10b981"
          fillOpacity="0.06"
          animate={{ opacity: [0.04, 0.12, 0.06] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <text x="368" y="338" fill="#6ee7b7" fontSize="7" fontFamily="ui-monospace, monospace">
          terminal
        </text>
        <TypingLine />
        <motion.circle
          cx="490"
          cy="398"
          r="3"
          fill="#f8fafc"
          fillOpacity="0.8"
          animate={{ x: [0, 6, -2, 4, 0], y: [0, -2, 1, 0, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Mouse */}
      <motion.g
        animate={{ x: [0, 4, -2, 3, 0], y: [0, -1, 1, 0, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="548" cy="374" rx="10" ry="14" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="546" y="368" width="4" height="6" rx="2" fill="#94a3b8" fillOpacity="0.5" />
      </motion.g>

      {/* Ambient dust particles */}
      {[
        { cx: 420, cy: 180, r: 1.5, d: 0 },
        { cx: 600, cy: 140, r: 1, d: 1.5 },
        { cx: 780, cy: 220, r: 1.2, d: 0.8 },
        { cx: 350, cy: 260, r: 1, d: 2.2 },
        { cx: 680, cy: 160, r: 1.3, d: 1.1 },
      ].map((p, i) => (
        <motion.circle
          key={`dust-${i}`}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="#10b981"
          fillOpacity="0.25"
          animate={{ y: [0, -8, 0], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 6 + p.d, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}

      {/* Bottom vignette */}
      <rect x="0" y="520" width="960" height="200" fill="url(#wallGrad)" fillOpacity="0" />
      <defs>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8ecea" stopOpacity="0" />
          <stop offset="100%" stopColor="#e8ecea" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="0" y="600" width="960" height="120" fill="url(#bottomFade)" />
    </svg>
  );
};

const TypingLine = () => (
  <motion.text
    x="368"
    y="358"
    fill="#a7f3d0"
    fontSize="7"
    fontFamily="ui-monospace, monospace"
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  >
    {TYPING_CHARS}
    <motion.tspan fill="#10b981" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
      _
    </motion.tspan>
  </motion.text>
);
