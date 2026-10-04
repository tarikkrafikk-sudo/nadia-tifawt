/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', lg: '2rem' }, screens: { '2xl': '1320px' } },
    extend: {
      colors: {
        forest: { 950: '#0B1A11', 900: '#12291B', 800: '#1A3C26', 700: '#234F33', 600: '#2F6342' },
        gold: { 50: '#FBF5E4', 100: '#F3E3B0', 300: '#E2C77E', 400: '#D4AF37', 500: '#C5A059', 600: '#B8922E', 700: '#8F6F1F' },
        cream: { DEFAULT: '#F5F1E8', 200: '#EDE6D6', 300: '#E2D8C3' },
        terracotta: { DEFAULT: '#8B1E1E', 600: '#A52A2A' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      backgroundImage: {
        'gold-metal': 'linear-gradient(135deg,#F3E3B0 0%,#D4AF37 28%,#B8922E 50%,#F3E3B0 70%,#C5A059 100%)',
        'forest-radial': 'radial-gradient(ellipse at 50% 30%, #234F33 0%, #12291B 55%, #0B1A11 100%)',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(197,160,89,.6), 0 20px 50px -20px rgba(212,175,55,.45)',
        luxe: '0 30px 60px -30px rgba(0,0,0,.6)',
      },
      keyframes: {
        shine: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        rise: { '0%': { transform: 'translate3d(0,0,0) scale(.5)', opacity: '0' }, '15%': { opacity: '1' }, '80%': { opacity: '.8' }, '100%': { transform: 'translate3d(18px,-38vh,0) scale(1.1)', opacity: '0' } },
        kenburns: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.06) translate3d(0,-1%,0)' } },
        glow: { '0%,100%': { opacity: '.45', transform: 'scale(.96)' }, '50%': { opacity: '.85', transform: 'scale(1.05)' } },
      },
      animation: { shine: 'shine 6s linear infinite', float: 'float 7s ease-in-out infinite', rise: 'rise 10s linear infinite', kenburns: 'kenburns 30s ease-in-out infinite', glow: 'glow 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
