/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Syne', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Core palette - warm coral/orange as primary, away from generic purple
        coral: {
          50: '#fff7f5',
          100: '#ffede8',
          200: '#ffd9cf',
          300: '#ffb8a6',
          400: '#ff8c70',
          500: '#ff6b47',
          600: '#f04a23',
          700: '#c93a18',
          800: '#a33118',
          900: '#862d1a',
        },
        // Teal accent for contrast
        electric: {
          50: '#edfffe',
          100: '#c0fffc',
          200: '#81fef9',
          300: '#3af8f3',
          400: '#0ce6e6',
          500: '#00c9cc',
          600: '#00a0a8',
          700: '#067f87',
          800: '#0b646c',
          900: '#0e525a',
        },
        // Dark base with warmth
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c1',
          400: '#91919f',
          500: '#747483',
          600: '#5d5d6b',
          700: '#4c4c57',
          800: '#2d2d35',
          900: '#1a1a1f',
          950: '#0f0f12',
        },
      },
      animation: {
        'flip': 'flip 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'stamp': 'stamp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop': 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        stamp: {
          '0%': { transform: 'scale(2) rotate(-12deg)', opacity: '0' },
          '50%': { transform: 'scale(0.9) rotate(-12deg)' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 107, 71, 0.4), 0 0 40px rgba(255, 107, 71, 0.2), inset 0 0 20px rgba(255, 107, 71, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 107, 71, 0.6), 0 0 60px rgba(255, 107, 71, 0.3), inset 0 0 30px rgba(255, 107, 71, 0.15)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.05'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
