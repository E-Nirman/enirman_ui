<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiStageBadge' })

const props = defineProps({
  stage: { type: [String, Object], required: true }, // either "S3" or {code:'S3', label:'...'}
  showLabel: { type: Boolean, default: false },
})

const code = computed(() => typeof props.stage === 'string' ? props.stage : props.stage?.code)
const label = computed(() => typeof props.stage === 'object' ? props.stage?.label : null)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border-blue-500/25"
    :title="label || code"
  >
    {{ code }}<template v-if="showLabel && label"> · {{ label }}</template>
  </span>
</template>
