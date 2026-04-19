<script setup>
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

defineExpose({ toast })

const props = defineProps({
  richColors: { type: Boolean, default: true },
  closeButton: { type: Boolean, default: true },
  position:   { type: String, default: 'bottom-right' },
})
</script>

<template>
  <Toaster
    v-bind="props"
    :toast-options="{
      classes: {
        toast:       'group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton:'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        closeButton: 'group-[.toast]:bg-card group-[.toast]:border-border group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
