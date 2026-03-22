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

export const colors = {
  primary:    green[500],
  background: green[200],
  surface:    green[100],
  border:     green[300],
} as const;
