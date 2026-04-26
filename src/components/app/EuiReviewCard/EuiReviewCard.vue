<script setup>
import { computed } from 'vue'
import { Badge } from '../../ui/badge'

defineOptions({ name: 'EuiReviewCard' })

const props = defineProps({
  review: { type: Object, required: true },
})

const decisionVariant = computed(() => ({
  'Pending': 'default',
  'Approved': 'success',
  'Needs Redesign': 'destructive',
  'Needs Correction': 'warning',
  'Rejected': 'destructive',
})[props.review.decision] || 'default')

const reviewerLabel = computed(() => {
  const r = props.review
  if (r.reviewer) return r.reviewer
  if (r.external_party_name) return `${r.external_party_name}${r.external_party_role ? ' (' + r.external_party_role + ')' : ''}`
  return r.external_party || '—'
})
</script>

<template>
  <div class="rounded-md border border-border bg-card p-3">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
          <Badge variant="outline" class="text-[10px]">{{ review.review_type }} review</Badge>
          <Badge variant="outline" class="text-[10px]">Round {{ review.round }}</Badge>
          <Badge :variant="decisionVariant" class="text-[10px]">{{ review.decision }}</Badge>
        </div>
        <div class="text-xs text-muted-foreground mb-1">
          By {{ reviewerLabel }}<span v-if="review.decision_date"> · {{ review.decision_date }}</span>
        </div>
        <div v-if="review.feedback" class="text-sm text-foreground whitespace-pre-wrap" v-html="review.feedback" />
        <a v-if="review.markup_file" :href="review.markup_file" target="_blank"
           class="text-xs text-primary hover:underline mt-2 inline-block">📎 Markup file</a>
      </div>
    </div>
  </div>
</template>
