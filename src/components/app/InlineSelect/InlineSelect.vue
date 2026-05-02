<script setup>
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

/*
 * InlineSelect — native <select> styled to v2 form spec.
 *
 * Why native, not reka-ui Select?
 *   reka-ui's Select uses a portal which fights with Dialog overlays:
 *     - portal:disabled → reka loses positioning
 *     - portal:enabled  → option clicks get eaten by the dialog's
 *                         pointer-events trap
 *   The browser's native <select> is rendered outside the document
 *   flow by the OS, so neither problem applies.
 *
 * Props:
 *   label, required, placeholder, options, disabled
 *   v-model — value binding (string or number)
 *   options — array of strings or {label, value, disabled?} objects
 */

const props = defineProps({
  label:       { type: String, default: '' },
  required:    { type: Boolean, default: false },
  placeholder: { type: String, default: 'Select option' },
  options:     { type: Array, default: () => [] },
  disabled:    { type: Boolean, default: false },
})

const model = defineModel({ type: [String, Number], default: '' })

const normalized = computed(() =>
  (props.options || [])
    .map(o => (typeof o === 'string' ? { label: o, value: o } : o))
    .filter(o => o && o.value !== undefined && o.value !== null),
)
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-xs font-medium text-foreground">
      {{ label }}<span v-if="required" class="text-destructive"> *</span>
    </label>
    <div class="relative">
      <select
        v-model="model"
        :disabled="disabled"
        :required="required"
        class="w-full appearance-none rounded-md border border-input bg-card px-2.5 pr-8 h-8 py-1 text-sm text-foreground transition-colors duration-fast ease-out-expo cursor-pointer outline-none shadow-xs focus-visible:border-ring focus-visible:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="opt in normalized"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >{{ opt.label ?? opt.value }}</option>
      </select>
      <ChevronDown
        class="size-4 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  </div>
</template>
