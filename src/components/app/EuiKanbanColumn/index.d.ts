import type { DefineComponent } from 'vue'

export const EuiKanbanColumn: DefineComponent<{
  label: string
  count?: number
  tone?: 'neutral' | 'info' | 'success' | 'warning'
}>
