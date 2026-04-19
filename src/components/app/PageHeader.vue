<script setup>
import { cn } from '../../lib/utils.js'
import { ChevronRight } from 'lucide-vue-next'

/*
 * PageHeader — canonical page title row.
 *
 * Every top-level page starts with this. Slots:
 *   #icon      — leading icon (appears next to the title)
 *   #badge     — appears inline right of title (status chips)
 *   #actions   — right-aligned action buttons
 *   #extra     — row below (filters, tabs, search bar)
 *
 * `breadcrumbs` prop renders Linear-style back navigation above the
 * title; each entry is `{ label, to? }`.
 */

const props = defineProps({
  title:       { type: String, required: true },
  subtitle:    { type: String, default: '' },
  breadcrumbs: { type: Array, default: () => [] },
  class:       { type: [String, Array, Object], default: '' },
  compact:     { type: Boolean, default: false },
})
</script>

<template>
  <header :class="cn(
    'border-b border-border bg-background',
    compact ? 'px-5 py-3' : 'px-6 py-5',
    props.class,
  )">
    <nav v-if="breadcrumbs.length" class="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
      <template v-for="(c, i) in breadcrumbs" :key="i">
        <component
          :is="c.to ? 'router-link' : 'span'"
          :to="c.to"
          :class="[
            'transition-colors',
            c.to ? 'hover:text-foreground' : 'text-foreground',
          ]"
        >{{ c.label }}</component>
        <ChevronRight v-if="i < breadcrumbs.length - 1" class="size-3 text-muted-foreground/60" />
      </template>
    </nav>

    <div class="flex flex-wrap items-start gap-3 sm:flex-nowrap sm:items-center">
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <slot name="icon" />
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 :class="cn(
              'text-foreground font-semibold tracking-tight truncate',
              compact ? 'text-lg' : 'text-xl sm:text-[22px]',
            )">{{ title }}</h1>
            <slot name="badge" />
          </div>
          <p v-if="subtitle || $slots.subtitle" class="mt-0.5 text-xs text-muted-foreground truncate">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
      </div>

      <div v-if="$slots.actions" class="flex flex-shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.extra" class="mt-3">
      <slot name="extra" />
    </div>
  </header>
</template>
