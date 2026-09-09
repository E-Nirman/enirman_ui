/* Unit-test config. Kept separate from vite.config.js, whose root is the
 * playground. Not part of the published package. */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
})
