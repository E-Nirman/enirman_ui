/* Unit-test config. Kept separate from vite.config.js, whose root is the
 * playground. Not part of the published package. The Vue plugin (already a
 * devDependency for the playground) lets tests import .vue components. */
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
})
