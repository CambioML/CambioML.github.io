/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
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
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        'border-1': 'var(--border-1)',
        'card-1': 'var(--card-1)',
        light: 'var(--light)',
      },
    },
  },
  plugins: [],
};
