/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00ffff',
          secondary: '#ff00ff',
          accent: '#ffff00',
          dark: '#0a0a0a',
          darker: '#050505'
        },
        neon: {
          blue: '#00d4ff',
          pink: '#ff0080',
          purple: '#8000ff',
          green: '#00ff80'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'monospace']
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)'
          },
          '50%': {
            opacity: 0.8,
            transform: 'scale(1.02)'
          }
        },
        'glow': {
          from: {
            'text-shadow': '0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff'
          },
          to: {
            'text-shadow': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'neon': '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
        'neon-pink': '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
        'neon-green': '0 0 20px #00ff80, 0 0 40px #00ff80, 0 0 60px #00ff80'
      }
    },
  },
  plugins: [],
}