# Changelog

All notable changes to `@enirman/ui`.

This project follows [semver](https://semver.org/): major = public API
change, minor = new components/variants/tokens, patch = fixes.

---

## 4.0.4

- **`EuiActivityFeed` activity avatars use identity swatches** —
  deterministic saturated tone per actor (mockup Recent-activity look)
  instead of one pale info chip for everyone; single-word names get
  two-letter initials (ram → RA).

## 4.0.3

- **`PageContainer` is full-bleed** — the mockup's `.page` runs
  edge-to-edge from the sidebar with 24/20px padding; the old centered
  `max-w-[1440px]` created dead gutters on wide monitors.
  `size="narrow"` still centers at 960px for forms.

## 4.0.2

Density pass — card anatomy now measures identical to the mockup.

- `Card` radius 10px (was 8); `CardHeader` 16/12px padding (was 16/16).
- `StatCard`: label is sentence-case 12px/500 (was uppercase tracked),
  4px label→value gap (was 12px), 16/14px tile padding, 11px footer.

## 4.0.1

The "liveliness" patch — fixes the scale regression that made the whole
app render at 87.5% of the mockup's size.

- **16px rem root restored.** theme.css set `html { font-size: 14px }`
  (v2 "ERP density"), silently shrinking every rem-based utility —
  h-8 buttons to 28px, w-80 search to 280px, radii, paddings. Density
  now comes from the 14px *body* text (exactly how the mockup's
  `.ds-base` works); the coordinate system is full-size.
- `--card` → pure white (mockup cards sit crisp on the cool canvas).
- `--sidebar` hue corrected to the exact navy-800 `#0F2238`.
- PageHeader h1 → 24px/700/−0.015em (mockup page header); subtitle 13px.
- SidebarItem rest state → font-medium, white/75 (mockup `.sb-item`).

## 4.0.0

The "eNirman Connect Redesign" release — the library now matches the v4
design mockup screen-for-screen and drops every pre-v3 legacy pattern.

### Breaking

- **Removed 11 legacy components** (zero usage in any consumer; no v4
  mockup pattern): `EuiCategoryRail`, `EuiCdeStateBadge`,
  `EuiDesignItemCard`, `EuiDesignItemList`, `EuiHandoffCard`,
  `EuiPhaseKanban`, `EuiPhaseRail`, `EuiPhaseTable`, `EuiSparkline`,
  `EuiStageBadge`, `EuiBlockBadge`.
- **`StatCard`**: `spark` prop removed (mockup tiles carry a toned caption,
  not a sparkline); display value is 26px tabular.
- **`StatusBadge`**: `Planning` is now neutral gray (colored stages start
  at design); added `Structural Design` (info), `Live` (success),
  `Not Subscribed` (warning).
- **Brand assets**: `logo.svg` / `logo-light.svg` now read
  **enirmanConnect** (amber `Connect`); same filenames and exports.

### Added

- **`StatCard.descriptionTone`** — `success` / `destructive` / `neutral`
  caption ink ("+2 this month" green, "2 overdue" red).
- **`EuiActivityFeed`**: new `activity` entry kind (avatar + rich text +
  timestamp — the dashboard "Recent activity" anatomy) and an `order`
  prop (`desc` for recent-first cards).
- **Playground** (`yarn play`): local Vite harness that mounts every
  component with mockup-mirroring data for release verification.

### Fixed

- **Dark-mode token debt cleared** — `EuiFileViewer` and `EuiActivityFeed`
  no longer use raw brand / frappe-ui classes; `check:tokens` passes with
  zero warnings. `EuiFileViewer` gets the mockup's navy mono file header;
  its E2K card uses the structural success tone.

---

## 3.2.0

- **`EuiProjectTimeline` actual bars take a `tone`.** `primary` / `info` /
  `plus` / `warning` / `success` / `neutral` / `municipal`. The old
  `phase: 'design' | 'municipal'` still works as an alias, so existing
  calls are unchanged. Needed because consumers colour bars per workflow
  stage, and two colours weren't enough.
- Fixed: the `neutral` bar was `bg-muted` with muted ink — effectively
  illegible. It is now a solid `bg-muted-foreground` bar with
  background-coloured text.

**Know before you colour-code:** `theme.css` gives `--primary` and
`--info` the *same* blue, and `--plus` and `--warning` the *same* amber.
Only three saturated hues are actually distinguishable. Don't rely on
those pairs to separate two things the reader must tell apart.

---

## 3.1.0

`EuiProjectTimeline` gains the two things a real date window needs. Both
are additive — existing calls render exactly as before.

- **Proportional period columns.** `months` now accepts
  `{ label, days }` or `{ label, widthPct }` alongside plain strings.
  Values are normalised to sum to 100, so gridlines land on the true
  period boundaries. Real calendars are uneven — Gregorian months run
  28–31 days, Bikram Sambat months 29–32 — and with equal columns the
  bars drifted from the gridlines by up to ~5%. Plain strings still
  divide the track evenly.

  ```js
  // before (still works): equal columns
  :months="['Bai', 'Jet', 'Asa', 'Shr']"
  // now: true widths — pairs with walkBsMonths()
  :months="[{ label: 'Bai', days: 31 }, { label: 'Jet', days: 32 }, …]"
  ```

- **`minWidth` (px) enables horizontal scrolling.** Without it, a long
  window compresses bars into unreadable slivers. With it the chart
  scrolls and the label column stays pinned. Default `0` = fit, no
  scroll, unchanged behaviour.

- Gridlines are now drawn once across all rows at their real offsets,
  rather than as a repeating `linear-gradient` that assumed equal months.
- Fixed: when scrolled, period labels slid underneath the label column
  (the header's spacer cell wasn't pinned).

---

## 3.0.2

- **`EuiBlockBadge` was broken in dark mode.** Its four accent chips used
  `--brand-*-50` / `--gray-50` backgrounds, which are absolute swatches
  and never flip, so the chips stayed pale on the dark canvas. (Its own
  `null` branch already used `hsl(var(--muted))` correctly.) The accents
  now use the `info` / `warning` / `success` / neutral tone families,
  matching the discipline-tag convention. `plus` is intentionally skipped:
  `theme.css` re-routes it to amber, so it collides with `warning`.

### Tooling (not shipped in the package)

- **`npm run check:tokens`** fails on any surface painted with a colour
  that doesn't flip in dark mode. Mark a deliberate identity colour with a
  `theme-token-ok` comment.
- **`npm run check:drift`** refuses to publish when the registry holds
  files this tree would drop — the failure mode that nearly deleted
  `ConfirmDialog.vue` when 1.4.2/1.4.3 were published from an uncommitted
  tree.
- Both run automatically via `prepublishOnly`.

---

## 3.0.1

Fixes found by rendering the v3 components in a browser for the first
time. No API changes.

- **`EuiProjectTimeline` was broken in dark mode.** The estimated bars,
  gridlines, today line and legend swatch used the raw `--gray-*` /
  `--brand-*` scales. Those are absolute swatches — `theme.css` does not
  flip them for dark mode — so the estimated bars painted as solid white
  slabs on the dark canvas. They now use semantic tokens (`--border`,
  `--border-strong`, `--muted`, `--primary`). The amber municipal bar is
  unchanged: it's a deliberate brand accent, legible in both themes.
- **`EuiStatusFlow` now shows ✓ on an approved current step.** It always
  printed the step number; the mockup shows a check when the current step
  is itself an approval. Keys off `tone === 'success'`, number otherwise.

If you use `EuiProjectTimeline`, upgrade — 3.0.0 is unusable in dark mode.

---

## 3.0.0

The **v3 redesign** (`docs/ENIRMAN_UI_V3_HANDOFF.md`), built against the
`docs/v3-demo.html` mockup. No design-token changes — `theme.css` is
untouched.

### The core rule

**One colored status element per row/entity.** Colour is the scarcest
signal on a dense screen, so it is spent on workflow status and nothing
else. Everything that competed with it is demoted to text. See
`docs/COMPONENTS.md` → *Status, revisions & versions*.

### Breaking

**`EuiStatusFlow` — replaced with a vertical stepper.**

The horizontal chip-and-arrow row is gone. The `statuses` and `current`
props were removed in favour of a single `steps` array.

```diff
- <EuiStatusFlow :statuses="['Draft','Internal Review','Sent to Client']"
-                current="Internal Review" />
+ <EuiStatusFlow :steps="[
+   { label: 'Draft',           state: 'done',    meta: '12 Jan · ram' },
+   { label: 'Internal review', state: 'current', tone: 'info',
+     meta: 'with Anup since 18 Feb', elapsed: '36 days' },
+   { label: 'Sent to client',  state: 'upcoming' },
+   { label: 'Client approved', state: 'next' },
+ ]" />
```

`state` is `done | current | upcoming | next` (default `upcoming`).
`tone` accents the current step: `info | success | warning | destructive`
(default `info`). `elapsed` renders in danger ink.

**`EuiDesignItemPane` — restructured into a tabbed panel.**

The fixed `w-[340px]` aside with a mixed badge row and a flat button list
is gone. It is now a tabbed panel (Workflow / Versions / Reviews /
History) built from grouped clusters, and it is resizable and
collapsible.

Removed props: `versions` is still accepted, but the pane now takes
`steps`, `reviews`, `notes`, `history`, `options`, `activeOption`,
`sharedWith`, `decisionActions`, `destructiveActions`, `primaryAction`,
`storageKey`, `defaultWidth`, `minWidth`, `maxWidth`.

Removed emits: `forward`, `approve`, `reject`, `send-to-client`,
`add-option`, `reassign`, `upload-file`, `replace-file`, `remove-file`.
Replaced by `primary`, `decision`, `destructive`, `select-option`,
`view-older`, `select-version`, `manage-sharing`, `tab-change`.

The `primaryLabel` status switch is unchanged. Decision actions render as
bordered tone cards; destructive operations (retract approval, revoke
access) now live behind a collapsed "Destructive actions" disclosure and
are never inline. Panel width and open state persist to `localStorage`
under `storageKey` (default `eui-design-pane`).

**`StatusBadge` — revision types removed from the tone map.**

`Initial`, `Complete Redesign`, `Major Revision` and `Minor Correction`
are context, not state. Passing one now falls back to the `default` gray
tone. Render revision types as muted text at the call site instead.

```diff
- <StatusBadge :status="design.revision_type" />
+ <span class="text-xs text-muted-foreground">{{ design.revision_type }}</span>
```

`StatusBadge` also gained a `dot` prop (default `true`) forwarded to
`Badge`'s `with-dot`. Overdue counters ("36 days in review") are no
longer part of the badge — render them as a separate `text-danger`
caption.

### Added

- **`EuiOlderVersionsRow`** — the expandable tinted sub-row behind a list
  table's "N older" link. Each line is mono version + dot+ink status +
  muted cause/date. Old versions no longer stack as full table rows.
- **`EuiProjectTimeline`** — dashboard Gantt. A 200px label column plus a
  month track with hairline gridlines; per project an estimated bar
  (dashed) above the actual phase bars (design = primary, municipal =
  amber); a today line; a legend; and a Week/Month/Quarter control.

### Changed

- **`EuiReviewCard`** — restyled to a left-border accent card (3px tone
  rail, tinted background, right-only rounded corners). The three outline
  badges (type / round / decision) are gone; the decision *is* the card's
  tone. Header is the decision word in tone ink + a mono version
  transition + the date. Internal notes are deliberately not rendered
  here — they belong in a separate flat list so client feedback and
  internal chatter stay visually distinct. Compatible with the existing
  review-entry fields (`decision`, `decision_date`, `feedback`,
  `markup_file`).
- **`EuiVersionTimeline`** — one card per version. The current version
  gets `border-info` + `bg-info-muted` and a `current` chip. Each entry
  shows one status (dot + ink, right-aligned), a one-line human
  description, and a meta row (PDF · author · timestamp). A version
  carrying `revisions: []` collapses to `v1 · N revisions` and expands.
- **`docs/COMPONENTS.md`** — documents the core rule, the demotion table,
  the table conventions, and the workflow components.

### Fixed

- Recovered `ConfirmDialog`, the `StatCard` `showArrow` prop, and the
  dialog barrel export. These shipped in 1.4.2/1.4.3 but their source was
  never committed, so they existed only inside the published tarball.

### Migration

1. Update `EuiStatusFlow` call sites to the `steps` array.
2. Update `EuiDesignItemPane` call sites to the new props and emits.
3. Stop passing revision types to `StatusBadge`; render them as muted
   text per the demotion table in `docs/COMPONENTS.md`.
4. Everything else is source-compatible.

---

## 1.4.3 and earlier

Not tracked here. See `git log` and the npm release history.
