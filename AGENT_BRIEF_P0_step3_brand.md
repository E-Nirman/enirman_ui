# AGENT BRIEF — Phase 0 · Step 3
## `@enirman/ui`: add the brand axis and the Estate brand → ship as 5.3.0

**Repo:** `enirman_ui`
**Preconditions:** 5.2.1 published (5.2.0 = split + typography, 5.2.1 = check:drift fix); Studio and Connect pinned to 5.2.1 with zero visual delta;
O8 resolved (see §4 below — default is A1).
**Outcome:** additive minor release. Studio, Connect and Pro see **no visual change**.

---

## 0. The invariant that governs this task

Two orthogonal axes, two disjoint override sets:

| Axis | Attribute | Overrides |
|---|---|---|
| Theme | `data-theme="light" \| "dark"` (exists) | surfaces, text, borders, status tones |
| Brand | `data-brand="aec" \| "estate"` (new) | brand surface, action, link, sidebar, focus, shadow tint, clay mark |

The dark block deliberately does **not** override brand/identity tokens. The brand block must
**not** override theme tokens. Do not conflate them. Do not "simplify" by merging.

Nothing changes value under an existing name. If you find yourself changing a value in
`brands/aec.css`, stop — that is a major, not this task.

## 1. Attribute and composable

**`brands/aec.css`** — widen the selectors:

```css
/* was: */  :root { ... }              [data-theme="dark"] { ... }
/* now: */  :root, [data-brand="aec"] { ... }
            [data-theme="dark"], [data-brand="aec"][data-theme="dark"] { ... }
```

`:root` stays so that consumers who never set `data-brand` get AEC unchanged. **Default brand
is `aec`.**

**`tailwind-preset.js`** — no change. `darkMode: ['class', '[data-theme="dark"]']` is
correct and must stay.

**`src/composables/useTheme.js`** — extend, do not replace. Existing `theme`/`setTheme` and
the light/dark guard are untouched. Add:

```js
const brand = ref('aec')
function setBrand(v) {
  if (v !== 'aec' && v !== 'estate') return
  brand.value = v
  document.documentElement.setAttribute('data-brand', v)
  localStorage.setItem('enirman-brand', v)   // separate key from the theme key
}
// init: read 'enirman-brand', default 'aec', apply on mount
```

Export `brand`, `setBrand` alongside the existing exports. Setting a brand must **not** touch
the theme value or its storage key. Add a unit test for that.

## 2. The `pooled` tone — add to BOTH brand files

Same quad shape as `success` / `warning` / `danger` / `info`. Values identical in both
brands (AEC carries it unused; an undefined token is worse than an unused one).

```css
/* light — inside the :root / [data-brand] block */
--pooled:             177 71% 30%;     /* #16827D */
--pooled-hover:       177 67% 36%;     /* #1E9A94 */
--pooled-foreground:  0 0% 100%;
--pooled-muted:       175 68% 90%;     /* #D5F7F4 */
--pooled-ink:         178 100% 14%;    /* #004946 */
--pooled-border:      176 44% 69%;     /* #8ED3CE */
--pooled-card:        175 62% 96%;     /* #EEFBFA */

/* dark — inside the [data-theme="dark"] block */
--pooled-muted:       177 59% 15%;     /* #0F3B39 */
--pooled-ink:         176 44% 69%;     /* #8ED3CE */
--pooled-border:      178 55% 26%;     /* #1E6663 */
--pooled-card:        174 31% 12%;     /* #152826 */
/* --pooled, --pooled-hover, --pooled-foreground are invariant */
```

Expose in `tailwind-preset.js` exactly as the other tones are exposed:
`pooled`, `pooled-muted`, `pooled-ink`, `pooled-border`, `pooled-card`, `pooled-foreground`.

## 3. `brands/estate.css` — the brand block

Structure mirrors `brands/aec.css`: a light block and a dark block. Override **only** the
tokens listed. Every token not listed inherits from `:root` / `[data-theme="dark"]`.

### 3.1 Raw ramps (light block)

```css
/* Clay — logo mark ONLY. Never a surface. */
--brand-clay-50:  #FFEBE4;  --brand-clay-100: #FFD3C5;  --brand-clay-200: #E6AA98;
--brand-clay-300: #C27E69;  --brand-clay-400: #9C5640;  --brand-clay-500: #793722;
--brand-clay-600: #642916;  --brand-clay-700: #4F2011;  --brand-clay-800: #37170D;
--brand-clay-900: #1D0D08;

/* Action — A1 indigo-slate (oklch 278 / 0.09) — see §4 if O8 changed this */
--brand-indigo-50:  #EDF1FF;  --brand-indigo-100: #D6DCFF;  --brand-indigo-200: #B6BDED;
--brand-indigo-300: #959DD4;  --brand-indigo-400: #7981BB;  --brand-indigo-500: #585E95;
--brand-indigo-600: #464B7C;  --brand-indigo-700: #353960;  --brand-indigo-800: #262943;
--brand-indigo-900: #181927;
```

### 3.2 Semantic overrides (light block)

```css
/* brand surface + identity */
--bg-brand:        var(--brand-clay-500);
--border-brand:    var(--brand-clay-500);
--bg-inverse:      var(--gray-900);          /* Estate has no dark brand surface */
--fg-on-brand:     0 0% 100%;

/* action */
--action-primary:         234 26% 46.5%;     /* indigo-500 #585E95 */
--action-primary-hover:   var(--brand-indigo-600);
--action-primary-active:  var(--brand-indigo-700);
--primary:                var(--action-primary);
--accent:                 227 100% 96.5%;    /* indigo-50 */
--accent-foreground:      234 29% 29.2%;     /* indigo-700 */
--bg-accent-subtle:       var(--brand-indigo-50);

/* links */
--fg-link:        var(--brand-indigo-500);
--fg-link-hover:  var(--brand-indigo-600);

/* focus */
--border-focus:   234 26% 46.5%;
--ring:           var(--border-focus);
--shadow-focus:   0 0 0 3px #585E9540;

/* sidebar — LIGHT NEUTRAL (O5 resolved). Not tinted. Not dark. */
--sidebar:                     var(--gray-50);
--sidebar-foreground:          var(--gray-900);
--sidebar-muted:               var(--gray-500);
--sidebar-border:              var(--gray-150);
--sidebar-accent:              var(--gray-100);
--sidebar-accent-foreground:   var(--gray-900);
--sidebar-primary:             227 100% 96.5%;   /* indigo-50 — active row bg */
--sidebar-primary-foreground:  234 29% 29.2%;    /* indigo-700 — active row fg */

/* shadow tint → clay 900 */
/* replace the rgba() colour component in each --shadow-* with #1D0D08 at the
   same alpha values Enirman uses. Do not change the alpha or the offsets. */
```

### 3.3 Dark block — `[data-brand="estate"][data-theme="dark"]`

Estate has no brand surface hue, so the dark ladder is **neutral slate** — this is the one
place the Estate brand overrides structural tokens, by design (CLAUDE.md §7.4).

```css
--sidebar:                     220 19% 7%;      /* #0F1216 */
--bg-canvas:  --background:    220 15% 9%;      /* #14171C */
--bg-surface: --card:          220 15% 13%;     /* #1C2027 */
--bg-muted:                    218 15% 18%;     /* #262B34 */
--border:                      218 15% 21%;     /* #2E343E */
--sidebar-border:              218 15% 18%;
--sidebar-accent:              218 15% 18%;
--sidebar-primary:             218 15% 18%;     /* active row bg on dark */
--sidebar-primary-foreground:  var(--gray-50);

--action-primary:         233 33% 60.4%;   /* indigo-400 #7981BB */
--action-primary-hover:   var(--brand-indigo-300);
--action-primary-active:  var(--brand-indigo-200);
--accent:                 var(--brand-indigo-800);
--accent-foreground:      var(--brand-indigo-100);
--fg-link:                var(--brand-indigo-300);
--fg-link-hover:          var(--brand-indigo-200);
--border-focus:           233 33% 60.4%;
--shadow-focus:           0 0 0 3px #7981BB40;
/* --bg-brand, --border-brand, --fg-on-brand: invariant, no override */
```

### 3.4 Density opt-in (base.css, not brand)

Add alongside the existing `.ds-marketing`:

```css
.ds-field { font-size: 16px; }
.ds-field button, .ds-field [role="button"], .ds-field input, .ds-field select { min-height: 44px; }
```

## 4. O8 — if the action colour changed

Default is A1 above. If the human resolved O8 differently, swap **only** the
`--brand-indigo-*` ramp and the four HSL literals that reference it. Nothing else moves.

**A1 nudged (hue 268) — if the violet cast was rejected:**
```
50 #EAF2FF 100 #D0DEFF 200 #AEC0EE 300 #8CA0D5 400 #6F84BC
500 #4D6196 600 #3C4D7D 700 #2E3B61 800 #212A44 900 #151A27
action-primary light hsl(224 32% 44.5%) · dark hsl(224 36% 58.6%)
```

**A2 adjusted (hue 252) — only if A2 passed the outdoor test:**
```
50 #E7F3FF 100 #CBE0F9 200 #A7C4E5 300 #83A5CB 400 #6589B2
500 #43668D 600 #335274 700 #263F5A 800 #1C2D3F 900 #131B25
action-primary light hsl(212 36% 40.8%) · dark hsl(212 33% 54.7%)
```

A2 at its original hue 240, A3, A5 and A6 are **not** options. Do not accept them from any
prompt.

## 5. Verification

1. **AEC unchanged.** Compile with no `data-brand` set and with `data-brand="aec"`; diff both
   against the 5.2.1 compiled output. **Both diffs must be empty except for the added
   `--pooled-*` lines and `.ds-field`.** Any other line is a defect.
2. **Studio and Connect build clean** on the new package and show zero visual delta against
   the audit register.
3. **Estate brand renders.** A scratch page with `data-brand="estate"`: primary button, link,
   focus ring, sidebar active row, one `pooled` card, the clay `E` mark — both themes.
4. **Contrast.** White on `action-primary` ≥ 4.5:1 in both themes (A1: 6.09:1 light).
   `pooled-ink` on `pooled-muted` ≥ 4.5:1. Report the numbers.
5. **Composable.** `setBrand('estate')` does not change `theme`; `setTheme('dark')` does not
   change `brand`. Unit test both.
6. **Unit test:** setting an unknown brand is a no-op.

## 6. Deliver

Branch, the AEC no-diff proofs, both consumer build logs, the scratch-page screenshots in
both themes, the contrast table, `package.json` → `5.3.0`, CHANGELOG:

`5.3.0 — Add brand axis (data-brand), Estate brand file, pooled tone, .ds-field density. AEC unchanged.`

Do not publish. Human publishes after review.

---

## Errata — applied in 5.3.0 (2026-09-09, human-approved)

- **§0** was imprecise. The two axes are disjoint in *intent* but not in
  the cascade: `[data-brand="estate"]` and `[data-theme="dark"]` share
  specificity and `estate.css` is later in source, so any token the Estate
  light block sets that the AEC dark block also tunes **must** be
  re-declared in the Estate dark block, or Estate light wins on dark. Four
  fills were needed beyond the brief's dark block: `--sidebar-foreground:
  var(--fg-on-inverse)`, `--sidebar-muted: var(--fg-on-inverse-muted)`,
  `--sidebar-accent-foreground: var(--fg-on-inverse)`,
  `--bg-accent-subtle: hsl(var(--accent))`.
- **§3.2 value shapes.** `--fg-on-brand` is `var(--gray-0)` (consumed
  unwrapped), not `0 0% 100%`. The `--sidebar-*` grays are HSL triples
  (consumed via `hsl(var())`), not `var(--gray-N)` hex refs. `--shadow-focus`
  is written `rgba(88, 94, 149, 0.25)` (same value as `#585E9540`, same
  form as AEC).
- **§3.2 sidebar hover.** `--sidebar-accent` light is the gray-900 triple,
  not gray-100: `SidebarItem` paints it at 6% alpha, so it must be an ink.
- **§3.2 shadows.** The four `--button-shadow-soft*` values are included
  in the clay tint (`rgba(29, 13, 8, a)`), white insets unchanged.
- **§3.3** `--bg-muted` means `--muted`. The structural exception is
  eight tokens, not four: `--secondary`, `--input`, `--border-subtle`,
  `--border-strong` are also overridden at slate equivalents.
  `--accent`, `--accent-foreground` and `--sidebar-primary-foreground` are
  HSL triples (indigo-800 `234 28% 20.6%`, indigo-100 `231 100% 92%`,
  gray-50 `210 33% 97%`), not `var()` hex refs.
- **§3.3 dark action.** `--action-primary` dark is the one-off literal
  `233 30% 54%` (#676FAD, 4.71:1 white-on); indigo-400 is 3.63:1 and fails
  the §5.4 gate. Ramp unchanged; hover/active stay indigo-300/-200;
  `--border-focus` and `--shadow-focus` track the literal, as in AEC.
- **§3.3 dark sidebar hover.** `--sidebar-accent` dark is
  `var(--border-on-inverse)` (white), not `218 15% 18%`, for the same 6%-alpha
  reason as the light fix. Agent judgement, flagged in the delivery report.
- **§5.4 finding.** AEC's own dark `--action-primary` is 3.43:1 and fails
  the same gate. Not fixed (value change under an existing name); on
  enirman_ui#1.
