// tailwind.config.js (Updated with direct color values)

// We no longer need defaultTheme here for colors
const defaultTheme = require('tailwindcss/defaultTheme');
// We still need it for the font fallback
const colors = require('tailwindcss/colors'); // Import base colors if needed

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Keep the font family setup
      fontFamily: {
        sans: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
      },
      // --- UPDATED COLORS using hex codes or direct Tailwind names ---
      colors: {
        brand: {
          light: '#e0f2fe', // sky-100
          DEFAULT: '#0284c7', // sky-600 (Tailwind's default for sky)
          dark: '#075985',    // sky-800
        },
        secondary: {
          light: '#ccfbf1', // teal-100
          DEFAULT: '#0d9488', // teal-600
          dark: '#115e59',    // teal-800
        },
        success: colors.green[600], // Direct reference to Tailwind color (or use hex #16a34a)
        danger: colors.red[600],    // Direct reference (or use hex #dc2626)
        warning: colors.amber[500], // Direct reference (or use hex #f59e0b)

        // Define base text/background/border colors
        'base-text': colors.slate[800],     // #1e293b
        'subtle-text': colors.slate[600],    // #475569
        'light-bg': colors.slate[50],       // #f8fafc
        'border-color': colors.slate[300],  // #cbd5e1
        'link-color': colors.sky[700],      // #0369a1
      }
      // --- END UPDATED COLORS ---
    },
  },
  plugins: [
    
  ],
}