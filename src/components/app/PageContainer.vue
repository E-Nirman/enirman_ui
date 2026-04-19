<script setup>
import { cn } from '../../lib/utils.js'

/*
 * PageContainer — standard page body wrapper.
 *
 * Centers content (max 1440px), applies consistent horizontal padding
 * that scales with viewport. Every page's primary content uses this
 * so gutters are predictable.
 *
 * `size="narrow"` caps at 960px for forms / settings pages.
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
    'mx-auto w-full px-4 sm:px-6 py-5 sm:py-6',
    size === 'narrow' ? 'max-w-[960px]' : 'max-w-[1440px]',
    flush && 'pb-0',
    props.class,
  )">
    <slot />
  </div>
</template>
