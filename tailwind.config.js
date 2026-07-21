/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  'var(--gold-50)',
          100: 'var(--gold-100)',
          200: 'var(--gold-200)',
          300: 'var(--gold-300)',
          400: 'var(--gold-400)',
          500: 'var(--gold-500)',
          600: 'var(--gold-600)',
          700: 'var(--gold-700)',
          800: 'var(--gold-800)',
          900: 'var(--gold-900)',
        },
        obsidian: {
          50:  'var(--obsidian-50)',
          100: 'var(--obsidian-100)',
          200: 'var(--obsidian-200)',
          300: 'var(--obsidian-300)',
          400: 'var(--obsidian-400)',
          500: 'var(--obsidian-500)',
          600: 'var(--obsidian-600)',
          700: 'var(--obsidian-700)',
          750: 'var(--obsidian-750)',
          800: 'var(--obsidian-800)',
          850: 'var(--obsidian-850)',
          900: 'var(--obsidian-900)',
          950: 'var(--obsidian-950)',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5DC87 50%, #B8860B 100%)',
        'gold-shine':    'linear-gradient(90deg, #B8860B 0%, #D4AF37 30%, #F5DC87 50%, #D4AF37 70%, #B8860B 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'shimmer':    'shimmer 2.5s infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      boxShadow: {
        'gold':    '0 0 20px rgba(212,175,55,0.3)',
        'gold-lg': '0 0 40px rgba(212,175,55,0.4)',
        'card':    '0 4px 32px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
