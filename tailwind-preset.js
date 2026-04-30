/*
 * @enirman/ui Tailwind preset (Enirman Design System v2)
 *
 * Usage in a consumer app:
 *
 *   import frappeUIPreset from 'frappe-ui/tailwind'
 *   import enirmanPreset  from '@enirman/ui/tailwind-preset'
 *
 *   export default {
 *     presets: [frappeUIPreset, enirmanPreset],
 *     content: [
 *       './index.html',
 *       './src/**\/*.{vue,js,ts,jsx,tsx}',
 *       './node_modules/frappe-ui/src/**\/*.{vue,js,ts,jsx,tsx}',
 *       './node_modules/@enirman/ui/src/**\/*.{vue,js,ts,jsx,tsx}',
 *     ],
 *   }
 *
 * Brand palette utilities are exposed as `navy-700`, `blue-500`,
 * `amber-400`, etc. — the raw hex variables from theme.css. Prefer
 * semantic tokens (`primary`, `accent`, `success-ink`); reach for
 * brand scales only when you need an exact swatch (SVG fills, slides).
 */

import animate from 'tailwindcss-animate'

const brandScale = (name, stops) =>
  stops.reduce((acc, stop) => {
    acc[stop] = `var(--brand-${name}-${stop})`
    return acc
  }, {})

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
        border:           'hsl(var(--border))',
        'border-subtle':  'hsl(var(--border-subtle))',
        'border-strong':  'hsl(var(--border-strong))',
        input:            'hsl(var(--input))',
        ring:             'hsl(var(--ring))',
        background:       'hsl(var(--background))',
        foreground:       'hsl(var(--foreground))',

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
          muted:      'hsl(var(--danger-muted))',
          ink:        'hsl(var(--danger-ink))',
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

        /* Raw brand scales — exact hexes for SVG / slide artifacts. */
        navy:  brandScale('navy',  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        blue:  brandScale('blue',  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        amber: brandScale('amber', [50, 100, 200, 300, 400, 500, 600, 700]),
      },
      borderRadius: {
        sm:    'var(--radius-sm)',     /* 6px  — buttons, inputs */
        md:    'var(--radius-sm)',
        lg:    'var(--radius)',        /* 8px  — cards (default) */
        xl:    'var(--radius-lg)',     /* 12px */
        '2xl': 'var(--radius-xl)',     /* 16px — dialogs */
        pill:  '999px',
      },
      fontFamily: {
        sans:    ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono:    ['var(--font-mono)'],
      },
      fontSize: {
        '2xs':   ['11px', { lineHeight: '1.3' }],
        xs:      ['12px', { lineHeight: '1.3' }],
        sm:      ['13px', { lineHeight: '1.4' }],
        base:    ['14px', { lineHeight: '1.5' }],
        md:      ['14px', { lineHeight: '1.5' }],
        lg:      ['16px', { lineHeight: '1.65' }],
        xl:      ['18px', { lineHeight: '1.4' }],
        '2xl':   ['22px', { lineHeight: '1.3',  letterSpacing: '-0.015em' }],
        '3xl':   ['28px', { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
        '4xl':   ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '5xl':   ['48px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        '6xl':   ['64px', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        '7xl':   ['80px', { lineHeight: '1',    letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        tighter: 'var(--tracking-tighter)',
        tight:   'var(--tracking-tight)',
        normal:  'var(--tracking-normal)',
        wide:    'var(--tracking-wide)',
        wider:   'var(--tracking-wider)',
        caps:    'var(--tracking-caps)',
      },
      boxShadow: {
        xs:    'var(--shadow-xs)',
        sm:    'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        xl:    'var(--shadow-xl)',
        inner: 'var(--shadow-inner)',
        focus: 'var(--shadow-focus)',
        soft:                 'var(--button-shadow-soft)',
        'soft-hover':         'var(--button-shadow-soft-hover)',
        'soft-neutral':       'var(--button-shadow-soft-neutral)',
        'soft-neutral-hover': 'var(--button-shadow-soft-neutral-hover)',
      },
      transitionTimingFunction: {
        'out-expo':  'var(--ease-out)',
        'in-out':    'var(--ease-in-out)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '280ms',
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
