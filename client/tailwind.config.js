/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neo-HeadstarterAi Brand Colors
        neo: {
          blue: '#3b9eff',
          cyan: '#00d4ff',
          orange: '#ff8800',
          coral: '#ff6b6b',
          purple: '#8b5cf6',
          pink: '#ec4899',
        },
        // Dark theme palette
        dark: {
          900: '#0a0a1a',
          800: '#0d0d20',
          700: '#121228',
          600: '#1a1a3a',
          500: '#252550',
        },
        primary: "#3b9eff",
        secondary: "#ff8800",
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-fast': 'floatFast 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(59, 158, 255, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(59, 158, 255, 0.6)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'neo': '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 158, 255, 0.1)',
        'neo-lg': '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59, 158, 255, 0.15)',
        'neo-glow': '0 0 30px rgba(59, 158, 255, 0.4), 0 0 60px rgba(59, 158, 255, 0.2)',
        'neo-orange': '0 0 30px rgba(255, 136, 0, 0.4), 0 0 60px rgba(255, 136, 0, 0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'neo-gradient': 'linear-gradient(135deg, #3b9eff 0%, #00d4ff 100%)',
        'neo-gradient-orange': 'linear-gradient(135deg, #ff8800 0%, #ffaa00 100%)',
        'neo-mesh': 'radial-gradient(at 40% 20%, hsla(210, 100%, 56%, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(28, 100%, 50%, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(210, 100%, 56%, 0.1) 0px, transparent 50%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a1a 0%, #0d0d20 50%, #121228 100%)',
      },
    },
  },
  plugins: [],
};
