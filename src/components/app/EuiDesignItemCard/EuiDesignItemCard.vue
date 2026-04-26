<script setup>
import { computed } from 'vue'
import { Badge } from '../../ui/badge'
import EuiBlockBadge from '../EuiBadges/EuiBlockBadge.vue'

defineOptions({ name: 'EuiDesignItemCard' })

const props = defineProps({
  item: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  density: { type: String, default: 'normal' }, // 'normal' | 'compact'
})

const isArchived = computed(() => props.item.option_status === 'Not Selected')
const fileBadgeText = computed(() => {
  const i = props.item
  if (i.image_1 || i.image_2 || i.image_3) return 'IMG'
  if (i.file_dwg) return 'DWG'
  if (i.file_pdf) return 'PDF'
  if (i.file_e2k) return 'E2K'
  return '—'
})
const statusVariant = computed(() => {
  switch (props.item.status) {
    case 'Approved':
    case 'Client Approved':
      return 'success'
    case 'Working':
    case 'Internal Review':
      return 'default'
    case 'Sent to Client':
    case 'Municipality Process':
      return 'warning'
    case 'Needs Redesign':
    case 'Needs Correction':
    case 'Rejected':
      return 'destructive'
    case 'Superseded':
      return 'secondary'
    default:
      return 'default'
  }
})
</script>

<template>
  <button
    type="button"
    class="w-full text-left flex items-start gap-2 rounded-lg border p-2.5 transition-all hover:border-ring/40"
    :class="[
      selected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border bg-card',
      isArchived && 'opacity-60',
    ]"
  >
    <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-[9px] font-bold">{{ fileBadgeText }}</span>

    <span class="min-w-0 flex-1">
      <span class="flex flex-wrap items-center gap-1 mb-1">
        <EuiBlockBadge :block="item.block" v-if="item.project_block || item.block" />
        <Badge v-if="item.option_label" variant="primary" class="font-mono text-[9px]">
          {{ item.option_label }}
        </Badge>
        <Badge variant="outline" class="font-mono text-[9px]">{{ item.version_label || 'v1' }}</Badge>
        <Badge :variant="statusVariant" class="text-[9px]">{{ item.status }}</Badge>
      </span>
      <span class="block text-sm font-medium truncate">{{ item.title }}</span>
      <span v-if="density !== 'compact'" class="block text-[11px] text-muted-foreground mt-0.5 truncate">
        {{ item.assigned_designer || '—' }}
      </span>
    </span>
  </button>
</template>
