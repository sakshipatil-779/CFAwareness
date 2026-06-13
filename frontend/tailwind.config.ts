import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── LIGHT PREMIUM PALETTE ────────────────────────────────────────────
      colors: {
        // Primary eco-green (muted, premium)
        eco: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Sky-blue accent
        sky: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Warm teal accent
        teal: {
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        // Premium off-whites / neutrals for light theme
        pearl: {
          50:  '#fafcff',
          100: '#f4f8ff',
          200: '#eaf2ff',
          300: '#daeafd',
          400: '#c3d8f8',
          500: '#a0bde8',
        },
        // Card/glass surfaces
        glass: {
          white:   'rgba(255,255,255,0.75)',
          light:   'rgba(255,255,255,0.55)',
          medium:  'rgba(255,255,255,0.35)',
          border:  'rgba(34,197,94,0.20)',
          border2: 'rgba(255,255,255,0.60)',
          shadow:  'rgba(14,165,233,0.08)',
        },
        // Surface shades
        surface: {
          50:  '#f8fcff',
          100: '#eef6ff',
          200: '#dbeafe',
          900: '#030f07',   // kept for dark-mode ref
        },
      },

      // ── TYPOGRAPHY ───────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },

      // ── BACKGROUNDS ──────────────────────────────────────────────────────
      backgroundImage: {
        'light-gradient': 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)',
        'card-gradient':  'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(240,249,255,0.70) 100%)',
        'hero-gradient':  'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 40%, #f0fdfa 100%)',
        'glow-green':     'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)',
        'glow-blue':      'radial-gradient(ellipse, rgba(14,165,233,0.10) 0%, transparent 70%)',
      },

      // ── BOX SHADOWS ──────────────────────────────────────────────────────
      boxShadow: {
        'glass':    '0 4px 24px rgba(14,165,233,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'glass-lg': '0 8px 40px rgba(14,165,233,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'glass-xl': '0 16px 64px rgba(14,165,233,0.16), 0 4px 16px rgba(0,0,0,0.08)',
        'card':     '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'glow-sm':  '0 0 16px rgba(34,197,94,0.25)',
        'glow-md':  '0 0 28px rgba(34,197,94,0.35)',
        'glow-blue':'0 0 20px rgba(14,165,233,0.20)',
        'inset-sm': 'inset 0 1px 0 rgba(255,255,255,0.8)',
      },

      // ── ANIMATIONS ───────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,197,94,0.25)' },
          '50%':      { boxShadow: '0 0 40px rgba(34,197,94,0.45)' },
        },
        'bounce-eco': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'progress-fill': {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        'shimmer-light': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'typewriter': {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        // Scene-specific
        'drive-left': {
          '0%':   { left: '105%' },
          '100%': { left: '-20%' },
        },
        'drive-right': {
          '0%':   { left: '-20%' },
          '100%': { left: '105%' },
        },
        'smoke-rise': {
          '0%':   { opacity: '0.6', transform: 'translateY(0) scale(0.8)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(1.6)' },
        },
        'leaf-fall': {
          '0%':   { opacity: '0', transform: 'translateY(-20px) rotate(0deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(20deg)' },
        },
        'sun-shine': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%':      { transform: 'scale(1.08)', opacity: '1' },
        },
        'cloud-drift': {
          '0%':   { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(10px)' },
        },
        'bird-fly': {
          '0%':   { left: '-5%', top: '15%' },
          '100%': { left: '105%', top: '8%' },
        },
      },

      animation: {
        'fade-in':     'fade-in 0.4s ease-out both',
        'slide-up':    'slide-up 0.5s ease-out both',
        'slide-down':  'slide-down 0.4s ease-out both',
        'scale-in':    'scale-in 0.3s ease-out both',
        'float':       'float 3s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 2.5s ease-in-out infinite',
        'bounce-eco':  'bounce-eco 0.6s ease-in-out infinite',
        'spin-slow':   'spin-slow 8s linear infinite',
        'shimmer-light':'shimmer-light 2s linear infinite',
        'drive-left':  'drive-left 4s linear infinite',
        'drive-right': 'drive-right 5s linear infinite',
        'smoke-rise':  'smoke-rise 2s ease-out infinite',
        'leaf-fall':   'leaf-fall 1.2s ease-out forwards',
        'sun-shine':   'sun-shine 3s ease-in-out infinite',
        'cloud-drift': 'cloud-drift 4s ease-in-out infinite alternate',
        'bird-fly':    'bird-fly 6s linear infinite',
      },

      // ── BORDER RADIUS ────────────────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ── BACKDROP BLUR ────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--transition-base': '200ms ease',
          '--transition-slow': '400ms ease',
        },
      });
    }),
  ],
} satisfies Config;
