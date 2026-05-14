export const colors = {
  primary: '#3525cd',
  'on-primary': '#ffffff',
  'primary-container': '#4f46e5',
  'on-primary-container': '#dad7ff',
  surface: '#f8f9ff',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#eff4ff',
  'surface-container': '#e5eeff',
  'surface-container-high': '#dce9ff',
  'surface-container-highest': '#d3e4fe',
  'on-surface': '#0b1c30',
  'on-surface-variant': '#464555',
  outline: '#777587',
  'outline-variant': '#c7c4d8',
  tertiary: '#005338',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#006e4b',
  'on-tertiary-container': '#67f4b7',
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',
} as const

export const spacing = {
  unit: 8,
  gutter: 24,
  'stack-sm': 8,
  'stack-md': 16,
  'stack-lg': 32,
} as const

export const borderRadius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
} as const

export const shadows = {
  card: '0 4px 20px rgba(15, 23, 42, 0.05)',
  'card-hover': '0 8px 30px rgba(15, 23, 42, 0.12)',
} as const