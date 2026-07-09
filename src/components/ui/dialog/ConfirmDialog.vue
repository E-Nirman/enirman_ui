<template>
  <Dialog v-model:open="show">
    <DialogContent size="sm">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <p class="text-sm text-muted-foreground">{{ message }}</p>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="ghost" :disabled="loading" @click="$emit('cancel')">
            {{ cancelLabel }}
          </Button>
        </DialogClose>
        <Button
          :variant="confirmVariant"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ loading ? loadingLabel : confirmLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import Dialog from './Dialog.vue'
import DialogContent from './DialogContent.vue'
import DialogHeader from './DialogHeader.vue'
import DialogTitle from './DialogTitle.vue'
import DialogFooter from './DialogFooter.vue'
import DialogClose from './DialogClose.vue'
import Button from '../button/Button.vue'

defineProps({
  title:          { type: String, required: true },
  message:        { type: String, required: true },
  confirmLabel:   { type: String, default: 'Confirm' },
  cancelLabel:    { type: String, default: 'Cancel' },
  loadingLabel:   { type: String, default: 'Working…' },
  confirmVariant: { type: String, default: 'default' },
  loading:        { type: Boolean, default: false },
})

defineEmits(['confirm', 'cancel'])

const show = defineModel('open', { type: Boolean, default: false })
</script>
