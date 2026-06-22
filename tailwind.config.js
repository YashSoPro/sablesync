/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        'sable-bg':        '#0e0e12',
        'sable-surface':   '#16161e',
        'sable-panel':     '#1e1e2a',
        'sable-hover':     '#2a2a3a',
        'sable-border':    '#2e2e40',

        // Accent colors
        'sable-purple':    '#9b6dff',
        'sable-pink':      '#ff6eb4',
        'sable-blue':      '#4dabf7',
        'sable-green':     '#69db7c',
        'sable-red':       '#ff6b6b',
        'sable-yellow':    '#ffd43b',

        // Text
        'sable-text':      '#e8e8f0',
        'sable-muted':     '#8888aa',
        'sable-faint':     '#44445a',

        // Live / status
        'sable-live':      '#ff4757',
        'sable-online':    '#69db7c',
        'sable-offline':   '#44445a',
        'sable-idle':      '#ffd43b',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        'sable': '12px',
        'sable-lg': '20px',
        'sable-xl': '28px',
      },

      boxShadow: {
        'sable':    '0 4px 24px rgba(0,0,0,0.4)',
        'sable-lg': '0 8px 40px rgba(0,0,0,0.6)',
        'glow-purple': '0 0 20px rgba(155,109,255,0.3)',
        'glow-pink':   '0 0 20px rgba(255,110,180,0.3)',
      },

      backgroundImage: {
        'gradient-sable':  'linear-gradient(135deg, #9b6dff 0%, #ff6eb4 100%)',
        'gradient-dark':   'linear-gradient(135deg, #0e0e12 0%, #1e1e2a 100%)',
        'gradient-card':   'linear-gradient(145deg, #1e1e2a 0%, #16161e 100%)',
      },

      animation: {
        'fade-in':    'fadeIn 0.2s ease-in-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-live': 'pulseLive 2s infinite',
        'float':      'float 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        pulseLive: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },

      backdropBlur: {
        'sable': '12px',
      },
    },
  },
  plugins: [],
}
