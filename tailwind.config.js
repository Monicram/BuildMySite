/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf8e7',
          100: '#faefc3',
          200: '#f5dc87',
          300: '#efc84b',
          400: '#e8b422',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8B6914',
          800: '#6b4f10',
          900: '#4a3710',
        },
        obsidian: {
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#c8c8c8',
          300: '#a3a3a3',
          400: '#737373',
          500: '#404040',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#111111',
          900: '#0A0A0A',
          950: '#050505',
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
