<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :to="to"
    :href="href"
    :aria-busy="loading || undefined"
    class="eui-btn"
    :class="[sizeClass, variantClass, { 'eui-btn--icon': iconOnly, 'eui-btn--block': block, 'eui-btn--loading': loading }]"
  >
    <span v-if="loading" class="eui-btn__spinner" aria-hidden="true" />
    <component v-else-if="iconLeft" :is="iconLeft" :class="iconSizeClass" aria-hidden="true" />
    <span v-if="!iconOnly" class="eui-btn__label"><slot /></span>
    <component v-if="iconOnly && !iconLeft && !loading" :is="$slots.icon ? 'span' : 'span'" :class="iconSizeClass">
      <slot name="icon" />
    </component>
    <component v-if="iconRight && !loading" :is="iconRight" :class="iconSizeClass" aria-hidden="true" />
  </component>
</template>

<script setup>
import { computed, useSlots } from 'vue'

/*
 * EuiButton — primary interactive control.
 *
 * Variants:
 *   primary    — brand-filled, main CTA (max one per view)
 *   secondary  — outlined, default action
 *   ghost      — no background, for dense toolbars
 *   subtle     — filled with gray surface, utility actions
 *   danger     — destructive, fills with --color-danger
 *   link       — inline text-style
 *
 * Sizes: sm (28px), md (34px, default), lg (40px)
 *
 * Use `iconOnly` for square 1:1 buttons; provide the icon via default slot
 * or the `iconLeft`/`iconRight` prop for regular buttons.
 */

const props = defineProps({
  variant: { type: String, default: 'secondary' },
  size:    { type: String, default: 'md' },
  type:    { type: String, default: 'button' },
  to:      { type: [String, Object], default: null },
  href:    { type: String, default: null },
  disabled:{ type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block:   { type: Boolean, default: false },
  iconOnly:{ type: Boolean, default: false },
  iconLeft: { type: [Object, Function], default: null },
  iconRight:{ type: [Object, Function], default: null },
})

const slots = useSlots()
const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'))

const sizeClass = computed(() => `eui-btn--${props.size}`)
const variantClass = computed(() => `eui-btn--${props.variant}`)
const iconSizeClass = computed(() => {
  if (props.size === 'sm') return 'eui-btn__icon eui-btn__icon--sm'
  if (props.size === 'lg') return 'eui-btn__icon eui-btn__icon--lg'
  return 'eui-btn__icon'
})
</script>

<style scoped>
.eui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color .15s, border-color .15s, color .15s, box-shadow .15s;
  text-decoration: none;
  user-select: none;
  flex-shrink: 0;
}
.eui-btn__label { white-space: nowrap; }
.eui-btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.eui-btn:disabled, .eui-btn--loading { opacity: .55; cursor: not-allowed; }
.eui-btn--block { width: 100%; }

/* Sizes */
.eui-btn--sm { height: 28px; padding: 0 10px; font-size: 13px; }
.eui-btn--md { height: 34px; padding: 0 14px; font-size: 14px; }
.eui-btn--lg { height: 40px; padding: 0 18px; font-size: 15px; }
.eui-btn--icon.eui-btn--sm { width: 28px; padding: 0; }
.eui-btn--icon.eui-btn--md { width: 34px; padding: 0; }
.eui-btn--icon.eui-btn--lg { width: 40px; padding: 0; }

/* Icons */
.eui-btn__icon    { width: 16px; height: 16px; flex-shrink: 0; }
.eui-btn__icon--sm{ width: 14px; height: 14px; }
.eui-btn__icon--lg{ width: 18px; height: 18px; }

/* Primary */
.eui-btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-xs);
}
.eui-btn--primary:not(:disabled):hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }

/* Secondary */
.eui-btn--secondary {
  background: var(--surface-white);
  color: var(--ink-gray-8);
  border-color: var(--outline-gray-3, var(--surface-gray-3));
  box-shadow: var(--shadow-xs);
}
.eui-btn--secondary:not(:disabled):hover { background: var(--surface-gray-1); border-color: var(--outline-gray-4, var(--surface-gray-4)); }

/* Ghost */
.eui-btn--ghost {
  background: transparent;
  color: var(--ink-gray-7);
}
.eui-btn--ghost:not(:disabled):hover { background: var(--surface-gray-2); color: var(--ink-gray-9); }

/* Subtle */
.eui-btn--subtle {
  background: var(--surface-gray-2);
  color: var(--ink-gray-8);
}
.eui-btn--subtle:not(:disabled):hover { background: var(--surface-gray-3); }

/* Danger */
.eui-btn--danger {
  background: var(--color-danger);
  color: #fff;
  border-color: var(--color-danger);
}
.eui-btn--danger:not(:disabled):hover { background: var(--color-danger-ink); border-color: var(--color-danger-ink); }

/* Link */
.eui-btn--link {
  background: transparent;
  color: var(--color-primary-ink);
  padding: 0;
  height: auto;
  border: none;
  box-shadow: none;
}
.eui-btn--link:not(:disabled):hover { text-decoration: underline; color: var(--color-primary-hover); }

/* Spinner */
.eui-btn__spinner {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: eui-spin .7s linear infinite;
}
@keyframes eui-spin { to { transform: rotate(360deg); } }
</style>
