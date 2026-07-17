import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

/*
 * Vite config for the local component playground (playground/).
 * `yarn play` — used to verify components against the design mockup
 * before a release. Not part of the published package.
 */
export default defineConfig({
  root: 'playground',
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@enirman/ui', replacement: fileURLToPath(new URL('./src/index.js', import.meta.url)) },
      // Heavy optional deps of EuiDwgViewer — stubbed in the playground.
      { find: /^@mlightcad\/.*/, replacement: fileURLToPath(new URL('./playground/stubs/empty.js', import.meta.url)) },
      { find: /^element-plus.*/, replacement: fileURLToPath(new URL('./playground/stubs/empty.js', import.meta.url)) },
    ],
  },
  server: { port: 8124, strictPort: true },
})
