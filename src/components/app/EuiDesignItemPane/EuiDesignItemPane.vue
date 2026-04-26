<script setup>
import { computed } from 'vue'
import { Badge } from '../../ui/badge'
import EuiBlockBadge from '../EuiBadges/EuiBlockBadge.vue'

defineOptions({ name: 'EuiDesignItemPane' })

const props = defineProps({
  item: { type: Object, default: null },
  versions: { type: Array, default: () => [] },
})
const emit = defineEmits([
  'close', 'open-detail',
  'forward', 'approve', 'reject', 'send-to-client',
  'add-option', 'reassign',
  'upload-file', 'replace-file', 'remove-file',
])

const isWorking = computed(() => props.item?.status === 'Working')

const primaryLabel = computed(() => {
  switch (props.item?.status) {
    case 'Working': return 'Forward to Internal Review'
    case 'Internal Review': return 'Forward to Client'
    case 'Sent to Client': return 'Mark Client Approved'
    case 'Client Approved': return 'Forward to Municipality'
    case 'Needs Redesign':
    case 'Needs Correction':
    case 'Municipality Change Requested': return 'Upload new version'
    default: return 'Forward'
  }
})

const fileSlots = computed(() => {
  if (!props.item) return []
  const i = props.item
  return [
    { slot: 'pdf', label: 'PDF', url: i.file_pdf, kind: 'file_pdf' },
    { slot: 'dwg', label: 'DWG', url: i.file_dwg, kind: 'file_dwg' },
    { slot: 'e2k', label: 'E2K', url: i.file_e2k, kind: 'file_e2k' },
  ].filter(s => s.url)
})
</script>

<template>
  <aside v-if="item" class="w-[340px] border-l border-border bg-muted/30 flex-shrink-0 flex flex-col">
    <header class="px-4 py-2.5 border-b border-border flex items-center justify-between">
      <h4 class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Selected item</h4>
      <button class="text-muted-foreground hover:text-foreground" @click="emit('close')" aria-label="Hide pane">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div>
        <div class="font-semibold text-base">{{ item.title }}</div>
        <div class="flex flex-wrap gap-1 mt-1">
          <EuiBlockBadge :block="item.block" v-if="item.project_block" />
          <Badge variant="outline" class="font-mono text-[10px]">{{ item.version_label }}</Badge>
          <Badge variant="outline" class="text-[10px]">{{ item.status }}</Badge>
        </div>
      </div>

      <div>
        <div class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
          Files
          <Badge v-if="!isWorking" variant="secondary" class="text-[9px]">Locked — upload new version</Badge>
        </div>
        <div class="space-y-1.5">
          <div v-for="f in fileSlots" :key="f.slot" class="flex items-center gap-2 px-2.5 py-2 rounded border border-border bg-card">
            <span class="size-7 rounded text-[9px] font-bold flex items-center justify-center bg-muted">{{ f.label }}</span>
            <a :href="f.url" target="_blank" class="flex-1 min-w-0 text-xs font-medium truncate hover:underline">{{ f.url.split('/').pop() }}</a>
            <button v-if="isWorking" class="text-[10px] text-primary" @click="emit('replace-file', f.slot)" title="Replace">↺</button>
            <button v-if="isWorking" class="text-[10px] text-destructive" @click="emit('remove-file', f.slot)" title="Remove">×</button>
          </div>
          <button v-if="isWorking"
            class="w-full text-xs text-muted-foreground border border-dashed border-border rounded py-2 hover:border-primary hover:text-primary"
            @click="emit('upload-file')"
          >
            + Upload file
          </button>
        </div>
      </div>

      <div>
        <div class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Workflow</div>
        <button class="w-full rounded bg-primary text-primary-foreground text-xs font-medium px-3 py-2" @click="emit('forward')">{{ primaryLabel }}</button>
        <div class="grid grid-cols-2 gap-1.5 mt-1.5">
          <button class="rounded bg-success/10 text-success border border-success/40 text-xs font-medium px-3 py-2" @click="emit('approve')">Approve</button>
          <button class="rounded bg-warning/10 text-warning-foreground border border-warning/40 text-xs font-medium px-3 py-2" @click="emit('reject')">Reject</button>
        </div>
        <button class="w-full mt-1.5 rounded border border-border text-xs px-3 py-2" @click="emit('send-to-client')">Send to client</button>
      </div>

      <div>
        <div class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Item</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button class="rounded border border-border text-xs px-3 py-2" @click="emit('add-option')">Add option</button>
          <button class="rounded border border-border text-xs px-3 py-2" @click="emit('reassign')">Reassign</button>
        </div>
      </div>

      <div v-if="versions.length">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Versions</div>
          <button class="text-[10px] text-primary" @click="emit('open-detail')">View all →</button>
        </div>
        <div class="space-y-1 text-xs">
          <div v-for="v in versions.slice(0, 3)" :key="v.name" class="flex items-center gap-2 px-2 py-1.5 rounded border border-border">
            <span class="font-mono">{{ v.version_label }}</span>
            <span class="text-muted-foreground text-[10px] ml-auto">{{ v.status }}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">People</div>
        <div class="text-xs space-y-1">
          <div class="flex justify-between"><span class="text-muted-foreground">Designer</span><span>{{ item.assigned_designer || '—' }}</span></div>
          <div class="flex justify-between"><span class="text-muted-foreground">Reviewer</span><span>{{ item.current_reviewer || '—' }}</span></div>
        </div>
      </div>
    </div>

    <footer class="px-4 py-2.5 border-t border-border bg-card">
      <button class="w-full rounded bg-primary text-primary-foreground text-xs font-medium px-3 py-2" @click="emit('open-detail')">
        Open full detail page →
      </button>
    </footer>
  </aside>
</template>
