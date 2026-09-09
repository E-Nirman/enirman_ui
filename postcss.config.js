export default {
  plugins: {
    // Must run first: inlines theme.css's local @imports (base + brands).
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
