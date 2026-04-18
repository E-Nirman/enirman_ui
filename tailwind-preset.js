/*
 * enirman-ui Tailwind preset.
 *
 * Usage in a consumer app's tailwind.config.js:
 *
 *   import frappeUIPreset from 'frappe-ui/tailwind'
 *   import enirmanPreset from 'enirman-ui/tailwind-preset'
 *
 *   export default {
 *     presets: [frappeUIPreset, enirmanPreset],
 *     content: [
 *       './index.html',
 *       './src/**\/*.{vue,js,ts,jsx,tsx}',
 *       './node_modules/frappe-ui/src/**\/*.{vue,js,ts,jsx,tsx}',
 *       '../../enirman_ui/src/**\/*.{vue,js,ts,jsx,tsx}',
 *     ],
 *   }
 *
 * This preset wires Tailwind color utilities to our CSS variables so
 * `bg-brand-500`, `text-success`, etc. respect dark mode automatically.
 */

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'var(--brand-50)',
          100: 'var(--brand-100)',
          300: 'var(--brand-300)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          DEFAULT: 'var(--color-primary)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          subtle:  'var(--color-primary-subtle)',
          ink:     'var(--color-primary-ink)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          subtle:  'var(--color-success-subtle)',
          ink:     'var(--color-success-ink)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          subtle:  'var(--color-warning-subtle)',
          ink:     'var(--color-warning-ink)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          subtle:  'var(--color-danger-subtle)',
          ink:     'var(--color-danger-ink)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          subtle:  'var(--color-info-subtle)',
          ink:     'var(--color-info-ink)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          subtle:  'var(--color-accent-subtle)',
          ink:     'var(--color-accent-ink)',
        },
      },
      borderRadius: {
        xs:  'var(--radius-xs)',
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        xs:  'var(--shadow-xs)',
        sm:  'var(--shadow-sm)',
        md:  'var(--shadow-md)',
        lg:  'var(--shadow-lg)',
        xl:  'var(--shadow-xl)',
        pop: 'var(--shadow-pop)',
      },
      fontSize: {
        // Match existing enirman_connect sizing: bumped by ~1px vs Tailwind default
        xs:   ['0.8125rem', { lineHeight: '1.125rem' }],
        sm:   ['0.9375rem', { lineHeight: '1.375rem' }],
        base: ['1.0625rem', { lineHeight: '1.625rem' }],
      },
      screens: {
        xs: '480px',
      },
    },
  },
}
