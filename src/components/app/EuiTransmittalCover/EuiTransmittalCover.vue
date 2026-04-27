<script setup>
defineOptions({ name: 'EuiTransmittalCover' })

defineProps({ tr: { type: Object, default: null } })
</script>

<template>
  <div v-if="tr" class="bg-card border border-border rounded-md p-6 font-serif text-[12.5px] space-y-3 max-w-[640px]">
    <div class="text-[11px] uppercase tracking-wide text-muted-foreground">{{ tr.from_org_label || '—' }}</div>
    <div class="text-lg font-bold">DOCUMENT TRANSMITTAL</div>
    <div class="text-muted-foreground font-mono">{{ tr.name }} · {{ tr.issue_date || 'Draft' }}</div>
    <hr class="border-border">
    <div><b>Project:</b> {{ tr.dpr }}</div>
    <div><b>Subject:</b> {{ tr.subject }}</div>
    <div><b>Purpose:</b> {{ tr.purpose }}</div>
    <div><b>Reply by:</b> {{ tr.reply_by_date || '—' }}</div>

    <div v-if="tr.recipients?.length" class="space-y-1">
      <div class="text-[11px] uppercase text-muted-foreground">Recipients</div>
      <div v-for="r in tr.recipients" :key="r.idx" class="text-[11.5px]">
        <span class="inline-block w-10 font-mono text-muted-foreground">{{ r.disposition }}</span>
        {{ r.recipient_name_snapshot || r.recipient_user }}
        <span v-if="r.organization_snapshot" class="text-muted-foreground"> · {{ r.organization_snapshot }}</span>
      </div>
    </div>

    <div v-if="tr.cover_message" class="whitespace-pre-wrap pt-2 border-t border-border" v-html="tr.cover_message"></div>

    <table v-if="tr.documents?.length" class="w-full mt-3 text-[11.5px] border-t border-border">
      <thead>
        <tr class="border-b border-border">
          <th class="text-left p-1">Sheet</th>
          <th class="text-left p-1">Title</th>
          <th class="text-center p-1">Rev</th>
          <th class="text-left p-1">Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in tr.documents" :key="d.idx" class="border-b border-border">
          <td class="p-1 font-mono">{{ d.sheet_number_snapshot || d.subject_name }}</td>
          <td class="p-1">{{ d.title_snapshot || '—' }}</td>
          <td class="p-1 text-center font-mono">{{ d.rev_snapshot || '—' }}</td>
          <td class="p-1">{{ d.purpose_pill }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
