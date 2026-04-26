<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiCdeStateBadge' })

const props = defineProps({
  state: { type: String, required: true }, // WIP / Shared / Published / Archived
})

const map = {
  WIP:       { label: 'Work in Progress',   bg: 'rgba(148,163,184,.15)', fg: '#cbd5e1', border: 'rgba(148,163,184,.3)' },
  Shared:    { label: 'Shared for Review',  bg: 'rgba(245,158,11,.15)',  fg: '#fbbf24', border: 'rgba(245,158,11,.3)' },
  Published: { label: 'Approved & Issued',  bg: 'rgba(16,185,129,.15)',  fg: '#34d399', border: 'rgba(16,185,129,.3)' },
  Archived:  { label: 'Archived',           bg: 'rgba(100,116,139,.12)', fg: '#94a3b8', border: 'rgba(100,116,139,.25)' },
}

const display = computed(() => map[props.state] || map.WIP)
</script>

<template>
  <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
        :style="{ background: display.bg, color: display.fg, borderColor: display.border }">
    {{ display.label }}
  </span>
</template>
