import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3525cd',
          'on-primary': '#ffffff',
          container: '#4f46e5',
          'on-container': '#dad7ff',
        },
        surface: {
          DEFAULT: '#f8f9ff',
          'container-lowest': '#ffffff',
          'container-low': '#eff4ff',
          'container': '#e5eeff',
          'container-high': '#dce9ff',
          'container-highest': '#d3e4fe',
        },
        'on-surface': '#0b1c30',
        'on-surface-variant': '#464555',
        outline: '#777587',
        'outline-variant': '#c7c4d8',
        tertiary: {
          DEFAULT: '#005338',
          'on-tertiary': '#ffffff',
          container: '#006e4b',
          'on-container': '#67f4b7',
        },
        error: {
          DEFAULT: '#ba1a1a',
          'on-error': '#ffffff',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
      },
    },
  },
  plugins: [],
}

export default config