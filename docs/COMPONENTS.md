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
   that dark mode overrides. Don't hardcode hex colors.
5. **Mobile-first.** Components collapse gracefully below `md` breakpoint.
   Cards reduce padding, dialogs become bottom sheets, page headers stack.

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
- Top-level items have icons. Children (indented) do not (to save width).
- Active state is auto-derived from route. Pass `exact` for dashboard-like
  paths that shouldn't match children.
- Limit to ~10 top-level items. Beyond that, use collapsible sections.
- Collapsed sidebar shows icons only — make sure every item has an icon.
- Badge (numeric) uses danger color — reserve for "needs action" counters,
  not informational.

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
