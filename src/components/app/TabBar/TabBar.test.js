import { describe, it, expect, afterEach } from 'vitest'
import { createApp, h, ref, nextTick, defineComponent } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import TabBar from './TabBar.vue'

const Icon = defineComponent({
  props: { strokeWidth: { type: Number, default: 2 } },
  setup: (p) => () => h('svg', { 'data-icon': '', 'data-stroke': String(p.strokeWidth) }),
})

const routedItems = [
  { value: 'tools',      label: 'Tools',      icon: Icon, to: '/tools' },
  { value: 'plotter',    label: 'Plotter',    icon: Icon, to: '/plotter' },
  { value: 'workspaces', label: 'Workspaces', icon: Icon, to: '/workspaces' },
  { value: 'me',         label: 'Me',         icon: Icon, to: '/me' },
]

let app
let host
async function mount(props = {}, { path = '/tools', router = true } = {}) {
  host = document.createElement('div')
  document.body.appendChild(host)
  const selects = []
  app = createApp({ setup: () => () => h(TabBar, { items: routedItems, ...props, onSelect: (v) => selects.push(v) }) })
  let r = null
  if (router) {
    r = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/:any(.*)*', component: { render: () => null } }],
    })
    app.use(r)
    await r.push(path)
    await r.isReady()
  }
  app.mount(host)
  await nextTick()
  const nav = () => host.querySelector('nav')
  const links = () => [...host.querySelectorAll('[data-tab]')]
  const current = () => links().filter((l) => l.getAttribute('aria-current') === 'page').map((l) => l.dataset.tab)
  return { nav, links, current, router: r, selects }
}

afterEach(() => {
  app?.unmount()
  host?.remove()
})

describe('TabBar — navigation semantics', () => {
  it('is a named nav landmark with a list of links', async () => {
    const { nav, links } = await mount({ label: 'Primary' })
    expect(nav().getAttribute('aria-label')).toBe('Primary')
    expect(host.querySelectorAll('nav > ul > li')).toHaveLength(4)
    expect(links().map((l) => l.tagName)).toEqual(['A', 'A', 'A', 'A'])
    expect(links().map((l) => l.getAttribute('href'))).toEqual(['/tools', '/plotter', '/workspaces', '/me'])
    expect(links().map((l) => l.textContent.trim())).toEqual(['Tools', 'Plotter', 'Workspaces', 'Me'])
  })

  it('defaults the landmark name to "Main"', async () => {
    const { nav } = await mount()
    expect(nav().getAttribute('aria-label')).toBe('Main')
  })

  it('hides icons from assistive tech', async () => {
    await mount()
    for (const svg of host.querySelectorAll('[data-icon]')) {
      expect(svg.parentElement.getAttribute('aria-hidden')).toBe('true')
    }
  })
})

describe('TabBar — current item (aria-current)', () => {
  it('derives the current item from the route, including child paths', async () => {
    const a = await mount({}, { path: '/tools' })
    expect(a.current()).toEqual(['tools'])
    app.unmount(); host.remove()
    const b = await mount({}, { path: '/tools/concrete' })
    expect(b.current()).toEqual(['tools'])
  })

  it('follows navigation', async () => {
    const { current, router } = await mount({}, { path: '/tools' })
    await router.push('/me')
    await nextTick()
    expect(current()).toEqual(['me'])
  })

  it('does not match a sibling that only shares a prefix, and honours exact', async () => {
    const items = [
      { value: 'plot', label: 'Plot', to: '/plot' },
      { value: 'plotter', label: 'Plotter', to: '/plotter' },
      { value: 'home', label: 'Home', to: '/home', exact: true },
    ]
    const a = await mount({ items }, { path: '/plotter/1' })
    expect(a.current()).toEqual(['plotter'])
    app.unmount(); host.remove()
    const b = await mount({ items }, { path: '/home/settings' })
    expect(b.current()).toEqual([])
  })

  it('v-model wins over the route', async () => {
    const { current } = await mount({ modelValue: 'plotter' }, { path: '/tools' })
    expect(current()).toEqual(['plotter'])
  })

  it('item.active wins over the route when there is no v-model', async () => {
    const items = routedItems.map((i) => ({ ...i, active: i.value === 'workspaces' }))
    const { current } = await mount({ items }, { path: '/tools' })
    expect(current()).toEqual(['workspaces'])
  })

  it('thickens the current icon stroke', async () => {
    await mount({}, { path: '/me' })
    const strokes = [...host.querySelectorAll('[data-icon]')].map((s) => s.dataset.stroke)
    expect(strokes).toEqual(['1.75', '1.75', '1.75', '2.25'])
  })
})

describe('TabBar — without a router', () => {
  const buttonItems = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma', disabled: true },
  ]

  it('renders buttons, needs no router, and selects through v-model', async () => {
    const value = ref('a')
    const selects = []
    host = document.createElement('div')
    document.body.appendChild(host)
    app = createApp({
      setup: () => () => h(TabBar, {
        items: buttonItems,
        modelValue: value.value,
        'onUpdate:modelValue': (v) => { value.value = v },
        onSelect: (v) => selects.push(v),
      }),
    })
    app.mount(host)
    await nextTick()
    const buttons = [...host.querySelectorAll('[data-tab]')]
    expect(buttons.map((b) => b.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON'])
    expect(buttons.every((b) => b.getAttribute('type') === 'button')).toBe(true)
    expect(buttons[0].getAttribute('aria-current')).toBe('page')
    buttons[1].click()
    await nextTick()
    expect(value.value).toBe('b')
    expect(selects).toEqual(['b'])
    expect(host.querySelector('[data-tab="b"]').getAttribute('aria-current')).toBe('page')
    buttons[2].click()
    await nextTick()
    expect(value.value).toBe('b')
    expect(buttons[2].disabled).toBe(true)
  })

  it('renders plain anchors for href items, with no current item', async () => {
    const { links, current } = await mount({ items: [{ value: 'x', label: 'Docs', href: 'https://example.invalid/docs' }] }, { router: false })
    expect(links()[0].tagName).toBe('A')
    expect(links()[0].getAttribute('href')).toBe('https://example.invalid/docs')
    expect(current()).toEqual([])
  })
})

describe('TabBar — layout and tokens', () => {
  it('is fixed to the bottom with the safe-area inset by default, in flow when fixed=false', async () => {
    const a = await mount()
    expect(a.nav().className).toContain('fixed')
    expect(a.nav().className).toContain('bottom-0')
    expect(a.nav().className).toContain('pb-[env(safe-area-inset-bottom)]')
    app.unmount(); host.remove()
    const b = await mount({ fixed: false })
    expect(b.nav().className).not.toContain('fixed')
  })

  it('sizes items from --touch-target, shows focus, and paints only with tier-2 utilities', async () => {
    const { links, nav } = await mount({}, { path: '/tools' })
    const [cur, other] = links()
    expect(cur.className).toContain('min-h-[var(--touch-target)]')
    expect(cur.className).toContain('focus-visible:ring-ring')
    expect(cur.className).toContain('text-action-primary')
    expect(other.className).toContain('text-fg3')
    expect(nav().className).toContain('bg-card')
    expect(nav().className).toContain('border-border-subtle')
    for (const el of [nav(), ...links()]) {
      expect(el.className).not.toMatch(/#[0-9a-f]{3,8}|rgb\(|hsl\(\d|gray-\d|navy-\d|blue-\d|bg-white/i)
    }
  })
})
