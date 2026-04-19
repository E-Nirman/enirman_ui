/*
 * enirman-ui v2 Tailwind preset (shadcn-vue compatible)
 *
 * Usage in a consumer app:
 *
 *   import frappeUIPreset from 'frappe-ui/tailwind'
 *   import enirmanPreset  from 'enirman-ui/tailwind-preset'
 *
 *   export default {
 *     presets: [frappeUIPreset, enirmanPreset],
 *     content: [
 *       './index.html',
 *       './src/**\/*.{vue,js,ts,jsx,tsx}',
 *       './node_modules/frappe-ui/src/**\/*.{vue,js,ts,jsx,tsx}',
 *       './node_modules/enirman-ui/src/**\/*.{vue,js,ts,jsx,tsx}',
 *     ],
 *   }
 *
 * The dark variant targets [data-theme="dark"] (frappe-ui convention)
 * so both component libraries respond to the same attribute switch.
 */

import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',

        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        success: {
          DEFAULT:    'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          muted:      'hsl(var(--success-muted))',
          ink:        'hsl(var(--success-ink))',
        },
        warning: {
          DEFAULT:    'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          muted:      'hsl(var(--warning-muted))',
          ink:        'hsl(var(--warning-ink))',
        },
        info: {
          DEFAULT:    'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          muted:      'hsl(var(--info-muted))',
          ink:        'hsl(var(--info-ink))',
        },
        plus: {
          DEFAULT:    'hsl(var(--plus))',
          foreground: 'hsl(var(--plus-foreground))',
          muted:      'hsl(var(--plus-muted))',
          ink:        'hsl(var(--plus-ink))',
        },

        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        sidebar: {
          DEFAULT:      'hsl(var(--sidebar))',
          foreground:   'hsl(var(--sidebar-foreground))',
          muted:        'hsl(var(--sidebar-muted))',
          border:       'hsl(var(--sidebar-border))',
          accent:       'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          primary:      'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        },
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        xl:  'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--reka-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--reka-accordion-content-height)' },
          to:   { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to:   { height: 'var(--reka-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--reka-collapsible-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'collapsible-down':'collapsible-down 0.2s ease-out',
        'collapsible-up':  'collapsible-up 0.2s ease-out',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [animate],
}
