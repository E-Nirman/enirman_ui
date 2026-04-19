<script setup>
import { DialogContent, DialogOverlay, DialogPortal, DialogClose } from 'reka-ui'
import { X } from 'lucide-vue-next'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  side:      { type: String, default: 'right' },
  showClose: { type: Boolean, default: true },
  class:     { type: [String, Array, Object], default: '' },
})

const variants = cva(
  [
    'fixed z-50 gap-4 bg-background p-0 shadow-xl transition ease-in-out',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-300 data-[state=open]:duration-500',
  ],
  {
    variants: {
      side: {
        top:    'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left:   'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:  'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md',
      },
    },
    defaultVariants: { side: 'right' },
  },
)

// Same guard as DialogContent — keeps the sheet open when the user
// clicks an option in a portaled menu/select opened inside it.
const PORTAL_SELECTORS = [
  '.el-popper', '.el-dropdown-menu', '.el-select-dropdown', '.el-picker-panel',
  '[data-reka-popper-content-wrapper]',
  '[data-reka-menu-content]',
  '[data-reka-select-content]',
  '[data-reka-popover-content]',
  '[data-reka-combobox-content]',
  '[data-reka-dropdown-menu-content]',
  '[data-sonner-toaster]',
].join(',')
function guardOutside(event) {
  const target = event.target
  if (target && typeof target.closest === 'function' && target.closest(PORTAL_SELECTORS)) {
    event.preventDefault()
  }
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm
                          data-[state=open]:animate-in data-[state=closed]:animate-out
                          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogContent
      :class="cn(variants({ side }), props.class)"
      @pointer-down-outside="guardOutside"
      @interact-outside="guardOutside"
    >
      <slot />
      <DialogClose
        v-if="showClose"
        class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100
               focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      >
        <X class="size-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
