import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* STRICT 3-LEVEL SCREENSHOT TYPOGRAPHY SYSTEM */
        /* Level 1: Hero Main Titles ("Custom Software Development") */
        'display-2xl': ['clamp(2.25rem, 4vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-xl': ['clamp(2.25rem, 4vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['clamp(2rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.024em', fontWeight: '800' }],
        'heading-xl': ['clamp(2rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],

        /* Level 2: Section Headers & Major Subtitles ("Accelerate your digital footprint...") */
        'heading-lg': ['clamp(1.375rem, 2.5vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: '-0.022em', fontWeight: '800' }],
        'heading-md': ['clamp(1.25rem, 2vw, 1.625rem)', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' }],

        /* Level 3 & ALL OTHER TEXT ("When standard SaaS tools are not enough...") */
        'heading-sm': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.015em', fontWeight: '700' }],
        'heading-xs': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-lg': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '500' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '500' }],
        'label': ['1rem', { lineHeight: '1.6', letterSpacing: '0.12em', fontWeight: '700' }],
        'button': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '600' }],
        'nav': ['1rem', { lineHeight: '1.6', letterSpacing: '0.02em', fontWeight: '600' }],
        'mega': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '700' }],
        'mega-desc': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '500' }],
        'xs': ['1rem', { lineHeight: '1.6' }],
        'sm': ['1rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.3' }],
        '2xl': ['clamp(1.375rem, 2.5vw, 1.875rem)', { lineHeight: '1.25' }],
        '3xl': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(2.25rem, 4vw, 3.25rem)', { lineHeight: '1.15' }],
        '5xl': ['clamp(2.25rem, 4vw, 3.25rem)', { lineHeight: '1.15' }],
      },
      letterSpacing: {
        'tight-display': '-0.025em',
        'label': '0.22em',
        'widest-label': '0.25em',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        emerald: {
          50: "hsl(210 50% 96%)",
          100: "hsl(210 40% 92%)",
          200: "hsl(205 50% 84%)",
          300: "hsl(199 80% 70%)",
          400: "hsl(199 85% 55%)",
          500: "hsl(217 80% 32%)",
          600: "hsl(217 90% 20%)",
          700: "hsl(217 90% 16%)",
          800: "hsl(217 90% 12%)",
          900: "hsl(217 90% 8%)",
          950: "hsl(217 90% 5%)",
        },
        green: {
          50: "hsl(210 50% 96%)",
          100: "hsl(210 40% 92%)",
          200: "hsl(205 50% 84%)",
          300: "hsl(199 80% 70%)",
          400: "hsl(199 85% 55%)",
          500: "hsl(217 80% 32%)",
          600: "hsl(217 90% 20%)",
          700: "hsl(217 90% 16%)",
          800: "hsl(217 90% 12%)",
          900: "hsl(217 90% 8%)",
          950: "hsl(217 90% 5%)",
        },
        teal: {
          50: "hsl(199 80% 96%)",
          100: "hsl(199 50% 92%)",
          200: "hsl(199 50% 84%)",
          300: "hsl(199 80% 70%)",
          400: "hsl(199 85% 55%)",
          500: "hsl(199 85% 48%)",
          600: "hsl(199 85% 40%)",
          700: "hsl(217 90% 20%)",
          800: "hsl(217 90% 16%)",
          900: "hsl(217 90% 12%)",
          950: "hsl(217 90% 8%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          elevated: "hsl(var(--surface-elevated))",
          overlay: "hsl(var(--surface-overlay))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionDuration: {
        350: "350ms",
        1200: "1200ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        /** Hero background — continuous drift */
        "hero-blob-1": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, -8%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-5%, 6%, 0) scale(0.96)" },
        },
        "hero-blob-2": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "40%": { transform: "translate3d(-10%, 5%, 0) scale(1.1)" },
          "80%": { transform: "translate3d(8%, -6%, 0) scale(0.94)" },
        },
        "hero-blob-3": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" },
          "50%": { transform: "translate3d(4%, 10%, 0) rotate(8deg) scale(1.06)" },
        },
        "hero-grid-drift": {
          "0%": { backgroundPosition: "0px 0px, 0px 0px" },
          "100%": { backgroundPosition: "48px 48px, 48px 48px" },
        },
        "hero-starfield-drift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "384px 288px" },
        },
        "hero-shimmer": {
          "0%": { transform: "translate3d(-30%, 0, 0) rotate(12deg)", opacity: "0.15" },
          "50%": { opacity: "0.28" },
          "100%": { transform: "translate3d(30%, 0, 0) rotate(12deg)", opacity: "0.15" },
        },
        /** One soft circle that moves subtly and continuously */
        "hero-circle-orbit": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translate3d(12vw, 16vh, 0) scale(1)",
          },
          "25%": {
            transform: "translate(-50%, -50%) translate3d(16vw, 13vh, 0) scale(1.015)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translate3d(19vw, 17vh, 0) scale(0.99)",
          },
          "75%": {
            transform: "translate(-50%, -50%) translate3d(14vw, 20vh, 0) scale(1.01)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "hero-blob-1": "hero-blob-1 24s ease-in-out infinite",
        "hero-blob-2": "hero-blob-2 32s ease-in-out infinite",
        "hero-blob-3": "hero-blob-3 20s ease-in-out infinite",
        "hero-grid-drift": "hero-grid-drift 22s linear infinite",
        "hero-starfield-drift": "hero-starfield-drift 85s linear infinite",
        "hero-shimmer": "hero-shimmer 14s ease-in-out infinite",
        "hero-circle-orbit": "hero-circle-orbit 80s linear infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
        'gradient-dark': 'linear-gradient(180deg, hsl(var(--background)), hsl(var(--surface-overlay)))',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
