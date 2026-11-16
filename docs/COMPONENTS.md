# Component Rules

Every component in `enirman-ui` follows a small set of rules. These exist
so that (a) the design stays coherent even as many people contribute,
and (b) you always know which component to reach for.

---

## Core principles

1. **Semantic over visual.** Use `tone="success"`, not `color="green"`. Tone
   names map to meaning (success = approved/completed), so rebranding
   and dark mode both work for free.
2. **Never set raw colors in page code.** If you find yourself writing
   `bg-blue-500` in a page, that's a sign the design system is missing
   a primitive — add one.
3. **Three sizes, max.** Every sized component is `sm / md (default) / lg`.
   Extra sizes fragment layouts.
4. **Dark mode is not an afterthought.** Every component reads CSS vars
   that dark mode overrides. Don't hardcode hex colors — and note that
   the raw `--gray-*` / `--brand-*` scales are **not** overridden: they
   are absolute swatches. See [Colour that flips](#colour-that-flips).
5. **Mobile-first.** Components collapse gracefully below `md` breakpoint.
   Cards reduce padding, dialogs become bottom sheets, page headers stack.
6. **One colored status element per row/entity.** Colour is the scarcest
   signal on a dense screen — spend it on workflow status and nothing
   else. Everything that competes gets demoted to text. See
   [Status, revisions & versions](#status-revisions--versions).

---

## Button (`EuiButton`)

Primary interactive control.

**Variants:**

| Variant | When |
|---|---|
| `primary` | Main CTA — at most **one** per view or modal |
| `secondary` | Default action, outlined |
| `ghost` | Dense toolbars, no background until hover |
| `subtle` | Utility actions in tight spaces (filtering, sorting) |
| `danger` | Destructive — deletes, irreversible ops |
| `link` | Inline in prose; no height, no padding |

**Sizes:** `sm` (28px) / `md` (34px, default) / `lg` (40px)

**Rules:**
- Loading state auto-disables the button and shows a spinner — never
  swap variant to indicate loading.
- Icon-only buttons use `EuiIconButton`, not `EuiButton :iconOnly`.
- A `primary` button paired with a `secondary` (and optional `ghost` Cancel) is
  the standard dialog footer pattern.

---

## IconButton (`EuiIconButton`)

Square button for icon-only controls (top bar, card actions).

**Variants:** `ghost` (default), `subtle`, `solid`.
**Sizes:** `sm` / `md` / `lg`.
**Always** set `label` for accessibility — it becomes both `aria-label` and title tooltip.

---

## Card (`EuiCard`) & SectionCard (`EuiSectionCard`)

A bordered surface grouping related content.

**Anatomy:** optional header (title + icon + badge + actions) / body / optional footer.

**Rules:**
- Every dashboard block uses the same pattern: icon + title + optional badge in header.
- Use `flush` when body contains a list (`EuiListRow` series) or a table.
- `interactive` / `to` / `href` make the whole card clickable; provide an
  obvious call-to-action in the content so users know it's tappable.
- `raised` is reserved for floating UI (modals in progress, sticky previews).
  Regular page content is bordered-only.

---

## Badge (`EuiBadge`)

Small chip for status, category, or counter.

**Tones:** `neutral / brand / success / warning / danger / info / accent`.
**Sizes:** `sm / md`.
**`dot` prefix** — add a colored dot before the label.
**`solid`** — switch from tinted to filled (use sparingly — solid badges
are loud; reserve for real-world status like "Overdue").

**Rules:**
- Status → always use the matching tone: approved = success, pending =
  warning, rejected = danger, Plus tier = accent.
- Never mix solid and tinted badges in the same row.

---

## StatusDot (`EuiStatusDot`)

Inline dot + optional label — smaller and less visually weighty than a
badge. Use inside dense rows (sidebar, list) where a badge would
overwhelm.

**`pulse`** — animated ring. Reserve for real-time or "live" indicators.

---

## Colour that flips

`theme.css` overrides the **semantic** tokens under `[data-theme="dark"]`.
It deliberately does **not** override the raw `--gray-0…950` and
`--brand-{navy,blue,amber}-*` scales — those are absolute swatches, for
exact-colour work (SVG fills, slide artifacts).

Paint a surface with a light-end raw swatch and it stays light: a white
slab on the dark canvas. That is exactly how `@enirman/ui@3.0.0` shipped
a broken `EuiProjectTimeline`.

**Use these — they flip:**

| For | Token |
|---|---|
| Surfaces | `hsl(var(--background))`, `--card`, `--muted` |
| Borders | `hsl(var(--border))`, `--border-subtle`, `--border-strong` |
| Text | `hsl(var(--foreground))`, `--muted-foreground` |
| Accents | `hsl(var(--primary))`, or a tone family |
| Tone families | `--{info,success,warning,destructive,plus}` each with `-muted` (tint), `-ink` (text on tint), `-foreground` (text on solid) |

Note the semantic tokens hold **HSL triplets**, so inline styles need
`hsl(var(--border-strong))`. The raw scales hold full hex values.
Also: `--plus` is re-routed to amber, so it collides with `--warning` —
don't rely on them being distinct hues.

**Rules:**
- `npm run check:tokens` fails the build on any light-end raw swatch used
  as a surface, and on any Tailwind `-gray-N` class (the preset defines no
  gray scale, so those silently resolve to stock Tailwind gray).
- A saturated brand swatch is allowed when it's an *identity* colour that
  reads on both canvases — avatar backgrounds, the amber municipal bar.
  Mark the line with a `theme-token-ok` comment so the intent is explicit.
- Render every new component in **both** themes before publishing.

---

## Status, revisions & versions

**The rule: one colored status element per row/entity.** The workflow
status is that element — a tinted pill with a leading dot (`StatusBadge`).
Everything else on the row is demoted so the eye lands on status first.

| Information | Render as |
|---|---|
| Workflow status | The ONLY badge — tinted pill, dot prefix (`StatusBadge`) |
| Version (`v1.1.1`) | Plain `font-mono text-xs font-semibold` text, no chip |
| Option (`OPT A`) | Mono text in a hairline border box, `text-[10px]`, gray |
| Revision type (`Complete Redesign`) | Muted two-line text — `Complete redesign` over `✓ redesign done` in success ink |
| Routing (`→ Structural · shyam`) | 20px avatar + muted name text |
| Discipline (`ARCH`/`3D`/`STR`) | Tiny mono tag — ARCH `info-muted`, 3D `warning-muted`, STR `success-muted` |

**Rules:**
- **Revision types are never badges.** `Initial`, `Complete Redesign`,
  `Major Revision`, `Minor Correction` are context, not state. They were
  removed from `StatusBadge`'s tone map on purpose — passing one now falls
  back to the `default` gray tone, which is the tell that it's misplaced.
- **`StatusBadge` always shows its dot** (`dot` defaults to true). Pass
  `dot={false}` only for label-only taxonomy chips.
- **Overdue counters are not part of the badge.** "36 days in review" is a
  separate `text-danger` caption under the modified date.
- `'Sent to Client'` is toned `info`, but semantically means *waiting on
  someone external* — dashboard and list age-alerts key off it.
- Legend, where one is shown: blue = in progress · amber = waiting ·
  green = approved · red = returned.

---

## Table conventions

For dense list tables (Design Hub, Projects, Designs, Visits):

- **Column clusters** separated by hairline `border-l` rules:
  `identity | state (version + status + revision) | routing | meta`.
- **Identity cell** is a title (13px semibold) over a mono code + a
  discipline tag.
- **Overdue rows** get an amber `inset 3px 0 0` left accent plus a red
  caption under the date — never a second badge.
- **Old versions never stack as rows.** The version cell carries an
  "N older" link that expands an `EuiOlderVersionsRow` sub-row beneath.
- Below `1250px`, wrap the table in `overflow-x-auto` and put a
  `min-width` on the grid rather than letting columns collapse.

---

## Workflow components

Composed pieces for the design/review lifecycle. All are driven by the
rules above, so prefer them over bespoke markup.

| Component | What it is |
|---|---|
| `EuiStatusFlow` | Vertical "Stage" stepper. `steps: [{ label, state, meta, quote, elapsed, tone }]`, state `done`/`current`/`upcoming`/`next`. Elapsed time renders in danger ink. |
| `EuiVersionTimeline` | One card per version. Current version is `border-info` + `bg-info-muted` with a `current` chip. A version carrying `revisions: []` collapses to "v1 · N revisions". |
| `EuiReviewCard` | A single client/reviewer decision as a left-border accent card. Internal notes are **not** rendered here — they live as a separate flat list so client feedback and internal chatter stay distinct. |
| `EuiOlderVersionsRow` | The expandable sub-row behind a table's "N older" link. |
| `EuiDesignItemPane` | Tabbed workflow panel (Workflow / Versions / Reviews / History). Resizable + collapsible; width and open state persist to localStorage. |
| `EuiProjectTimeline` | Dashboard Gantt — estimated bar over actual phase bars, today line, legend. |

**Rules:**
- `EuiDesignItemPane`'s NEXT ACTION cluster gets **exactly one** primary
  button. Decisions are bordered tone cards (title + one-line description).
- **Destructive operations are never inline.** Retract approval, revoke
  access and friends live behind the collapsed "Destructive actions"
  disclosure at the bottom of the pane.

---

## Input (`EuiInput`)

Text input and textarea.

**Rules:**
- Always provide `label` (or an adjacent visible label). Never rely on
  placeholder as the only label.
- Use `hint` for format guidance (e.g. "Include area code"); use `error`
  for validation messages.
- `type="password"` and `type="email"` set `autocomplete` correctly — pass
  explicit `autocomplete` if you need different behavior.
- For textareas, pass `as="textarea"` and optional `rows` (default 3).

---

## SearchInput (`EuiSearchInput`)

Purpose-built search field. Automatically shows clear button when value
is non-empty; supports `shortcut` prop (e.g. `"⌘K"`).

**Rule:** use this anywhere the user is filtering/searching a list.
Never build a bespoke search input.

---

## EmptyState (`EuiEmptyState`)

Fallback when a list or card has no content.

**Rules:**
- Every list view must have an empty state — lists that silently show
  nothing are a bug.
- Title is a short positive statement ("No projects yet"), not a
  negation ("You have no projects").
- Description explains **what the user can do next** (1 sentence).
- Always include an action button via `#action` slot.
- Use `tone="brand"` when empty is expected-but-positive (new users),
  `tone="gray"` for neutral empty (filtered out), `tone="warning"` when
  something went wrong.

---

## MetricCard (`EuiMetricCard`)

Hero stat tile for dashboards.

**Rules:**
- `value` should be the number itself, large and bold. Units/currency go
  inside the value string ("₹12.4M"), not in label.
- `label` is short (≤ 3 words), `subtitle` gives context (≤ 6 words).
- `tone` colors the left stripe + icon; pick based on what the metric is,
  not how the value feels (Revenue = `brand`, whether it's up or down).
- For trend, pass `delta` as a signed number — positive auto-colors
  success, negative auto-colors danger. Pass `deltaSuffix` to override
  the unit (default `%`).
- Make the card a link via `to` so the user can drill in.

---

## Dialog (`EuiDialog`)

Modal overlay.

**Sizes:** `sm` (420) / `md` (560, default) / `lg` (720) / `xl` (960) / `full`.

**Rules:**
- Closes on backdrop click and Escape. Pass `persistent` only when the
  user **must** interact (destructive confirm, blocking error).
- Mobile: dialogs render as bottom sheets with rounded-top corners.
  This is automatic — don't override.
- Use `#footer` for action rows. Pattern:
  `<EuiButton variant="ghost">Cancel</EuiButton><EuiButton variant="primary">Confirm</EuiButton>`
- `flush` removes body padding when the dialog body contains its own
  layout (tabs, scrollable list).

---

## Tabs (`EuiTabs`)

Horizontal navigation within a page/section.

**Variants:**
- `underline` — canonical page-level tabs (default)
- `pills` — in-toolbar tabs (compact, filled active state)
- `segmented` — joined control (e.g. list/grid view switcher)

**Props:** `tabs` is `[{ label, value, icon?, count?, disabled? }]`.

**Rules:**
- Use `underline` for primary content-switching within a page.
- Use `pills` inside toolbars or filter bars where vertical space is tight.
- Use `segmented` only for binary-ish choices (View Mode: List / Grid).
- Always mirror the active tab to the URL query string (e.g.
  `?tab=returned`) so refresh preserves state.

---

## Dropdown (`EuiDropdown`)

Contextual menu.

**Two usage patterns:**
1. **Items array** — pass `[{ label, icon, onClick }, { divider: true }, …]`
2. **Custom content** — use the default slot for anything

**Rules:**
- Trigger is a slot so consumers decide the visual (an `EuiIconButton`,
  a user avatar, a settings cog, etc.).
- Closes on click outside and Escape. Items with `closeOnClick: false`
  keep the menu open (useful for toggles within).
- `danger` items go at the bottom, separated by a `{ divider: true }`.
- Use `header` items for section labels within a menu.

---

## ListRow (`EuiListRow`)

A single row in a `flush` card or list.

**Anatomy:** optional avatar / title + subtitle / optional meta / optional actions / trailing chevron.

**Rules:**
- Always pair with `<EuiCard flush>` as parent.
- Rows are full-width click targets; put `.stopPropagation`-wrapped
  actions in `#actions` slot if they shouldn't navigate.
- Subtitle is one line, ellipsized. Don't put long descriptions here.

---

## PageHeader (`EuiPageHeader`)

Canonical page title row.

**Rules:**
- Every top-level page starts with this — no exceptions.
- `title` is short and concrete (verb-noun or noun: "Projects",
  "Site Visit Report", not "All the projects you own").
- `subtitle` is one line describing scope or purpose.
- Primary page action goes in `#actions` slot as a `primary` button.
- Secondary actions go as `secondary` or `ghost` next to primary.
- Use `#extra` slot for filter bars, tabs, or search that should live
  inside the header section.

---

## Sidebar (composition of `EuiAppShell`, `EuiSidebarSection`, `EuiSidebarItem`)

**Structure:**
```
EuiAppShell
  #sidebar
    EuiSidebarSection (optional label, optional collapsible, divider)
      EuiSidebarItem (icon + label + badge + optional child items)
```

**Rules:**
- Brand lockup (v4): `enirman` + amber `Connect` (weight-800, tracking
  −0.02em) + amber PRO pill when the firm is on a paid tier. Use the
  shipped `logo-light.svg` on the navy sidebar; never write "Hub".
- Top-level items have icons. Children (indented) do not (to save width).
- Active state is auto-derived from route. Pass `exact` for dashboard-like
  paths that shouldn't match children.
- Limit to ~10 top-level items. Beyond that, use collapsible sections.
- Collapsed sidebar shows icons only — make sure every item has an icon.
- Badge (numeric) uses danger color — reserve for "needs action" counters,
  not informational.

---

## SegmentedControl (5.4.0)

A short, mutually exclusive choice shown as joined segments (Length unit:
m / ft; Calendar: BS / AD). For switching *content* within a page, use
`Tabs`; for more than ~4 options, use `InlineSelect`.

```vue
<p id="len-label" class="t-label">Length unit</p>
<SegmentedControl
  v-model="unit"
  labelledby="len-label"
  :options="[{ value: 'm', label: 'Metres' }, { value: 'ft', label: 'Feet' }]"
/>
```

**Props:** `options` `[{ value, label, disabled? }]` (required) · `label`
(accessible name) or `labelledby` (id of a visible label) · `disabled` ·
`block` (fill the width, equal segments). `v-model` is the checked value;
`change` fires with the new value. Slot `option` (`{ option, checked }`).

**Accessibility:** `role="radiogroup"` of `role="radio"` buttons with
`aria-checked`; one tab stop (the checked segment); Arrow keys move and
select (wrapping, skipping disabled), Home / End jump, Space / Enter
select; visible focus ring (`--ring`); every segment is at least
`--touch-target` tall (44px, 48px under `data-platform="mobile"`).

**Rules:**
- Always give it a name — `label` or `labelledby`. A segmented control
  without a visible label next to it needs `label`.
- Keep segment labels to one or two words; 2–4 segments.
- Checked segment uses the brand's action colour (`bg-primary`); don't
  restyle it per screen.

---

## TabBar (5.4.0)

Bottom tab bar for phones: 3–5 top-level destinations, icon over label.
Pair it with `data-platform="mobile"` (see DESIGN_TOKENS.md → Platform
axis). On wider screens use the sidebar instead.

```vue
<TabBar
  class="md:hidden"
  :items="[
    { value: 'tools',      label: 'Tools',      icon: Wrench,     to: '/tools' },
    { value: 'plotter',    label: 'Plotter',    icon: Map,        to: '/plotter' },
    { value: 'workspaces', label: 'Workspaces', icon: LayoutGrid, to: '/workspaces' },
    { value: 'me',         label: 'Me',         icon: User,       to: '/me' },
  ]"
/>
```

**Props:** `items` `[{ value, label, icon?, to?, href?, exact?, active?,
disabled? }]` (required) · `label` (landmark name, default `"Main"`) ·
`fixed` (default `true`: pinned to the viewport bottom with the safe-area
inset; `false` renders in flow). Optional `v-model` (the current value);
`select` fires `(value, event)` on every activation. Slot `icon`
(`{ item, current }`).

**Current item:** `v-model` if bound → else `item.active === true` → else
derived from the route like `SidebarItem` (the longest `to` that equals
or is a parent of the current path; `exact` disables the parent match).
Works without a router (button / `href` items).

**Accessibility:** a `<nav>` landmark with a list of links (buttons when an
item has neither `to` nor `href`); the current one has
`aria-current="page"`; icons are `aria-hidden`; visible focus ring; items
at least `--touch-target` tall.

**Rules:**
- 3–5 items. Labels always shown — never icon-only.
- Hide it on the screens that hide the mockup's tab bar (e.g. sign-in)
  with `v-if` in the app, and at tablet widths with `class="md:hidden"`.
- Leave room for it: pad the page bottom by
  `calc(var(--tabbar-height) + env(safe-area-inset-bottom))`.

---

## ProgressBar (`EuiProgressBar`)

Determinate or indeterminate progress.

**Rules:**
- Use for long-running tasks (upload, sync).
- In dashboards, use `size="xs"` inline within cards as status mini-charts.
- `indeterminate` only when genuine progress can't be measured.

---

## Skeleton (`EuiSkeleton`)

Loading placeholder.

**Rules:**
- Use in place of a spinner whenever the layout is known. Spinners are
  for actions; skeletons are for data.
- Match the shape of the final content: `shape="circle"` for avatars,
  `shape="line"` for text rows, `shape="rect"` for cards.
- Don't animate more than 6–8 skeletons in view — it becomes visual noise.

---

## When you can't find the right component

If you need a primitive that doesn't exist:

1. **Check if an existing primitive covers it with different slot content.**
2. **If you'd duplicate the same snippet 3+ times, add it to `enirman-ui`.**
3. **If it's truly one-off, inline with Tailwind, but never hardcode
   colors** — use the CSS variables directly (`var(--color-primary)`)
   or color utilities from the preset (`bg-brand`, `text-success`).
