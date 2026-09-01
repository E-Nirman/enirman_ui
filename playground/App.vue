<script setup>
import { ref } from 'vue'
import {
  StatusBadge, StatCard, EuiStatusFlow, EuiDesignItemPane,
  EuiVersionTimeline, EuiReviewCard, EuiOlderVersionsRow,
  EuiProjectTimeline, EuiActivityFeed, EuiFileViewer,
  EuiKanbanColumn, EuiKanbanCard,
  AppShell, SidebarItem, SidebarSection, TooltipProvider,
} from '@enirman/ui'

/* ── mockup data (mirrors eNirman Connect Redesign.dc.html) ─────────── */

const dark = ref(false)
const toggleDark = () => {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  document.documentElement.setAttribute('data-theme', dark.value ? 'dark' : 'light')
}

const badgeStatuses = [
  'Draft', 'Internal Review', 'Sent to Client', 'Reviewer Approved',
  'Client Approved', 'Needs Redesign', 'Needs Correction', 'Planning',
  'Structural Design', 'Live', 'Not Subscribed',
]

/* Design Detail — review state (mockup design-detail.jpeg) */
const stepsReview = [
  { label: 'Draft', state: 'done', meta: '12 Jan · ram' },
  { label: 'Internal review', state: 'current', tone: 'info', meta: 'with Anup since 18 Feb', elapsed: '36 days' },
  { label: 'Sent to client', state: 'upcoming' },
  { label: 'Client approved', state: 'upcoming' },
]
/* Design Detail — approved state (mockup design-detail-approved.jpeg) */
const stepsApproved = [
  { label: 'Draft', state: 'done', meta: '18 Feb · ram' },
  { label: 'Internal review', state: 'done', meta: '18 Feb · Anup' },
  { label: 'Sent to client', state: 'done', meta: '18 Feb · WhatsApp' },
  { label: 'Client approved', state: 'current', tone: 'success', meta: '18 Feb · 16:14', quote: 'v2 ok' },
  { label: 'Municipal submission', state: 'next' },
]

const paneItem = {
  status: 'Internal Review',
  version_label: 'v1',
  category: 'Initial',
  revision_context: 'Initial version — no client feedback yet',
  older_versions_count: 0,
}
const paneDecisions = [
  { key: 'redesign', label: 'Request redesign', tone: 'destructive', description: 'Major changes needed — send back to the designer or delegate to a new one.' },
  { key: 'correction', label: 'Request correction', tone: 'warning', description: 'Minor fixes needed — send back to the designer.' },
  { key: 'structural', label: 'Forward for structural analysis', tone: 'neutral', description: 'Share with the structural engineer for their work.' },
]
const paneDestructive = [
  { key: 'retract', label: 'Retract approval', description: 'Reopens the review cycle for this version.' },
  { key: 'revoke', label: 'Revoke access', description: 'Removes shared access for collaborators.' },
]
const paneVersions = [
  { name: 'v2', version_label: 'v2', status: 'Client Approved', is_current: true, description: 'Complete redesign of v1 — requested by client', pdf_url: '#', author: 'ram', modified: '18 Feb · 16:10' },
  { name: 'v1', version_label: 'v1', status: 'Client: Redesign', revisions: [
    { version_label: 'v1.2', status: 'Client: Redesign', meta: 'client asked for full redesign · 17 Feb' },
    { version_label: 'v1.1', status: 'Needs Correction', meta: 'minor correction · 15 Feb' },
  ] },
]
const paneReviews = [
  { name: 'r1', decision: 'Client Approved', version_from: 'v1.1.1', version_to: 'v2', decision_date: '18 Feb', feedback: 'v2 ok' },
  { name: 'r2', decision: 'Needs Correction', version_from: 'v1.1', version_to: 'v1.1.1', decision_date: '15 Feb', feedback: 'Client asked for a minor correction' },
]
const paneNotes = [
  { name: 'n1', initials: 'RM', name_: 'ram', name: 'ram', note_type: 'Internal', quote: 'Fixed column offsets before client send.', version: 'v1.1' },
]
const paneShared = [
  { name: 'shyam', initials: 'SH', role: 'Structural designer', access: 'ARCH + 3D access' },
]
const paneHistory = [
  { time: '18 Feb 16:14', text: 'Client approved v2 via WhatsApp' },
  { time: '18 Feb 13:06', text: 'v2 sent to client' },
  { time: '12 Jan 10:02', text: 'ram uploaded v1 draft' },
]

const olderVersions = [
  { version_label: 'v1.2', status: 'Client: Redesign', meta: 'client asked for full redesign · 17 Feb' },
  { version_label: 'v1.1', status: 'Needs Correction', meta: 'minor correction · 15 Feb' },
  { version_label: 'v1',   status: 'Internal Review',  meta: 'initial upload · 12 Jan' },
]

/* Dashboard Gantt (mockup dashboard.jpeg) */
const granularity = ref('month')
const ganttMonths = ['BAI', 'JET', 'ASA', 'SHR']
const ganttProjects = [
  { title: 'Project for Test Cut 3', code: 'DPR-…-0003', status: 'Planning',
    estimated: { start: 52, width: 32 },
    actual: [{ label: 'PLAN', start: 51, width: 24, tone: 'primary' }] },
  { title: 'Proj tect cust 2 -2', code: 'DPR-…-0002', status: 'Structural',
    estimated: { start: 36, width: 47 },
    actual: [
      { label: 'STR', start: 36, width: 15, tone: 'primary' },
      { label: 'MUNICIPAL', start: 52, width: 24, tone: 'municipal' },
    ] },
  { title: 'Project for test cust - 2', code: 'DPR-…-0001', status: 'Planning',
    actual: [{ label: '', start: 21, width: 2, tone: 'primary' }] },
]

/* Recent activity (mockup dashboard-2.jpeg) — avatar rows, newest first */
const activity = [
  { kind: 'activity', id: 'a1', actor: 'ram', html: '<strong>ram</strong> uploaded v2 PDF to <code>ARCH-36425-26-0008</code>', timestamp: '18 Feb · 16:10' },
  { kind: 'activity', id: 'a2', actor: 'Client', html: 'Client requested a <a class="text-info-ink">minor correction</a> on v1.1.1', timestamp: '18 Feb · 15:27' },
  { kind: 'activity', id: 'a3', actor: 'shyam', html: '<strong>shyam</strong> was granted structural access on Proj tect cust 2', timestamp: '18 Feb · 14:02' },
  { kind: 'activity', id: 'a4', actor: 'WA', html: 'Quotation <code>QTN-0043</code> shared with client via WhatsApp', timestamp: '17 Feb · 11:48' },
]
</script>

<template>
  <TooltipProvider>
  <div class="min-h-screen bg-background p-8 text-foreground">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-10">
      <header class="flex items-center gap-4">
        <h1 class="text-xl font-bold">@enirman/ui v4 playground</h1>
        <button class="ml-auto rounded-md border border-border-subtle px-3 py-1.5 text-xs font-semibold hover:bg-muted" @click="toggleDark">
          {{ dark ? 'Light' : 'Dark' }} mode
        </button>
      </header>

      <!-- AppShell + Sidebar -->
      <section id="app-shell-sidebar">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">AppShell + Sidebar</h2>
        <AppShell>
          <template #sidebar="{ collapsed }">
            <SidebarSection label="Overview">
              <SidebarItem label="Dashboard" :collapsed="collapsed" active />
              <SidebarItem label="Projects" :collapsed="collapsed" :badge="3" />
            </SidebarSection>
            <SidebarSection label="Design management">
              <SidebarItem label="Design Hub" :collapsed="collapsed" :badge="12" />
              <SidebarItem label="Drawing Hub" :collapsed="collapsed" />
            </SidebarSection>
          </template>
          <template #topbar>
            <span class="text-sm font-medium">Playground content area</span>
          </template>
          <div class="p-6 text-sm text-muted-foreground">Sidebar demo content.</div>
        </AppShell>
      </section>

      <!-- StatusBadge -->
      <section id="status-badge">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">StatusBadge</h2>
        <div class="flex flex-wrap gap-2 rounded-xl border border-border-subtle bg-card p-4">
          <StatusBadge v-for="s in badgeStatuses" :key="s" :status="s" />
        </div>
      </section>

      <!-- Stat tiles -->
      <section id="stat-cards">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">StatCard (dashboard tiles)</h2>
        <div class="grid grid-cols-4 gap-3">
          <StatCard label="Active DPRs" :value="12" description="+2 this month" description-tone="success" />
          <StatCard label="Drawings in review" :value="4" description="2 overdue" description-tone="warning" />
          <StatCard label="Awaiting client" :value="3" description="avg 4 days out" />
          <StatCard label="Municipal in progress" :value="2" description="1 checklist pending" />
          <StatCard label="Failed syncs" :value="1" description="1 error" description-tone="destructive" />
        </div>
      </section>

      <!-- StatusFlow -->
      <section id="status-flow" class="grid grid-cols-2 gap-6">
        <div>
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiStatusFlow — review</h2>
          <div class="rounded-xl border border-border-subtle bg-card p-4"><EuiStatusFlow :steps="stepsReview" /></div>
        </div>
        <div>
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiStatusFlow — approved</h2>
          <div class="rounded-xl border border-border-subtle bg-card p-4"><EuiStatusFlow :steps="stepsApproved" /></div>
        </div>
      </section>

      <!-- DesignItemPane -->
      <section id="design-pane">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiDesignItemPane</h2>
        <div class="flex h-[560px] justify-end rounded-xl border border-border-subtle bg-background p-3">
          <EuiDesignItemPane
            :item="paneItem" :steps="stepsReview" :versions="paneVersions" :reviews="paneReviews"
            :notes="paneNotes" :history="paneHistory" :options="['Option A', 'Option B']" active-option="Option B"
            :shared-with="paneShared" :decision-actions="paneDecisions" :destructive-actions="paneDestructive"
            :primary-action="{ key: 'send', label: 'Send to client', description: 'Reviewer approved — forward for client sign-off' }"
            storage-key="pg-pane"
          />
        </div>
      </section>

      <!-- Version timeline + review cards + older versions -->
      <section id="versions" class="grid grid-cols-3 gap-6">
        <div>
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiVersionTimeline</h2>
          <EuiVersionTimeline :versions="paneVersions" />
        </div>
        <div>
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiReviewCard</h2>
          <div class="space-y-2.5">
            <EuiReviewCard v-for="r in paneReviews" :key="r.name" :review="r" />
            <EuiReviewCard :review="{ decision: 'Needs Redesign', version_from: 'v1', version_to: 'v1.2', decision_date: '17 Feb', feedback: 'Layout does not work for the site, please redesign.' }" />
          </div>
        </div>
        <div>
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiOlderVersionsRow</h2>
          <EuiOlderVersionsRow :versions="olderVersions" />
        </div>
      </section>

      <!-- Gantt -->
      <section id="gantt">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiProjectTimeline</h2>
        <EuiProjectTimeline
          title="Project timeline" subtitle="BAI '83 — SHR '83"
          :projects="ganttProjects" :months="ganttMonths" :today-pct="55"
          :granularity="granularity" @granularity-change="granularity = $event"
        />
      </section>

      <!-- Activity feed -->
      <section id="activity">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiActivityFeed</h2>
        <div class="rounded-xl border border-border-subtle bg-card p-4">
          <EuiActivityFeed :entries="activity" order="desc" />
        </div>
      </section>

      <!-- File viewer (header parity) -->
      <section id="file-viewer">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">EuiFileViewer (PDF header)</h2>
        <div class="h-[220px] overflow-hidden rounded-xl border border-border-subtle">
          <EuiFileViewer pdf-url="/v1-3D-36425-26-0002.pdf" />
        </div>
      </section>

      <!-- Kanban -->
      <section id="kanban" class="mb-10">
        <h2 class="text-lg font-semibold mb-3">Kanban</h2>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <EuiKanbanColumn label="WIP" :count="2" tone="neutral">
            <EuiKanbanCard drag-id="a">
              <div class="font-mono text-muted-foreground text-[11.5px]">PCC-VDS-ZZ-01-DR-A-1101</div>
              <div class="font-medium text-[13px]">Level 1 floor plan</div>
            </EuiKanbanCard>
            <EuiKanbanCard drag-id="b">
              <div class="font-mono text-muted-foreground text-[11.5px]">PCC-HSC-ZZ-02-DR-S-3104</div>
              <div class="font-medium text-[13px]">Core wall reinforcement</div>
            </EuiKanbanCard>
          </EuiKanbanColumn>
          <EuiKanbanColumn label="Shared" :count="1" tone="info">
            <EuiKanbanCard drag-id="c">
              <div class="font-mono text-muted-foreground text-[11.5px]">PCC-VDS-ZZ-02-DR-A-2201</div>
              <div class="font-medium text-[13px]">Level 2 GA</div>
            </EuiKanbanCard>
          </EuiKanbanColumn>
          <EuiKanbanColumn label="Published" :count="1" tone="success">
            <EuiKanbanCard drag-id="d">
              <div class="font-mono text-muted-foreground text-[11.5px]">PCC-EME-ZZ-02-DR-M-4102</div>
              <div class="font-medium text-[13px]">Ductwork layout</div>
            </EuiKanbanCard>
          </EuiKanbanColumn>
          <EuiKanbanColumn label="Archived" :count="0" tone="warning" />
        </div>
      </section>
    </div>
  </div>
  </TooltipProvider>
</template>
