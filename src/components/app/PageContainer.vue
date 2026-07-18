<script setup>
import { cn } from '../../lib/utils.js'

/*
 * PageContainer — standard page body wrapper.
 *
 * v4: full-bleed with the mockup's 24/20px page padding — the `.page`
 * region runs edge-to-edge from the sidebar; no centering gutters.
 *
 * `size="narrow"` caps at 960px (centered) for forms / settings pages.
 * `flush` removes bottom padding when the last child is a full-bleed
 * table / list.
 */

const props = defineProps({
  size:  { type: String, default: 'default' },
  flush: { type: Boolean, default: false },
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div :class="cn(
    'w-full px-4 py-4 sm:px-6 sm:py-5',
    size === 'narrow' && 'mx-auto max-w-[960px]',
    flush && 'pb-0',
    props.class,
  )">
    <slot />
  </div>
</template>
