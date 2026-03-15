import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF6B00',
          light:   '#FF8C3A',
          dark:    '#CC5500',
        },
        turmeric: {
          DEFAULT: '#F5A623',
          light:   '#F7C06A',
          dark:    '#C47D0D',
        },
        marigold: {
          DEFAULT: '#FFD700',
          light:   '#FFE44D',
          dark:    '#CCAC00',
        },
        rose: {
          DEFAULT: '#C2185B',
          light:   '#E91E8C',
          dark:    '#880E4F',
        },
        ivory: {
          DEFAULT: '#FDF6E3',
          dark:    '#F5E6C8',
        },
        charcoal: {
          DEFAULT: '#1A1A2E',
          light:   '#2D2D4E',
          dark:    '#0D0D1A',
        },
        teal: {
          DEFAULT: '#00897B',
          light:   '#4DB6AC',
          dark:    '#00695C',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      boxShadow: {
        'glow-saffron': '0 0 30px rgba(255, 107, 0, 0.3)',
        'glow-gold':    '0 0 30px rgba(245, 166, 35, 0.3)',
      },
      backgroundImage: {
        'gradient-indian': 'linear-gradient(135deg, #FF6B00 0%, #C2185B 50%, #1A1A2E 100%)',
        'gradient-warm':   'linear-gradient(180deg, #FDF6E3 0%, #F5E6C8 100%)',
        'gradient-night':  'linear-gradient(180deg, #1A1A2E 0%, #0D0D1A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
