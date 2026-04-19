<script setup>
import { DialogContent, DialogOverlay, DialogPortal, DialogClose } from 'reka-ui'
import { X } from 'lucide-vue-next'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  size:        { type: String, default: 'md' },
  showClose:   { type: Boolean, default: true },
  class:       { type: [String, Array, Object], default: '' },
})

const variants = cva(
  [
    'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4',
    'border bg-background p-6 shadow-lg duration-200',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
    'sm:rounded-lg',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm
             data-[state=open]:animate-in data-[state=closed]:animate-out
             data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent :class="cn(variants({ size }), props.class)">
      <slot />
      <DialogClose
        v-if="showClose"
        class="absolute right-4 top-4 rounded-sm opacity-60 ring-offset-background transition-opacity
               hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
               disabled:pointer-events-none"
      >
        <X class="size-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
