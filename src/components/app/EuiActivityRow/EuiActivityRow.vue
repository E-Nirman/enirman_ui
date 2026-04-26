<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiActivityRow' })

const props = defineProps({
  entry: { type: Object, required: true },
})

const avatarBg = computed(() => ({
  blue:   'bg-gradient-to-br from-blue-500 to-blue-700',
  green:  'bg-gradient-to-br from-emerald-500 to-emerald-700',
  amber:  'bg-gradient-to-br from-amber-500 to-amber-700',
  red:    'bg-gradient-to-br from-red-500 to-red-700',
  purple: 'bg-gradient-to-br from-violet-500 to-violet-700',
  slate:  'bg-gradient-to-br from-slate-500 to-slate-700',
  teal:   'bg-gradient-to-br from-teal-500 to-teal-700',
})[props.entry.color] || 'bg-gradient-to-br from-slate-500 to-slate-700')
</script>

<template>
  <div class="flex gap-2.5 px-4 sm:px-[18px] py-2.5 border-b border-border/50 last:border-b-0 items-start">
    <span
      class="w-6 h-6 rounded-full text-white grid place-items-center text-[10px] font-semibold flex-shrink-0"
      :class="avatarBg"
    >
      {{ entry.initials }}
    </span>
    <div class="flex-1 min-w-0">
      <div class="text-[12.5px] text-foreground leading-relaxed">
        <slot>{{ entry.body }}</slot>
      </div>
      <div v-if="entry.time" class="font-mono text-[10.5px] text-muted-foreground/70 mt-0.5">{{ entry.time }}</div>
    </div>
  </div>
</template>
