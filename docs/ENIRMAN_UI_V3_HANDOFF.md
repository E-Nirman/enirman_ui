# enirman_ui v3 — Redesign Handoff

Source of truth: `eNirman Connect Redesign.dc.html` in this design project (live reference).
Tokens: **no changes** — everything uses the existing `src/theme.css` v2 values.

The redesign is a set of component API changes + usage conventions. Suggested
release: **v3 branch** (Badge usage conventions are breaking for consumers).

---

## The core rule (new convention, document in COMPONENTS.md)

**One colored status element per row/entity.** Everything else is demoted:

| Information | Old (v2) | New (v3) |
|---|---|---|
| Workflow status | Badge (one of many) | The ONLY Badge — tinted pill, dot prefix |
| Version (`v1.1.1`) | `<Badge variant="outline">` | Plain `font-mono text-xs font-semibold` text, no chip |
| Option (`OPT A`) | Badge | Mono text in a hairline border box, `text-[10px]`, gray |
| Revision type (`Complete Redesign`) | StatusBadge (colored!) | Muted two-line text: `Complete redesign` + `✓ redesign done` in success ink |
| Routing (`→ Structural · shyam`) | Badge | Avatar (20px) + muted name text |
| Discipline (`ARCH/3D/STR`) | — | Tiny mono tag: ARCH=info-muted, 3D=warning-muted, STR=success-muted |

**Status → tone map** (StatusBadge.vue DEFAULT_MAP is mostly right; two changes):
- `'Sent to Client'` → stays `info` but the *semantic* is "waiting on external" — dashboard/list age alerts key off this
- **Remove revision types from StatusBadge** (`Initial`, `Complete Redesign`, `Major Revision`, `Minor Correction`) — revisions are context text, never badges. This is the main de-cluttering move.

Legend (Design Hub header): blue=in progress · amber=waiting · green=approved · red=returned.

---

## Component changes

### 1. `StatusBadge.vue` — minor
- Keep tone map for statuses; delete the "Revision types" block.
- Always render dot prefix (`dot` default true).
- Overdue counter ("36 days in review") is NOT part of the badge — it's a
  separate `text-danger` caption under the modified date.

### 2. `EuiStatusFlow.vue` — replace (breaking)
Current: horizontal chip row with arrows. New: **vertical stepper** ("Stage" cluster).
- Steps: done (16px success-filled circle + ✓, success-100 connector),
  current (success/primary-filled + 3px halo `box-shadow: 0 0 0 3px <tone>-muted`,
  bold 13px label + timestamp/quote caption), upcoming (2px gray-200 outline circle,
  muted label), future-optional (dashed circle, "— up next").
- Props: `steps: [{ label, state: 'done'|'current'|'upcoming'|'next', meta, quote }]`.
- In-review current step shows elapsed: `with Anup since 18 Feb · 36 days` (danger ink on the count).

### 3. `EuiDesignItemPane.vue` — restructure (breaking)
Current: fixed `w-[340px]` aside, mixed badge row, flat button list.
New: tabbed panel (Workflow / Versions / Reviews / History) with **grouped clusters**,
each with a `text-[10px] uppercase tracking-wider` heading + top hairline:

1. **STAGE** — EuiStatusFlow (vertical)
2. **VERSION** — Option segmented control + mono version + category tag +
   one-line revision context + "View N older versions →" link
3. **SHARED WITH** — avatar + name + access scope + ghost Manage button
4. **NEXT ACTION** — exactly one primary button (from `primaryLabel` switch, keep that logic);
   decision actions as bordered cards (title + one-line description):
   - Request redesign → `border-danger-muted`, hover `bg-danger-muted`, title `text-danger-ink`
   - Request correction → warning equivalents
   - Forward for structural analysis → neutral border
   Destructive ops (Retract approval, Revoke access) live behind a collapsed
   "Destructive actions" disclosure at the bottom — never inline.

**Resizable + collapsible** (new behavior):
- Default width 372px, drag handle on left edge (10px hit area, `cursor: col-resize`,
  3px×48px gray-200 pill grip), clamp 300–560px.
- Collapse via `»` icon button in the tab row → renders a 36px vertical strip
  (`writing-mode: vertical-rl` label "WORKFLOW PANEL" + `«`), click to reopen.
- Persist width + open state per user (localStorage).

### 4. `EuiVersionTimeline.vue` — upgrade
- Current version card: `border-info` + `bg-info-muted` container, `current` chip.
- Each entry: mono version (bold) + ONE status (dot + ink text, right-aligned) +
  one-line human description ("Client asked for a minor correction") +
  meta row (PDF link · author · timestamp).
- Collapsed revisions: `v1  ·  2 revisions` as muted text, expandable.

### 5. `EuiReviewCard.vue` — restyle
Current: three outline badges per card. New: **left-border accent card**
(3px solid tone color, tinted bg, rounded right corners only):
- Header: decision word in tone ink (`Approved` / `Correction requested` /
  `Redesign requested`) + mono version transition (`v1.1.1 → v2`) + date right.
- Body: client quote in regular 12px.
- Internal notes are a separate flat list (avatar + name + note type + quote),
  NOT cards — visual separation of client feedback vs internal chatter.

### 6. New: `EuiOlderVersionsRow`
List-table affordance: "N older" link in the version cell → expands a
`bg-gray-25` sub-row under the drawing row; each line = mono version +
dot+ink status + muted cause/date. (Replaces stacking old versions as rows.)

### 7. New: `EuiProjectTimeline` (dashboard Gantt)
- Grid: 200px label column + month track (`repeat(4, 1fr)`, hairline gridlines
  via `linear-gradient` background).
- Per project: estimated bar (dashed gray-300 border, gray-50 fill, 9px) above
  actual bar (solid, 11px, pill; phases: design=primary, municipal=amber accent
  with navy-800 label text).
- Today: 2px primary vertical line at 55% opacity spanning all rows.
- Legend: Estimated / Actual / Today. Week/Month/Quarter segmented control.
- Nepali month header labels (mono caps, e.g. BAI JET ASA SHR).

### 8. Table conventions (goes in COMPONENTS.md, applies in enirman_connect pages)
- Column clusters with hairline `border-l` separators: identity | state
  (version+status+revision) | routing | meta.
- Row identity cell: title (13px semibold) over mono code + discipline tag.
- Overdue: amber `inset 3px 0 0` left accent on the row + red caption under date.
- Tables under 1250px: wrap in `overflow-x-auto` with `min-width` on the grid.

---

## What goes where

| Change | Repo |
|---|---|
| StatusBadge map trim, EuiStatusFlow v2, EuiDesignItemPane v2, EuiVersionTimeline, EuiReviewCard, EuiOlderVersionsRow, EuiProjectTimeline, COMPONENTS.md conventions | `enirman_ui` (v3) |
| Page layouts (Design Hub grouped table, Dashboard cards, Projects/Designs/Visits lists, detail page grid) | `enirman_connect` frontend |
| Nothing | `theme.css` / tokens |

Suggested order: 1 (StatusBadge) → 5 (ReviewCard) → 2 (StatusFlow) → 4 (VersionTimeline) → 3 (DesignItemPane) → 6–7, then page migrations in enirman_connect.
