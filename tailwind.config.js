/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        1.25: '0.3125rem', // 5px
        2.5: '0.625rem', // 10px
        3.75: '0.9375rem', // 15px
        6.25: '1.5625rem', // 25px
        12.5: '3.125rem', // 50px
        22: '5.5rem', // 88px
        25: '6.25rem', // 100px
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'var(--gradient-brand)',
        'gradient-section': 'var(--gradient-section)',
        'gradient-section-alt': 'var(--gradient-section-alt)',
      },
      colors: {
        'cambio-blue-0': 'var(--cambio-blue-0)',
        'cambio-blue-1': 'var(--cambio-blue-1)',
        'cambio-blue-2': 'var(--cambio-blue-2)',
        'cambio-blue-3': 'var(--cambio-blue-3)',
        'cambio-blue-4': 'var(--cambio-blue-4)',
        'cambio-red': 'var(--red)',
        'cambio-blue': 'var(--cambio-blue)',
        'cambio-gray': 'var(--cambio-gray)',
        'cambio-primary': 'var(--cambio-primary)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        'border-1': 'var(--border-1)',
        'card-1': 'var(--card-1)',
        light: 'var(--light)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        strong: 'var(--shadow-strong)',
        focus: 'var(--shadow-focus)',
      },
      borderWidth: {
        10: '10px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const gradientUtilities = {
        '.bg-gradient': {
          'font-weight': 'bold',
          display: 'inline-block',
          'line-height': '1.5',
          color: 'rgb(0, 0, 0)',
        },
        '.dark .bg-gradient': {
          'font-weight': 'bold',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-image': 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(112, 190, 250) 100%)',
          color: 'transparent',
        },
      };
      addUtilities(gradientUtilities, ['responsive', 'hover', 'dark']);
    },
  ],
};
