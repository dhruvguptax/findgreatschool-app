// postcss.config.mjs (Correct ESM syntax for Tailwind v3)

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    // Use string keys for plugins in this format
    tailwindcss: {},
    autoprefixer: {},
  },
};