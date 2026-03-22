export const green = {
  50:  '#F3FCF6',
  100: '#E2F8EA',
  200: '#C3EFD3',
  300: '#94E1B0',
  400: '#5EC986',
  500: '#37AE63',
  600: '#298E4E',
  700: '#237040',
  800: '#205A36',
  900: '#1D492D',
  950: '#0B2816',
} as const;

const neutralColors = require('tailwindcss/colors').neutral;
const dangerColors  = require('tailwindcss/colors').red;

const palettes = {
  primary: green,
  neutral: neutralColors,
  danger:  dangerColors,
};

export const theme = {
  // Primary brand tokens
  primary:     palettes.primary[500],
  primaryDark: palettes.primary[600],
  background:  palettes.primary[200],
  surface:     palettes.primary[100],
  border:      palettes.primary[300],
  foreground:  palettes.neutral[900],
  muted:       palettes.neutral[800],
  subtle:      palettes.neutral[700],

  // Semantic purpose tokens
  danger:         palettes.danger[600],
  dangerDark:     palettes.danger[800],
  dangerSurface:  palettes.danger[50],
  dangerText:     palettes.danger[700],
  neutral:        palettes.neutral[600],
  neutralSurface: palettes.neutral[100],
};
