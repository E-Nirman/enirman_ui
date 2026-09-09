# Changelog

All notable changes to `@enirman/ui`.

This project follows [semver](https://semver.org/): major = public API
change, minor = new components/variants/tokens, patch = fixes.

---

## 5.3.0

Adds a second, orthogonal axis to the theme: **brand**. `data-brand="aec"`
(default, identical to no attribute) or `data-brand="estate"` on `<html>`,
driven by `useTheme().setBrand()`. AEC is unchanged — verified by a
Chromium-resolved cascade probe against the published 5.2.1 tarball (see
**Verification** below).

**Added**
- **Brand axis.** `brands/aec.css` widens its selectors to
  `:root, [data-brand="aec"]` and
  `[data-theme="dark"], [data-brand="aec"][data-theme="dark"]`; `:root`
  stays so a consumer that never sets `data-brand` gets exactly 5.2.1.
  `useTheme()` gains `brand` / `setBrand('aec' | 'estate')` with its own
  storage key (`enirman-brand`); setting a brand never touches the theme
  value or its key, and vice versa (unit-tested — `vitest` + `jsdom` are
  new devDependencies, `npm test` is wired into `npm run check`).
- **`brands/estate.css` — the Estate brand.** Two raw ramps
  (`--brand-clay-50…900`, the logo mark only, never a surface;
  `--brand-indigo-50…900`, A1 indigo-slate, O8 resolved 2026-09-09) and a
  partial override of the brand-axis tokens: brand surface, action, link,
  focus, sidebar (light neutral, O5 resolved) and the shadow tint
  (clay-900 `rgba(29, 13, 8, a)`, including the four `--button-shadow-soft*`
  values). Everything not declared inherits from the AEC blocks.
- **`pooled` tone** — shared / commons teal, same shape as the other tones
  plus `-border` and `-card`, in both brand files (AEC carries it unused).
  Tailwind: `pooled`, `pooled-foreground`, `pooled-muted`, `pooled-ink`,
  `pooled-border`, `pooled-card`.
- **`.ds-field`** density opt-in: 16px text and a 44px minimum hit target
  on `button`, `[role="button"]`, `input`, `select` — next to `.ds-marketing`.
- **`check:css`** now also asserts the six brand/theme selectors, the seven
  pooled tokens, both Estate ramps and `.ds-field` survive parsing.

**Corrections to the step-3 brief, recorded here so nobody re-learns them**
- *§0 — the two axes are not "disjoint override sets" in the cascade.*
  `[data-brand="estate"]` and `[data-theme="dark"]` have equal specificity
  and `estate.css` is imported after `aec.css`, so any token the Estate
  **light** block sets that the AEC **dark** block also tunes must be
  re-declared in the Estate **dark** block, or the light value wins on dark.
  Four such re-declarations exist in `estate.css` (`--sidebar-foreground`,
  `--sidebar-muted`, `--sidebar-accent-foreground`, `--bg-accent-subtle`);
  the rest of the dark block re-states values for the same reason.
- *Documented theme-axis exception.* Estate has no dark brand-surface hue,
  so its dark block overrides the structural ladder with neutral slate.
  The complete list of theme-axis tokens any brand file overrides is:
  `--bg-canvas`, `--bg-surface`, `--muted`, `--secondary`, `--border`,
  `--input`, `--border-subtle`, `--border-strong`. Nothing else.
- *Value shapes.* Every token is declared in the shape its consumers
  expect: HSL triples where the preset wraps `hsl(var())`, hex / `var()`
  refs where it consumes unwrapped (`--fg-on-brand` is `var(--gray-0)`, not
  a triple). Verified: all 119 preset expressions resolve in every Estate
  state; none fall back to the sentinel.
- *Dark action colour is a one-off literal.* `indigo-400` (#7981BB) is
  3.63:1 white-on and fails AA, so dark `--action-primary` is
  `233 30% 54%` (#676FAD, 4.71:1 white-on; 3.84:1 vs canvas, 3.50:1 vs
  card). The ramp is unchanged; hover / active stay indigo-300 / -200.
- *Sidebar hover.* `SidebarItem` paints `bg-sidebar-accent` at 6% alpha, so
  `--sidebar-accent` is an ink, not a surface: gray-900 on the light
  sidebar, white (`--border-on-inverse`) on the dark one.

**Known limitation (Estate app must handle in components; not a 5.3.0 concern)**
- `SidebarItem` uses `--sidebar-primary` for both the active-row fill and
  the `focus-visible` ring. On Estate's light neutral sidebar the active
  fill is indigo-50 on gray-50 (1.05:1) and on dark it is #262B34 on
  #0F1216 (1.35:1) — correct for the fill (the row's text carries the
  state), but the same token makes the focus ring near-invisible. Estate
  components should draw their focus ring from `--ring`.

**Finding, not fixed here — tracked on enirman_ui#1**
- AEC's own dark `--action-primary` (`211 87% 56%`, #2D8CF0) is 3.43:1
  white-on, below AA; `--sidebar-primary` dark (same value, white text) and
  `--fg-link` on the dark canvas (3.60:1) fail the same gate. A value change
  under an existing name is a major, so this waits for the 6.0.0 window
  alongside `--border` / `--secondary` / `--border-strong`.

**Verification**
- AEC unchanged: flattened `theme.css` from this tree and from the
  published 5.2.1 tarball were loaded into Chromium and every custom
  property, every preset colour expression and every shadow expression
  resolved for six states ({no `data-brand`, `data-brand="aec"`} × {no
  `data-theme`, light, dark}). All 188 pre-existing tokens, 101 colour and
  12 shadow expressions resolve identically; the only additions are the
  seven `--pooled-*` tokens, the six `pooled` preset colours and the
  `.ds-field` probes, and the twenty Estate ramp tokens resolve to the
  empty string in every AEC state (declared, not leaking). The textual
  diff of the flattened sheets shows only the widened selectors, the
  pooled lines, `.ds-field` and the appended Estate blocks.
- Studio and Connect both build clean against the packed 5.3.0 tarball.
- Contrast (Estate, Chromium-resolved): white on `action-primary` 6.09:1
  light / 4.71:1 dark; `pooled-ink` on `pooled-muted` 9.26:1 / 7.04:1;
  `accent-foreground` on `accent` 9.78:1 / 10.50:1; sidebar active-row text
  9.78:1 / 13.06:1; `fg-link` on canvas 5.67:1 / 6.94:1. All AA.
- `npm run check:css`, `check:tokens`, `check:parity` and `npm test`
  (10/10) pass.

## 5.2.1

**Fixed**
- `npm publish --dry-run` crashed in `check:drift`. `--dry-run` exports
  `npm_config_dry_run=true`, which the child `npm pack` inside
  `scripts/check-publish-drift.mjs` inherited — it wrote no tarball, so
  `readdirSync().find()` returned `undefined` and the script died on
  `join(tmp, undefined)`. The flag is now stripped for that child, and a
  missing tarball reports itself instead of throwing a path TypeError.
  Publishing was never affected; only the dry run people sensibly do first.

## 5.2.0

Studio's v3-fidelity audit found that `theme.css` shipped exactly one
`.t-*` rule (`.t-num`) while the design spec (`colors_and_type.css`)
defines nineteen — three of them `.t-display-*` (out of scope: nothing
in the shipped app calls those). This release adds the fifteen that are
in scope: `t-body`, `t-mono`, and `t-caps` alone accounted for ~300 dead
call sites across Studio, since CLAUDE.md §4.0 names `.t-*` as the
sanctioned way to set type and every one of those classes resolved to
no CSS rule. Also fixes finding `S-21` in the same audit
(`StatCard.descriptionTone` had no amber option).

**Added**
- **`.t-*` semantic typography classes** — `.t-h1`…`.t-h6`, `.t-body-lg`,
  `.t-body`, `.t-body-sm`, `.t-label`, `.t-label-sm`, `.t-caps`,
  `.t-caps-sm`, `.t-mono`, `.t-mono-md`, matching `colors_and_type.css`
  lines 246–265 exactly. `.t-num` is unchanged. Every rule composes from
  tokens, not literals: a new type-scale primitive layer
  (`--fs-2xs`…`--fs-4xl`, `--fw-regular`…`--fw-bold`,
  `--lh-tight`/`--lh-snug`/`--lh-normal`/`--lh-relaxed`) that theme.css
  had no equivalent for before this release, plus the existing
  `--tracking-tight`/`--tracking-caps` and `--fg2`/`--fg3` tier-2 tokens.
  Purely additive — no existing rule's selector or resolved value
  changed, so this cannot affect Hub.
- **`StatCard.descriptionTone`** gains a `warning` value (`text-warning-ink
  font-semibold`, joining `success`/`destructive`/`neutral`) — the "N
  overdue" sub-line now has an amber option instead of only red/green/muted.
- **`npm run check:css`** — parses `theme.css` with `postcss.parse()` and
  asserts every `.t-*` rule and type-scale token above actually made it
  into the parsed stylesheet, wired into `npm run check`. Added after
  review caught this release's own first draft shipping a `theme.css`
  that wasn't valid CSS (see **Fixed** below) — none of the three
  existing check scripts parse CSS, so that regression was invisible to
  a green `npm run check`.

**Fixed**
- Two of the doc-comments added for the `.t-*` work above separated
  adjacent token names with a bare slash (e.g. "--fs-*" next to "--fw-*"
  with only a `/` between them), which put a star immediately before a
  slash in the middle of the comment's prose. CSS closes a comment on
  that sequence regardless of where it falls, so both comments closed
  early and dumped the rest of their sentence into `theme.css` as
  invalid CSS — `--fs-2xs` never got declared and `.t-h1` never reached
  `document.styleSheets` in a real browser, even though `npm run check`
  was green (see `check:css` above for why). Caught in review before
  publish. Reworded both comments to use commas; no rule's selector or
  value changed.

**Changed**
- Split theme.css into base + brands/aec. No visual change.

---

## 5.1.1

**Fixed**
- `EuiKanbanColumn`/`EuiKanbanCard` (added in 5.1.0) still used `border-border` — a legacy class Studio's own adherence lint denylists — and a raw `text-[14px]` where an exact token (`text-base`) exists. Caught by Studio's final whole-branch review for the first screen that consumed these components. Fixed to `border-border-default`/`text-base`; `npm run check` clean.

---

## 5.1.0

**Added**
- `EuiKanbanColumn` + `EuiKanbanCard` — a draggable kanban column/card pair, ported from the abandoned `riba-ui` branch and fixed for token compliance (the original hardcoded raw Tailwind palette classes for priority/tone coloring) and genericized (the original `EuiKanbanCard` assumed RFI-like fields — `priority`, `due_date`, `assigned_to` — that don't apply generally; the port is a slot-driven card shell instead, consumer supplies its own content). First consumer: Enirman Studio's Design Hub kanban.

---

## 5.0.0

Two fixes surfaced by a fresh consumer (Enirman Studio) that 4.0.x/4.1.0's only other consumer (Hub) happened not to trigger. One of them removes a public export, hence the major bump — see **Breaking** below.

**Fixed**
- `AppShell` now wraps its content in `TooltipProvider`. Previously, any consumer composing `AppShell` + `SidebarItem` exactly as documented crashed at mount (`Injection Symbol(TooltipProviderContext) not found`), because `SidebarItem`'s internal `Tooltip` requires that ambient context and `AppShell` never provided it. Consumers that were already wrapping their own root in `TooltipProvider` as a workaround can safely remove that wrapper (nesting providers is harmless).

**Breaking**
- `EuiDwgViewer` is removed. It hard-imported `element-plus` and `@mlightcad/cad-viewer`/`cad-simple-viewer`, none of which were declared as dependencies — so importing *anything* from `@enirman/ui` (not just `EuiDwgViewer`) forced every consumer's bundler to resolve those packages, crashing the build for any consumer that didn't separately happen to have them installed. It was added in a single commit and never adopted by any consumer or documented anywhere — Hub's own DWG viewing is a separate, iframe-isolated implementation that never went through `@enirman/ui`. Given zero real usage (confirmed: no consumer imports it), removing it outright is simpler and safer than carving out a subpath export to keep it around. If you need a DWG/CAD viewer, install `element-plus` + `@mlightcad/cad-viewer` + `@mlightcad/cad-simple-viewer` directly and build your own, the way Hub's iframe-isolated viewer does.

---

## 4.1.0

**§4.2 token reconciliation** — the live token system now uses the design-spec's (`colors_and_type.css`) tier-2 names as canonical. Every 4.0.x name still works, unchanged in value, as a deprecated alias — except two cases below where the spec's value differs from what was already shipped; those got an *additional* new-named token instead of a repoint, to avoid a silent visual change under an old name.

**Added**
- Tier-2 tokens: `--bg-canvas`, `--bg-surface`, `--bg-sunken`, `--bg-inverse`, `--bg-brand`, `--bg-accent-subtle`, `--fg1`–`--fg4`, `--fg-on-brand`, `--fg-on-accent`, `--fg-on-inverse`, `--fg-on-inverse-muted`, `--fg-link`, `--fg-link-hover`, `--border-default`, `--border-focus`, `--border-brand`, `--border-on-inverse`, `--action-primary(-hover|-active)`, `--action-secondary(-hover)`, `--action-danger` — plus matching Tailwind utility keys (`bg-canvas`, `text-fg1`, `border-border-default`, `bg-action-primary`, …). One naming exception: `--bg-surface`'s Tailwind key is `panel` (i.e. `bg-panel`), not `surface` — frappe-ui's preset already defines a nested `backgroundColor.surface` with no `DEFAULT`, which silently shadows `bg-surface` to nothing in the merged config.
- `scripts/check-token-parity.mjs`, wired into `npm run check` — regression-guards token values against the design spec.

**Changed**
- Sidebar tokens (`--sidebar-foreground`, `--sidebar-muted`, `--sidebar-border`, `--sidebar-accent`, `--sidebar-accent-foreground`) now source from the new generic on-inverse tokens instead of hardcoding white — same resolved color, now reusable by any dark/inverse surface.
- Docs: confirmed no stale font references exist in this package (Manrope throughout) — the design-export's separate README claim about Inter is a different repo's issue, out of scope here.

**Deprecated** (unchanged value, will be removed in a future major)
- `--background` → alias of `--bg-canvas`
- `--card`, `--popover` → alias of `--bg-surface`
- `--foreground`, `--card-foreground`, `--popover-foreground` → alias of `--fg1`
- `--muted-foreground` → alias of `--fg3`
- `--primary` → alias of `--action-primary`
- `--destructive` → alias of `--action-danger`
- `--ring` → alias of `--border-focus`

**Known exceptions — not aliased, kept at their existing value:**
- `--border` (stays gray-150) — the spec's equivalent concept, `--border-default`, is gray-200. Repointing `--border` would silently change every default input/table border in Hub; that's a major-version change, not this release. Use `border-default` for new spec-value borders. Divergence documented in `docs/DESIGN_TOKENS.md`; migration tracked in [enirman_ui#1](https://github.com/E-Nirman/enirman_ui/issues/1).
- `--secondary` (stays gray-150) — the spec's equivalent concept, `--action-secondary`, is gray-100. Same reasoning as `--border`.

## 4.0.8

- `Button`: as-child links no longer render dimmed and unclickable.
  reka-ui's Primitive stringifies `:disabled="false"` onto the child
  `<a>` as `disabled="false"`, which the `.eui-btn[disabled]` presence
  selector matched. Fixed by omitting the attribute when not disabled.

## 4.0.7

- `SidebarItem`: 13px/500 in both states per the Connect mockup
  (`.sb-item` is `font: 500 13px` — active only changes bg/color; the
  extra `font-semibold shadow-xs` on active is gone).

## 4.0.6

- `PageHeader`: new `titleClass` prop — extra classes merged onto the h1
  (e.g. `font-mono` for ID-titled detail pages per the v4 mockups).

## 4.0.5

Sidebar fidelity — measured against the mockup's computed styles.

- `SidebarItem` 32px tall (mockup `.sb-item` 7px 10px padding).
- `SidebarSection` airier: 10/4px section padding, heading gap, 1px
  item rhythm (mockup `.sb-section`).
- `--sidebar-primary` pinned to the exact `#1B73D8` active-row blue.

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
