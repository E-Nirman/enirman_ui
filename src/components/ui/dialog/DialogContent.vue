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

/*
 * Popover / select / autocomplete menus opened inside a Dialog portal
 * their list to `document.body`, outside the Dialog's DOM subtree. Two
 * failure modes follow:
 *
 *   1. The click lands inside the portal (selecting an option). Reka
 *      sees a click outside DialogContent and dismisses the Dialog.
 *   2. The click lands inside the Dialog but outside the popper while
 *      the popper is still open. The popper closes, but because
 *      frappe-ui ships its own reka-ui copy the DismissableLayer stacks
 *      don't coordinate across package boundaries — so the Dialog's
 *      pointer-down-outside still fires.
 *
 * Guard: swallow the Dialog's dismiss whenever either the event target
 * is inside a known popper *or* any popper is currently mounted in the
 * DOM. The user's second click (after the popper has closed) still
 * dismisses the Dialog normally, and Escape / true backdrop clicks are
 * untouched.
 */
const PORTAL_SELECTORS = [
  '.el-popper',
  '.el-dropdown-menu',
  '.el-select-dropdown',
  '.el-picker-panel',
  '[data-reka-popper-content-wrapper]',
  '[data-reka-menu-content]',
  '[data-reka-select-content]',
  '[data-reka-popover-content]',
  '[data-reka-combobox-content]',
  '[data-reka-dropdown-menu-content]',
  '[data-sonner-toaster]',
].join(',')

// "Is any popper currently OPEN?" — must exclude permanently-mounted
// portals like the Sonner toast container, otherwise the dialog can
// never be dismissed by an outside click.
const OPEN_PORTAL_SELECTORS = [
  '[data-reka-popper-content-wrapper]',
  '[data-reka-menu-content][data-state="open"]',
  '[data-reka-select-content][data-state="open"]',
  '[data-reka-popover-content][data-state="open"]',
  '[data-reka-combobox-content][data-state="open"]',
  '[data-reka-dropdown-menu-content][data-state="open"]',
  '.el-popper:not([style*="display: none"])',
].join(',')

// Reka unmounts a popper synchronously when its DismissableLayer
// processes an outside pointerdown — by the time the Dialog's
// pointer-down-outside fires, document.querySelector returns null and
// the live DOM check above can't see "a popper was just open." Latch
// the answer at capture-phase pointerdown (before any DismissableLayer
// runs) and let the guard read the latch.
let pointerDownHadOpenPortal = false
let captureInstalled = false

function installPointerDownCapture() {
  if (captureInstalled || typeof document === 'undefined') return
  captureInstalled = true
  document.addEventListener('pointerdown', () => {
    if (document.querySelector(OPEN_PORTAL_SELECTORS)) {
      pointerDownHadOpenPortal = true
      // queueMicrotask drains after all synchronous reka handlers fire
      // (that's when pointer-down-outside is emitted) but before any
      // subsequent user interaction.
      queueMicrotask(() => { pointerDownHadOpenPortal = false })
    }
  }, true)
}
installPointerDownCapture()

function guardOutside(event) {
  const target = event.target
  if (target && typeof target.closest === 'function' && target.closest(PORTAL_SELECTORS)) {
    event.preventDefault()
    return
  }
  if (pointerDownHadOpenPortal) {
    event.preventDefault()
    return
  }
  if (typeof document !== 'undefined' && document.querySelector(OPEN_PORTAL_SELECTORS)) {
    event.preventDefault()
  }
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm
             data-[state=open]:animate-in data-[state=closed]:animate-out
             data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      :class="cn(variants({ size }), props.class)"
      @pointer-down-outside="guardOutside"
      @interact-outside="guardOutside"
    >
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
