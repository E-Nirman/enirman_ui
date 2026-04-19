<script setup>
import { computed, ref, watch } from 'vue'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog/index.js'
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '../ui/command/index.js'

/*
 * CommandPalette — global ⌘K launcher.
 *
 * Usage: <CommandPalette v-model:open="open" :groups="[{ heading, items: [...] }]" />
 *
 * Each item: { value, label, icon?, shortcut?, onSelect?, to? }
 *
 * The runtime passes the selected item back via `onSelect(item)`; if
 * `to` is present the palette also pushes to that route. Closes on
 * Escape by default (reka-ui Dialog handles it).
 */

const props = defineProps({
  open:   { type: Boolean, default: false },
  groups: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Search anything, or try "go to …"' },
})
const emits = defineEmits(['update:open', 'select'])

const search = ref('')

// Filter items by search term
const filteredGroups = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.groups
  return props.groups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) =>
        [item.label, item.description, item.heading]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(q)),
      ),
    }))
    .filter((g) => g.items.length > 0)
})

watch(() => props.open, (v) => { if (!v) search.value = '' })

function handleSelect(item) {
  emits('select', item)
  item.onSelect?.(item)
  emits('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emits('update:open', $event)">
    <DialogContent
      :show-close="false"
      size="lg"
      class="p-0 overflow-hidden gap-0 [&>button]:hidden"
    >
      <DialogTitle class="sr-only">Command palette</DialogTitle>
      <Command
        v-model:search-term="search"
        class="bg-transparent"
      >
        <CommandInput :placeholder="placeholder" />
        <CommandList>
          <CommandEmpty>No results for "{{ search }}"</CommandEmpty>

          <template v-for="(group, gi) in filteredGroups" :key="gi">
            <CommandGroup :heading="group.heading">
              <CommandItem
                v-for="item in group.items"
                :key="item.value"
                :value="item.value"
                @select="handleSelect(item)"
              >
                <component v-if="item.icon" :is="item.icon" class="size-4" />
                <span class="flex-1">{{ item.label }}</span>
                <span v-if="item.description" class="text-[11px] text-muted-foreground">{{ item.description }}</span>
                <span v-if="item.shortcut" class="ml-auto text-[10px] tracking-widest text-muted-foreground">
                  {{ item.shortcut }}
                </span>
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
      <div class="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1"><kbd class="rounded border border-border bg-card px-1.5 py-0.5 font-mono">↑↓</kbd> Navigate</span>
          <span class="flex items-center gap-1"><kbd class="rounded border border-border bg-card px-1.5 py-0.5 font-mono">↵</kbd> Select</span>
        </div>
        <span class="flex items-center gap-1"><kbd class="rounded border border-border bg-card px-1.5 py-0.5 font-mono">esc</kbd> Close</span>
      </div>
    </DialogContent>
  </Dialog>
</template>
