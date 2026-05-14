/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: '#FF4655',
          'red-dark': '#BD3944',
          'red-light': '#FF7782',
          black: '#0F1923',
          'black-light': '#1B2733',
          'black-deep': '#070E15',
          gray: '#768079',
          'gray-light': '#ECE8E1',
          gold: '#F5B400',
          cyan: '#5FE0E0',
        },
      },
      fontFamily: {
        display: ['"Tungsten"', '"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['"DIN Next"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 2.5s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'live-blink': 'live-blink 1.4s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        shimmer: {
          '0%': { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
        'live-blink': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        'border-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(255, 70, 85, 0.3)' },
          '50%': { 'box-shadow': '0 0 40px rgba(255, 70, 85, 0.6)' },
        },
      },
      backgroundImage: {
        'hex-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF4655' fill-opacity='0.04' d='M30 0l25.98 15v30L30 60 4.02 45V15z'/%3E%3C/svg%3E\")",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
