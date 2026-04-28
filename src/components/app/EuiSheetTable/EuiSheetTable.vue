<script setup>
import { EuiStatusPill } from '../EuiStatusPill/index.js'

defineOptions({ name: 'EuiSheetTable' })
defineProps({
  rows: { type: Array, required: true },
  selectedName: { type: String, default: null },
})
const emit = defineEmits(['select', 'view'])
</script>

<template>
  <div class="overflow-x-auto bg-card flex-1">
    <table class="w-full border-collapse text-[14px]">
      <thead class="sticky top-0 z-10 bg-muted/60">
        <tr>
          <th class="text-left px-4 py-2.5 text-[12.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border whitespace-nowrap">Sheet</th>
          <th class="text-left px-4 py-2.5 text-[12.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">Title</th>
          <th class="hidden md:table-cell text-left px-4 py-2.5 text-[12.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">Disc.</th>
          <th class="text-left px-4 py-2.5 text-[12.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">Rev</th>
          <th class="text-left px-4 py-2.5 text-[12.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">Status</th>
          <th class="hidden lg:table-cell text-left px-4 py-2.5 text-[12.5px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.name"
            class="border-b border-border-soft transition-colors cursor-pointer"
            :class="selectedName === r.name ? 'bg-primary/10' : 'hover:bg-muted/30'"
            @click="emit('select', r)">
          <td class="px-4 py-3 align-middle">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-7 bg-muted border border-border rounded grid place-items-center text-muted-foreground/60 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </span>
              <span class="font-mono text-[13.5px] font-medium text-foreground">{{ r.sheet_no || r.name }}</span>
            </div>
          </td>
          <td class="px-4 py-3 align-middle">
            <span class="font-medium text-foreground">{{ r.title }}</span>
          </td>
          <td class="hidden md:table-cell px-4 py-3 align-middle">
            <span class="font-mono text-[12.5px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{{ r.discipline || '—' }}</span>
          </td>
          <td class="px-4 py-3 align-middle">
            <span class="font-mono text-[13px] px-2 py-0.5 bg-muted border border-border rounded-full text-foreground font-medium">{{ r.revision || 'A' }}</span>
          </td>
          <td class="px-4 py-3 align-middle">
            <EuiStatusPill :status="r.status || '—'" />
          </td>
          <td class="hidden lg:table-cell px-4 py-3 align-middle text-muted-foreground text-[13px]">{{ r.updated_label }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
