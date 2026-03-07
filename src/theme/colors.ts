const customGreen = {
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
};

const colors = require('tailwindcss/colors');

const palettes = {
  primary: customGreen,
  neutral: colors.neutral,
  danger:  colors.red,
};

export const theme = {
  // Primary brand tokens
  background: palettes.primary[200],
  surface:    palettes.primary[100],
  border:     palettes.primary[300],
  foreground: palettes.neutral[900],
  muted:      palettes.neutral[800],
  subtle:     palettes.neutral[700],

  // Semantic purpose tokens
  danger:         palettes.danger[600],
  dangerSurface:  palettes.danger[50],
  dangerText:     palettes.danger[700],
  neutral:        palettes.neutral[600],
  neutralSurface: palettes.neutral[100],
};
