<script setup>
import { EuiMarkupPin } from '../EuiMarkupPin/index.js'

defineOptions({ name: 'EuiMarkupOverlay' })

defineProps({ markups: { type: Array, default: () => [] } })
defineEmits(['select'])
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <template v-for="m in markups" :key="m.name">
      <button
        v-if="m.kind === 'Pin'"
        class="absolute -translate-x-1/2 -translate-y-full pointer-events-auto"
        :style="{ left: `${m.x_pct}%`, top: `${m.y_pct}%` }"
        @click.stop="$emit('select', m)"
      >
        <EuiMarkupPin :color="m.color_token" :resolved="!!m.resolved" />
      </button>

      <div
        v-else-if="m.kind === 'Rectangle'"
        class="absolute border-2 pointer-events-auto cursor-pointer"
        :class="{
          'border-red-500':   m.color_token === 'red',
          'border-amber-500': m.color_token === 'amber',
          'border-blue-500':  m.color_token === 'blue',
          'border-green-500': m.color_token === 'green',
        }"
        :style="{ left: `${m.x_pct}%`, top: `${m.y_pct}%`, width: `${m.width_pct}%`, height: `${m.height_pct}%` }"
        @click.stop="$emit('select', m)"
      ></div>
    </template>
  </div>
</template>
