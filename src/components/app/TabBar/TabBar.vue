<script setup>
import { computed, inject } from 'vue'
import { RouterLink, routeLocationKey } from 'vue-router'
import { cn } from '../../../lib/utils.js'

/*
 * TabBar (5.4.0) — bottom tab bar for phones: 3–5 top-level destinations,
 * icon over a short label.
 *
 * Accessibility:
 *   - a <nav> landmark named by `label` (default "Main"), with a list of
 *     links (or buttons when an item has neither `to` nor `href`);
 *   - the current destination carries aria-current="page";
 *   - visible focus ring from --ring; every item is at least --touch-target
 *     tall (44px desktop, 48px under data-platform="mobile");
 *   - icons are decorative (aria-hidden); the label is the accessible name.
 *
 * Which item is current:
 *   1. v-model / modelValue, when given (matched against item.value);
 *   2. otherwise item.active === true;
 *   3. otherwise derived from the route, like SidebarItem: the item whose
 *      `to` path equals the current path or is its parent (`exact` turns
 *      off the parent match). Works without a router too: no route, no
 *      derived match.
 *
 * Layout: by default it is fixed to the bottom of the viewport, full
 * width, with the safe-area inset added below the items. `fixed=false`
 * renders it in flow (for a shell that positions it itself). It does not
 * hide itself at wider breakpoints — add e.g. class="md:hidden".
 *
 * Styling uses tier-2 tokens only: bg-card, border-border-subtle, current
 * item text-action-primary, others text-fg3 → text-fg1 on hover.
 *
 * Props:
 *   items  [{ value, label, icon?, to?, href?, exact?, active?, disabled? }]
 *   label  accessible name of the navigation landmark
 *   fixed  pin to the viewport bottom (default true)
 * v-model the current item's value (optional)
 * Emits `select` (value, event) on every activation.
 * Slot `icon` ({ item, current }) replaces an item's icon.
 */

const props = defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Main' },
  fixed: { type: Boolean, default: true },
})

const model = defineModel({ type: [String, Number], default: undefined })
const emit = defineEmits(['select'])

// inject with a null default, so a TabBar outside a router neither throws
// nor logs a missing-injection warning.
const route = inject(routeLocationKey, null)

function targetPath(to) {
  if (!to) return null
  return typeof to === 'string' ? to : to.path || null
}

function routeMatches(item) {
  const path = route?.path
  const target = targetPath(item.to)
  if (!path || !target) return false
  if (path === target) return true
  if (item.exact) return false
  const base = target.endsWith('/') ? target : target + '/'
  return path.startsWith(base)
}

const currentValue = computed(() => {
  if (model.value !== undefined && model.value !== null) return model.value
  const flagged = props.items.find((i) => i.active === true)
  if (flagged) return flagged.value
  // Longest matching `to` wins, so /tools/concrete marks "tools", not "/".
  let best = null
  let bestLen = -1
  for (const item of props.items) {
    if (!routeMatches(item)) continue
    const len = targetPath(item.to).length
    if (len > bestLen) { best = item.value; bestLen = len }
  }
  return best
})

const isCurrent = (item) => currentValue.value !== null && currentValue.value !== undefined && item.value === currentValue.value

function tagFor(item) {
  if (item.disabled) return 'button'
  if (item.to) return RouterLink
  if (item.href) return 'a'
  return 'button'
}

// Only the attributes that apply are bound: an `undefined` fall-through
// attribute would overwrite the href RouterLink renders for itself.
function linkAttrs(item) {
  const tag = tagFor(item)
  if (tag === RouterLink) return { to: item.to }
  if (tag === 'a') return { href: item.href }
  return { type: 'button', disabled: item.disabled || undefined }
}

function onActivate(item, event) {
  if (item.disabled) return
  if (model.value !== undefined) model.value = item.value
  emit('select', item.value, event)
}
</script>

<template>
  <nav
    :aria-label="label"
    :class="cn(
      'border-t border-border-subtle bg-card pb-[env(safe-area-inset-bottom)]',
      fixed && 'fixed inset-x-0 bottom-0 z-40',
    )"
  >
    <ul class="grid min-h-[var(--tabbar-height)] auto-cols-fr grid-flow-col items-stretch gap-0.5 px-2 pt-1">
      <li v-for="item in items" :key="item.value" class="flex">
        <component
          :is="tagFor(item)"
          v-bind="linkAttrs(item)"
          :aria-current="isCurrent(item) ? 'page' : undefined"
          :data-tab="item.value"
          :class="cn(
            'flex min-h-[var(--touch-target)] w-full flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1',
            'text-[length:var(--fs-2xs)] font-semibold leading-tight',
            'transition-colors duration-fast outline-none',
            'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isCurrent(item) ? 'text-action-primary' : 'text-fg3 hover:text-fg1',
          )"
          @click="onActivate(item, $event)"
        >
          <span class="inline-flex size-6 items-center justify-center" aria-hidden="true">
            <slot name="icon" :item="item" :current="isCurrent(item)">
              <component
                :is="item.icon"
                v-if="item.icon"
                class="size-[22px]"
                :stroke-width="isCurrent(item) ? 2.25 : 1.75"
              />
            </slot>
          </span>
          <span class="max-w-full truncate">{{ item.label }}</span>
        </component>
      </li>
    </ul>
  </nav>
</template>
