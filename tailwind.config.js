/** @type {import('tailwindcss').Config} */

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

const palettes = {
  primary: customGreen,
  neutral: require('tailwindcss/colors').neutral,
  danger:  require('tailwindcss/colors').red,
};

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        xs:   ['13px', { lineHeight: '16px' }],
        sm:   ['15px', { lineHeight: '20px' }],
        base: ['17px', { lineHeight: '24px' }],
        lg:   ['19px', { lineHeight: '26px' }],
        xl:   ['22px', { lineHeight: '28px' }],
        '2xl': ['26px', { lineHeight: '32px' }],
      },
      fontWeight: {
        normal:   '500',
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },
      fontFamily: {
        sans:     ['WorkSans_400Regular'],
        medium:   ['WorkSans_500Medium'],
        semibold: ['WorkSans_600SemiBold'],
        bold:     ['WorkSans_700Bold'],
      },
      colors: {
        // Primary brand tokens
        background: palettes.primary[200],
        surface:    palettes.primary[100],
        border:     palettes.primary[300],
        foreground: palettes.neutral[900],
        muted:      palettes.neutral[800],
        subtle:     palettes.neutral[700],

        // Semantic purpose tokens
        danger:            palettes.danger[600],
        'danger-surface':  palettes.danger[50],
        'danger-text':     palettes.danger[700],
        neutral:           palettes.neutral[600],
        'neutral-surface': palettes.neutral[100],
      },
    },
  },
  plugins: [],
}
