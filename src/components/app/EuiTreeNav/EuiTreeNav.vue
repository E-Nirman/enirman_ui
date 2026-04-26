<script setup>
import { ref, computed } from 'vue'
defineOptions({ name: 'EuiTreeNav' })
const props = defineProps({
  sections: { type: Array, required: true },
  selected: { type: String, default: null },
})
const emit = defineEmits(['select'])

const allItems = computed(() => props.sections.flatMap(s => s.items.map(i => ({ ...i, section: s.label }))))
const mobileValue = ref(props.selected)

function pickFromMobile(e) {
  const item = allItems.value.find(i => i.key === e.target.value)
  if (item) emit('select', item)
}
</script>

<template>
  <!-- Mobile: select -->
  <div class="md:hidden p-3 border-b border-border bg-card">
    <select
      :value="selected"
      @change="pickFromMobile"
      class="w-full h-9 px-3 rounded-md border border-border bg-background text-foreground text-sm"
    >
      <optgroup v-for="s in sections" :key="s.label" :label="s.label">
        <option v-for="i in s.items" :key="i.key" :value="i.key">{{ i.label }}</option>
      </optgroup>
    </select>
  </div>

  <!-- Desktop: tree -->
  <aside class="hidden md:block bg-card border-r border-border overflow-y-auto py-3">
    <div v-for="s in sections" :key="s.label" class="px-3 mb-1.5">
      <div class="text-[10.5px] uppercase tracking-wider text-muted-foreground/80 font-semibold py-2 px-2">
        {{ s.label }}
      </div>
      <button
        v-for="i in s.items"
        :key="i.key"
        type="button"
        class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] text-foreground transition-colors"
        :class="[
          selected === i.key ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted',
          i.nested ? 'pl-7' : '',
        ]"
        @click="emit('select', i)"
      >
        <span class="flex-1 text-left truncate">{{ i.label }}</span>
        <span v-if="i.count !== undefined && i.count !== null"
              class="font-mono text-[11px] text-muted-foreground/70">
          {{ i.count }}
        </span>
      </button>
    </div>
  </aside>
</template>
