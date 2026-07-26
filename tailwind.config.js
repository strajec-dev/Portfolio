/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:        "#013582",
        gold:        "#F4CF31",
        snow:        "#FCFCFC",
        ink:         "#0D1117",
        'navy-light': "#0B4DB5",
        'navy-dark':  "#011F4F",
        'navy-90':    "#051F52",
        'gold-light': "#F8E571",
        'gold-dark':  "#C9A800",
        'off-white':  "#F7F7F5",
        'mid-grey':   "#6B7280",
        'border-line':"#E5E7EB",
      },
      fontFamily: {
        display: ["'Outfit'", "'Inter'", "sans-serif"],
        sans:    ["'Inter'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        'hero':  ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display': ['clamp(2rem, 4vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      spacing: {
        'section': '7rem',
        'section-lg': '10rem',
      },
      maxWidth: {
        'prose-wide': '72ch',
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10)',
        'gold-ring': '0 0 0 3px rgba(244,207,49,0.4)',
        'subtle':    '0 2px 8px rgba(1,53,130,0.06)',
        'inset':     'inset 0 1px 0 0 rgba(255,255,255,0.8)',
      },
      animation: {
        'fade-up':   'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fade-in 0.4s ease forwards',
        'ticker':    'ticker 36s linear infinite',
        'float':     'float 7s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-ring':'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'marquee':   'ticker 36s linear infinite',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: 0, transform: 'translateY(28px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244,207,49,0)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(244,207,49,0.2)' },
        },
      },
    },
  },
  plugins: [],
}
