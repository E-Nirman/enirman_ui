/* Playground-only Tailwind config — consumers use tailwind-preset.js. */
import preset from './tailwind-preset.js'

export default {
  presets: [preset],
  content: [
    './playground/index.html',
    './playground/**/*.{vue,js}',
    './src/**/*.{vue,js}',
  ],
}
