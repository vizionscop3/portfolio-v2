/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './public/**/*.html'],
  // Enable CSS purging for production builds
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
      './public/**/*.html',
    ],
    options: {
      safelist: [
        // Preserve 3D and animation classes
        /^animate-/,
        /^transition-/,
        /^transform/,
        /^rotate-/,
        /^scale-/,
        /^translate-/,
        // Preserve cyberpunk theme classes
        /^bg-gradient/,
        /^text-gradient/,
        /^green-pink-gradient/,
        // Preserve responsive classes
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        /^2xl:/,
      ],
    },
  },
  theme: {
    extend: {
      colors: {
        // Revolutionary Base Theme
        primary: '#050816',
        secondary: '#aaa6c3',
        tertiary: '#151030',
        'black-100': '#100d25',
        'black-200': '#090325',
        'white-100': '#f3f3f3',

        // Advanced Cyberpunk Palette
        cyber: {
          primary: '#915EFF',
          secondary: '#00D4FF',
          accent: '#FF007F',
          warning: '#FFD700',
          success: '#00FF7F',
          danger: '#FF073A',
          purple: '#915EFF',
          cyan: '#00FFFF',
          pink: '#FF00FF',
          green: '#00FF41',
          orange: '#FF6B00',
          blue: '#0080FF',
          red: '#FF073A',
          gold: '#FFD700',
          violet: '#8A2BE2',
          magenta: '#FF1493',
          lime: '#32CD32',
          coral: '#FF7F50',
        },

        // Custom brand colors for Lee Aulder portfolio
        brand: {
          primary: '#8A038C', // Main Color
          secondary: '#580259', // Secondary Color
          accent: '#00F7ED', // Header Title Background
          dark: '#404040', // Gray variant
          black: '#0D0D0D', // Matte black
        },

        // Revolutionary Neon Colors
        neon: {
          primary: '#915EFF',
          cyan: '#00FFFF',
          magenta: '#FF00FF',
          yellow: '#FFFF00',
          green: '#00FF00',
          purple: '#8B5CF6',
          pink: '#EC4899',
          blue: '#06B6D4',
          orange: '#F97316',
          lime: '#84CC16',
          red: '#EF4444',
          gold: '#F59E0B',
        },

        // Glassmorphism Colors
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.1)',
          cyber: 'rgba(145, 94, 255, 0.1)',
          neon: 'rgba(0, 255, 255, 0.1)',
          pink: 'rgba(255, 0, 127, 0.1)',
          purple: 'rgba(139, 92, 246, 0.1)',
        },

        // Advanced Dark Variants
        dark: {
          50: '#0A0A0A',
          100: '#0F0F0F',
          200: '#1A1A1A',
          300: '#262626',
          400: '#333333',
          500: '#404040',
          600: '#525252',
          700: '#666666',
          800: '#737373',
          900: '#A3A3A3',
        },

        // Revolutionary Gradient Sets
        gradient: {
          cyber: '#915EFF',
          neon: '#00FFFF',
          pink: '#FF007F',
          gold: '#FFD700',
          purple: '#8B5CF6',
          blue: '#3B82F6',
        },
      },
      boxShadow: {
        // Original shadows
        card: '0px 35px 120px -15px #211e35',

        // Revolutionary Neon Shadows
        'neon-purple': '0 0 20px #915EFF, 0 0 40px #915EFF, 0 0 80px #915EFF',
        'neon-cyan': '0 0 20px #00FFFF, 0 0 40px #00FFFF, 0 0 80px #00FFFF',
        'neon-pink': '0 0 20px #FF00FF, 0 0 40px #FF00FF, 0 0 80px #FF00FF',
        'neon-green': '0 0 20px #00FF41, 0 0 40px #00FF41, 0 0 80px #00FF41',
        'neon-gold': '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 80px #FFD700',
        'neon-red': '0 0 20px #FF073A, 0 0 40px #FF073A, 0 0 80px #FF073A',
        'neon-blue': '0 0 20px #0080FF, 0 0 40px #0080FF, 0 0 80px #0080FF',

        // Advanced Cyber Effects
        'cyber-glow': '0 0 30px rgba(145, 94, 255, 0.6)',
        'cyber-strong': '0 0 60px rgba(145, 94, 255, 0.8)',
        'cyber-intense': '0 0 100px rgba(145, 94, 255, 1)',

        // Glassmorphism Effects
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-strong': '0 25px 45px -12px rgba(0, 0, 0, 0.25)',
        'glass-cyber': '0 25px 50px -12px rgba(145, 94, 255, 0.25)',

        // Revolutionary Special Effects
        hologram:
          '0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 50px rgba(255, 0, 255, 0.1)',
        floating: '0 20px 80px -10px rgba(145, 94, 255, 0.4)',
        revolutionary:
          '0 25px 100px -12px rgba(0, 255, 255, 0.4), 0 0 60px rgba(145, 94, 255, 0.3)',
        matrix:
          '0 0 20px #00FF41, 0 0 40px #00FF41, 0 0 60px #00FF41, inset 0 0 20px rgba(0, 255, 65, 0.1)',
        'inner-glow': 'inset 0 0 20px rgba(145, 94, 255, 0.3)',
        'outer-inner':
          '0 0 40px rgba(145, 94, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.2)',

        // Multi-Color Effects
        rainbow: '0 0 20px #915EFF, 0 0 40px #00FFFF, 0 0 60px #FF007F',
        spectrum:
          '0 0 30px #915EFF, 0 0 60px #00FFFF, 0 0 90px #FF007F, 0 0 120px #FFD700',
        cosmic:
          '0 0 50px rgba(145, 94, 255, 0.6), 0 0 100px rgba(0, 255, 255, 0.4), 0 0 150px rgba(255, 0, 127, 0.3)',
      },
      screens: {
        xs: '450px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
        // Revolutionary breakpoints
        mobile: '480px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px',
        wide: '1440px',
        ultra: '1920px',
      },
      backgroundImage: {
        // Original patterns
        'hero-pattern': "url('/src/assets/herobg.png')",

        // Revolutionary Cyber Patterns
        'cyber-grid':
          'linear-gradient(rgba(145, 94, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(145, 94, 255, 0.1) 1px, transparent 1px)',
        'cyber-grid-dense':
          'linear-gradient(rgba(145, 94, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(145, 94, 255, 0.2) 1px, transparent 1px)',
        'neon-grid':
          'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',

        // Advanced Gradients
        'neon-gradient': 'linear-gradient(45deg, #915EFF, #00FFFF, #FF007F)',
        'cyber-gradient':
          'linear-gradient(135deg, #915EFF 0%, #00FFFF 50%, #FF007F 100%)',
        'rainbow-gradient':
          'linear-gradient(45deg, #915EFF, #00FFFF, #FF007F, #FFD700, #00FF41)',
        'cosmic-gradient':
          'radial-gradient(circle at 30% 40%, #915EFF 0%, transparent 50%), radial-gradient(circle at 80% 10%, #00FFFF 0%, transparent 50%), radial-gradient(circle at 40% 80%, #FF007F 0%, transparent 50%)',

        // Glassmorphism Effects
        'glass-gradient':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glass-cyber':
          'linear-gradient(135deg, rgba(145, 94, 255, 0.1), rgba(0, 255, 255, 0.05))',

        // Matrix and Hologram Effects
        hologram:
          'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%), linear-gradient(45deg, #915EFF, #00FFFF)',
        matrix:
          'linear-gradient(180deg, transparent 0%, rgba(0, 255, 65, 0.05) 50%, transparent 100%)',
        glitch:
          'linear-gradient(90deg, #FF073A 0%, #915EFF 25%, #00FFFF 50%, #00FF41 75%, #FFD700 100%)',

        // Revolutionary Mesh Patterns
        'cyber-mesh':
          'radial-gradient(circle at 25% 25%, #915EFF 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00FFFF 0%, transparent 50%)',
        'neon-mesh':
          'radial-gradient(circle at 20% 80%, #FF007F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00FFFF 0%, transparent 50%), radial-gradient(circle at 40% 40%, #915EFF 0%, transparent 50%)',
        'particle-field':
          'radial-gradient(circle at 10% 20%, rgba(145, 94, 255, 0.3) 0%, transparent 20%), radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.3) 0%, transparent 20%), radial-gradient(circle at 40% 40%, rgba(255, 0, 127, 0.3) 0%, transparent 20%)',

        // Dynamic Patterns
        'wave-pattern':
          'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(145, 94, 255, 0.1) 10px, rgba(145, 94, 255, 0.1) 20px)',
        'diagonal-stripes':
          'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
        'circuit-board':
          'linear-gradient(90deg, rgba(145, 94, 255, 0.1) 1px, transparent 1px), linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(45deg, rgba(255, 0, 127, 0.05) 1px, transparent 1px)',
      },
      fontFamily: {
        // Revolutionary Typography
        cyber: ['Orbitron', 'Courier New', 'monospace'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
        display: ['Exo 2', 'Helvetica', 'Arial', 'sans-serif'],
        futuristic: ['Rajdhani', 'sans-serif'],
        tech: ['Share Tech Mono', 'monospace'],
        matrix: ['Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Adobe fonts
        quirkwood: ['quirkwood-chunky', 'sans-serif'],
        'tt-frantz': ['tt-frantz-c', 'sans-serif'],
      },
      animation: {
        // Original animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',

        // Revolutionary Core Animations
        glow: 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite alternate',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        revolutionary: 'revolutionary 4s ease-in-out infinite',

        // Advanced Entrance Animations
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'scale-out': 'scaleOut 0.5s ease-out',
        'rotate-in': 'rotateIn 0.8s ease-out',
        'bounce-in': 'bounceIn 0.8s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'fade-down': 'fadeDown 0.8s ease-out',

        // Cyberpunk Special Effects
        glitch: 'glitch 2s ease-in-out infinite',
        hologram: 'hologram 3s ease-in-out infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'neon-flicker': 'neonFlicker 1.5s ease-in-out infinite',
        'cyber-pulse': 'cyberPulse 3s ease-in-out infinite',
        'cyber-bounce': 'cyberBounce 1s ease-in-out infinite',
        scan: 'scan 2s linear infinite',
        morphing: 'morphing 6s ease-in-out infinite',

        // Interactive Animations
        'hover-glow': 'hoverGlow 0.3s ease-out',
        'click-pulse': 'clickPulse 0.2s ease-out',
        'focus-ring': 'focusRing 0.3s ease-out',
        'loading-spin': 'loadingSpin 1s linear infinite',
        'progress-fill': 'progressFill 2s ease-out',

        // Revolutionary Complex Animations
        'particle-float': 'particleFloat 8s ease-in-out infinite',
        'energy-wave': 'energyWave 3s ease-in-out infinite',
        'quantum-shift': 'quantumShift 4s ease-in-out infinite',
        'dimensional-rift': 'dimensionalRift 5s ease-in-out infinite',
        'cosmic-drift': 'cosmicDrift 10s ease-in-out infinite',
        'neural-network': 'neuralNetwork 6s ease-in-out infinite',
        'data-stream': 'dataStream 3s linear infinite',
        'cyber-wave': 'cyberWave 2s ease-in-out infinite',

        // Micro-interactions
        'micro-bounce': 'microBounce 0.3s ease-out',
        'micro-scale': 'microScale 0.2s ease-out',
        'micro-glow': 'microGlow 0.4s ease-out',
        'micro-float': 'microFloat 0.5s ease-out',
      },
      keyframes: {
        // Original keyframes
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },

        // Revolutionary Core Animations
        glow: {
          '0%': { filter: 'brightness(100%) saturate(100%)' },
          '100%': { filter: 'brightness(120%) saturate(120%)' },
        },
        pulseNeon: {
          '0%': { boxShadow: '0 0 20px #00FFFF, 0 0 40px #00FFFF' },
          '100%': { boxShadow: '0 0 30px #915EFF, 0 0 60px #915EFF' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        revolutionary: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            filter: 'hue-rotate(0deg)',
          },
          '25%': {
            transform: 'translateY(-10px) rotate(1deg)',
            filter: 'hue-rotate(90deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(0deg)',
            filter: 'hue-rotate(180deg)',
          },
          '75%': {
            transform: 'translateY(-10px) rotate(-1deg)',
            filter: 'hue-rotate(270deg)',
          },
        },

        // Advanced Entrance Animations
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg) scale(0.8)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },

        // Cyberpunk Special Effects
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        hologram: {
          '0%, 100%': {
            opacity: '0.8',
            filter: 'hue-rotate(0deg) brightness(100%)',
          },
          '50%': {
            opacity: '1',
            filter: 'hue-rotate(180deg) brightness(120%)',
          },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' },
        },
        cyberPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(145, 94, 255, 0.5)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
            transform: 'scale(1.02)',
          },
        },
        cyberBounce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.05)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        morphing: {
          '0%, 100%': { borderRadius: '20px' },
          '25%': { borderRadius: '50px 20px' },
          '50%': { borderRadius: '50px' },
          '75%': { borderRadius: '20px 50px' },
        },

        // Interactive Animations
        hoverGlow: {
          '0%': { boxShadow: '0 0 10px rgba(145, 94, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(145, 94, 255, 0.8)' },
        },
        clickPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        focusRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(145, 94, 255, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(145, 94, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(145, 94, 255, 0)' },
        },
        loadingSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },

        // Revolutionary Complex Animations
        particleFloat: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
          },
          '33%': {
            transform: 'translateY(-30px) translateX(20px) rotate(120deg)',
          },
          '66%': {
            transform: 'translateY(-60px) translateX(-20px) rotate(240deg)',
          },
        },
        energyWave: {
          '0%': {
            transform: 'scale(0.8) rotate(0deg)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scale(1.2) rotate(180deg)',
            opacity: '0.4',
          },
          '100%': {
            transform: 'scale(0.8) rotate(360deg)',
            opacity: '0.8',
          },
        },
        quantumShift: {
          '0%, 100%': {
            transform: 'translateX(0) rotateY(0deg)',
            filter: 'blur(0px)',
          },
          '25%': {
            transform: 'translateX(10px) rotateY(90deg)',
            filter: 'blur(2px)',
          },
          '50%': {
            transform: 'translateX(0) rotateY(180deg)',
            filter: 'blur(0px)',
          },
          '75%': {
            transform: 'translateX(-10px) rotateY(270deg)',
            filter: 'blur(2px)',
          },
        },
        dimensionalRift: {
          '0%, 100%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            filter: 'saturate(100%)',
          },
          '50%': {
            transform: 'perspective(1000px) rotateX(180deg) rotateY(180deg)',
            filter: 'saturate(150%)',
          },
        },
        cosmicDrift: {
          '0%': {
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg)',
          },
          '25%': {
            transform: 'translate(20px, -20px) rotate(90deg) scale(1.1)',
            filter: 'hue-rotate(90deg)',
          },
          '50%': {
            transform: 'translate(0, -40px) rotate(180deg) scale(1)',
            filter: 'hue-rotate(180deg)',
          },
          '75%': {
            transform: 'translate(-20px, -20px) rotate(270deg) scale(1.1)',
            filter: 'hue-rotate(270deg)',
          },
          '100%': {
            transform: 'translate(0, 0) rotate(360deg) scale(1)',
            filter: 'hue-rotate(360deg)',
          },
        },
        neuralNetwork: {
          '0%, 100%': {
            opacity: '0.7',
            transform: 'scale(1)',
          },
          '33%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
          '66%': {
            opacity: '0.8',
            transform: 'scale(0.95)',
          },
        },
        dataStream: {
          '0%': {
            transform: 'translateX(-100%) scaleX(0)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateX(0%) scaleX(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100%) scaleX(0)',
            opacity: '0',
          },
        },
        cyberWave: {
          '0%': {
            transform: 'scaleY(0.3)',
            transformOrigin: 'center bottom',
          },
          '50%': {
            transform: 'scaleY(1)',
            transformOrigin: 'center bottom',
          },
          '100%': {
            transform: 'scaleY(0.3)',
            transformOrigin: 'center bottom',
          },
        },

        // Micro-interactions
        microBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        microScale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        microGlow: {
          '0%': { boxShadow: '0 0 5px rgba(145, 94, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(145, 94, 255, 0.6)' },
        },
        microFloat: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },

        // Legacy keyframes for compatibility
        neonPulse: {
          '0%': {
            textShadow: '0 0 5px #915EFF, 0 0 10px #915EFF, 0 0 20px #915EFF',
          },
          '100%': {
            textShadow: '0 0 10px #915EFF, 0 0 20px #915EFF, 0 0 40px #915EFF',
          },
        },
      },
      spacing: {
        // Revolutionary spacing system for perfect symmetry
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        46: '11.5rem',
        50: '12.5rem',
        54: '13.5rem',
        58: '14.5rem',
        62: '15.5rem',
        66: '16.5rem',
        70: '17.5rem',
        74: '18.5rem',
        78: '19.5rem',
        82: '20.5rem',
        86: '21.5rem',
        88: '22rem',
        90: '22.5rem',
        94: '23.5rem',
        98: '24.5rem',
        102: '25.5rem',
        106: '26.5rem',
        110: '27.5rem',
        114: '28.5rem',
        118: '29.5rem',
        122: '30.5rem',
        126: '31.5rem',
        130: '32.5rem',
      },

      // Revolutionary Border Radius
      borderRadius: {
        cyber: '0 20px 0 20px',
        revolutionary: '30px 5px 30px 5px',
        organic: '60% 40% 30% 70% / 60% 30% 70% 40%',
        neural: '20px 40px 60px 40px',
        quantum: '50% 20% 50% 20%',
        matrix: '0 30px 0 30px',
        hologram: '25px 75px 25px 75px',
        futuristic: '40px 10px 40px 10px',
        asymmetric: '60px 20px 80px 10px',
        wave: '100px 0 100px 0',
      },

      // Advanced Z-Index for layering
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
        overlay: '1000',
        modal: '1100',
        tooltip: '1200',
        revolutionary: '9999',
      },

      // Revolutionary Background Sizes
      backgroundSize: {
        grid: '50px 50px',
        'grid-dense': '25px 25px',
        'grid-sparse': '100px 100px',
        dots: '20px 20px',
        'dots-dense': '10px 10px',
        mesh: '100% 100%',
        circuit: '200px 200px',
        pattern: '150px 150px',
      },

      // Advanced Backdrop Filters
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
        '2xl': '40px',
        '3xl': '64px',
        revolutionary: '100px',
      },
    },
  },
  plugins: [
    // Revolutionary utilities plugin
    function ({ addUtilities, addComponents }) {
      // Revolutionary Text Effects
      const textUtilities = {
        '.text-glow': {
          textShadow:
            '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        },
        '.text-glow-strong': {
          textShadow:
            '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
        },
        '.text-cyber': {
          background: 'linear-gradient(45deg, #915EFF, #00FFFF)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 30px rgba(145, 94, 255, 0.5)',
        },
        '.text-neon': {
          color: '#00FFFF',
          textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
        },
        '.text-matrix': {
          color: '#00FF41',
          textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41',
          fontFamily: 'Courier New, monospace',
        },
        '.text-hologram': {
          background:
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          animation: 'hologram 3s ease-in-out infinite',
        },
      };

      // Revolutionary Background Effects
      const backgroundUtilities = {
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
        },
        '.glass-cyber': {
          background: 'rgba(145, 94, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(145, 94, 255, 0.3)',
          borderRadius: '20px',
        },
        '.cyber-border': {
          border: '2px solid',
          borderImageSource:
            'linear-gradient(45deg, #915EFF, #00FFFF, #FF007F)',
          borderImageSlice: '1',
        },
        '.neon-border': {
          border: '2px solid #00FFFF',
          boxShadow:
            '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)',
        },
        '.revolutionary-gradient': {
          background:
            'linear-gradient(45deg, #915EFF, #00FFFF, #FF007F, #915EFF)',
          backgroundSize: '400% 400%',
          animation: 'revolutionary 4s ease-in-out infinite',
        },
        '.cosmic-gradient': {
          background:
            'radial-gradient(circle at 30% 40%, #915EFF 0%, transparent 50%), radial-gradient(circle at 80% 10%, #00FFFF 0%, transparent 50%), radial-gradient(circle at 40% 80%, #FF007F 0%, transparent 50%)',
        },
      };

      // Revolutionary Interactive Effects
      const interactiveUtilities = {
        '.hover-glow': {
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 30px rgba(145, 94, 255, 0.6)',
            transform: 'scale(1.05)',
          },
        },
        '.hover-float': {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px rgba(145, 94, 255, 0.3)',
          },
        },
        '.hover-neon': {
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 20px #00FFFF, 0 0 40px #00FFFF',
            borderColor: '#00FFFF',
          },
        },
        '.cyber-card': {
          background: 'rgba(21, 16, 48, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(145, 94, 255, 0.3)',
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(145, 94, 255, 0.6)',
            boxShadow: '0 20px 40px rgba(145, 94, 255, 0.3)',
            transform: 'translateY(-5px)',
          },
        },
      };

      // Revolutionary Layout Utilities
      const layoutUtilities = {
        '.center-absolute': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        '.center-flex': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '.grid-cyber': {
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        },
        '.revolutionary-grid': {
          display: 'grid',
          gap: '3rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          padding: '2rem',
        },
        '.symmetrical-padding': {
          padding: '3rem 2rem',
        },
        '.perfect-square': {
          aspectRatio: '1 / 1',
        },
        '.golden-ratio': {
          aspectRatio: '1.618 / 1',
        },
      };

      // Add all utilities
      addUtilities({
        ...textUtilities,
        ...backgroundUtilities,
        ...interactiveUtilities,
        ...layoutUtilities,
      });

      // Revolutionary Components
      const components = {
        '.btn-cyber': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 24px',
          background: 'linear-gradient(45deg, #915EFF, #00FFFF)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 10px 30px rgba(145, 94, 255, 0.4)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        '.card-revolutionary': {
          background: 'rgba(21, 16, 48, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(145, 94, 255, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(145, 94, 255, 0.6)',
            boxShadow: '0 25px 50px rgba(145, 94, 255, 0.3)',
            transform: 'translateY(-10px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, #915EFF, #00FFFF, #FF007F)',
          },
        },
      };

      addComponents(components);
    },

    // Line clamp utilities
    function ({ addUtilities }) {
      const lineClampUtilities = {
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.line-clamp-4': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
        '.line-clamp-5': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '5',
        },
      };
      addUtilities(lineClampUtilities);
    },
  ],
};
