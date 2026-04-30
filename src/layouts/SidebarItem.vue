<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { cn } from '../lib/utils.js'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip/index.js'

/*
 * SidebarItem — single nav row, designed for the dark navy sidebar.
 *
 * Inactive: white at 70% on the navy 800 surface; hover lifts to
 *           white@6% bg with full white text.
 * Active:   blue 500 fill, white text, weight 600 — reads as the
 *           current page across the dark canvas.
 *
 * Active state auto-derives from route. Set `exact` for dashboard-
 * like roots that shouldn't match descendants.
 */

const props = defineProps({
  label:     { type: String, required: true },
  icon:      { type: [Object, Function], default: null },
  to:        { type: [String, Object], default: null },
  href:      { type: String, default: null },
  badge:     { type: [String, Number], default: null },
  collapsed: { type: Boolean, default: false },
  child:     { type: Boolean, default: false },
  exact:     { type: Boolean, default: false },
  active:    { type: Boolean, default: null },
  shortcut:  { type: String, default: '' },
})

defineEmits(['click'])

const route = useRoute()
const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'))

const isActive = computed(() => {
  if (props.active !== null) return props.active
  if (!props.to) return false
  const target = typeof props.to === 'string' ? props.to : props.to?.path
  if (!target) return false
  if (props.exact) return route.path === target
  return route.path === target || route.path.startsWith(target + '/')
})
</script>

<template>
  <Tooltip :delay-duration="300" :disable-hoverable-content="!collapsed">
    <TooltipTrigger as-child>
      <component
        :is="tag"
        :to="to"
        :href="href"
        :type="tag === 'button' ? 'button' : undefined"
        :aria-current="isActive ? 'page' : undefined"
        :class="cn(
          'group flex h-[30px] items-center gap-2.5 rounded-md text-sm transition-colors duration-fast outline-none',
          'focus-visible:ring-2 focus-visible:ring-sidebar-primary focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar',
          collapsed ? 'mx-auto w-8 justify-center px-0' : child ? 'mx-2 pl-7 pr-2.5' : 'mx-2 px-2.5',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-xs'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/[0.06] hover:text-sidebar-foreground',
        )"
        @click="$emit('click', $event)"
      >
        <span class="inline-flex size-4 shrink-0 items-center justify-center">
          <component :is="icon" v-if="icon" class="size-4" />
        </span>
        <span v-if="!collapsed" class="flex-1 truncate" data-hide-collapsed>{{ label }}</span>
        <span
          v-if="badge !== null && badge !== undefined && badge !== 0 && !collapsed"
          data-hide-collapsed
          :class="cn(
            'ml-auto inline-flex min-w-[18px] items-center justify-center rounded-pill px-1.5 py-0.5',
            'font-mono text-[10px] font-semibold leading-none tabular-nums',
            isActive
              ? 'bg-sidebar-foreground/[0.22] text-sidebar-primary-foreground'
              : 'bg-sidebar-foreground/[0.12] text-sidebar-foreground/85',
          )"
        >{{ badge }}</span>
        <span
          v-if="!collapsed && shortcut"
          data-hide-collapsed
          class="ml-auto font-mono text-[10px] tracking-widest text-sidebar-foreground/45 opacity-0 group-hover:opacity-100 transition-opacity"
        >{{ shortcut }}</span>
      </component>
    </TooltipTrigger>
    <TooltipContent v-if="collapsed" side="right" :side-offset="10">
      <div class="flex items-center gap-2">
        <span>{{ label }}</span>
        <span v-if="shortcut" class="text-[10px] tracking-widest text-background/70">{{ shortcut }}</span>
      </div>
    </TooltipContent>
  </Tooltip>
</template>
