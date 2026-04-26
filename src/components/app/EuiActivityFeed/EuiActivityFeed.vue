<script setup>
import { computed } from 'vue'
import EuiReviewCard from '../EuiReviewCard/EuiReviewCard.vue'

defineOptions({ name: 'EuiActivityFeed' })

const props = defineProps({
  entries: { type: Array, required: true },  // mixed: {kind: 'review'|'comment'|'event', ...}
})

// Sort by timestamp ascending (oldest first → newest last)
const sorted = computed(() =>
  [...props.entries].sort((a, b) =>
    (a.timestamp || a.creation || '').localeCompare(b.timestamp || b.creation || ''))
)
</script>

<template>
  <div class="space-y-3">
    <template v-for="entry in sorted" :key="entry.kind + ':' + (entry.name || entry.id)">
      <EuiReviewCard v-if="entry.kind === 'review'" :review="entry" />
      <div v-else-if="entry.kind === 'comment'" class="rounded-md bg-muted/30 p-3">
        <div class="text-xs text-muted-foreground mb-1">{{ entry.owner }} · {{ entry.creation }}</div>
        <div class="text-sm whitespace-pre-wrap" v-html="entry.content" />
      </div>
      <div v-else-if="entry.kind === 'rfi'" class="rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
        <div class="flex flex-wrap items-center gap-1.5 mb-1">
          <span class="text-[10px] font-bold uppercase text-amber-600 tracking-wider">RFI</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-700">{{ entry.priority || 'Normal' }}</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">{{ entry.status }}</span>
        </div>
        <div class="text-sm font-medium">{{ entry.question_summary }}</div>
        <div class="text-xs text-muted-foreground mt-1">
          {{ entry.raised_by }}<span v-if="entry.timestamp"> · {{ entry.timestamp }}</span>
        </div>
      </div>
      <div v-else-if="entry.kind === 'event'" class="text-xs text-muted-foreground flex items-center gap-2 pl-3">
        <span class="size-1.5 rounded-full bg-muted-foreground/50" />
        <span>{{ entry.text }}<span v-if="entry.timestamp"> · {{ entry.timestamp }}</span></span>
      </div>
    </template>
  </div>
</template>
