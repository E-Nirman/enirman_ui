<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { cn } from '../lib/utils.js'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip/index.js'

/*
 * SidebarItem — single nav row.
 *
 * Active state auto-derives from route. Set `exact` to require an
 * exact path match (for dashboard-like roots).
 *
 * Props:
 *   label, icon (lucide), to (route) or href (external), badge, child
 *   collapsed (parent controls), exact
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
          'group flex h-8 items-center gap-2.5 rounded-md text-sm transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          collapsed ? 'mx-auto w-8 justify-center px-0' : child ? 'mx-2 pl-6 pr-2' : 'mx-2 px-2',
          isActive
            ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
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
          class="ml-auto inline-flex min-w-[18px] items-center justify-center rounded bg-primary px-1 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground"
        >{{ badge }}</span>
        <span
          v-if="!collapsed && shortcut"
          data-hide-collapsed
          class="ml-auto text-[10px] tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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
