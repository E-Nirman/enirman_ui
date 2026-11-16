import { describe, it, expect, afterEach } from 'vitest'
import { createApp, h, ref, nextTick } from 'vue'
import SegmentedControl from './SegmentedControl.vue'

/* Mounts the control with a real v-model (modelValue + onUpdate) the way a
 * consumer template would, and returns the DOM plus the bound ref. */
let app
let host
function mount(props = {}, initial = 'm') {
  const value = ref(initial)
  const changes = []
  host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp({
    setup: () => () => h(SegmentedControl, {
      options: [
        { value: 'm', label: 'Metres' },
        { value: 'ft', label: 'Feet' },
        { value: 'in', label: 'Inches' },
      ],
      label: 'Length unit',
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (v) => { value.value = v },
      onChange: (v) => changes.push(v),
    }),
  })
  app.mount(host)
  const group = () => host.querySelector('[role="radiogroup"]')
  const radios = () => [...host.querySelectorAll('[role="radio"]')]
  return { value, changes, group, radios }
}

const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))

afterEach(() => {
  app?.unmount()
  host?.remove()
})

describe('SegmentedControl — radiogroup semantics', () => {
  it('renders a labelled radiogroup with one radio per option', () => {
    const { group, radios } = mount()
    expect(group().getAttribute('aria-label')).toBe('Length unit')
    expect(radios().map((r) => r.textContent.trim())).toEqual(['Metres', 'Feet', 'Inches'])
    expect(radios().every((r) => r.getAttribute('type') === 'button')).toBe(true)
  })

  it('uses aria-labelledby instead of aria-label when given', () => {
    const { group } = mount({ labelledby: 'unit-label' })
    expect(group().getAttribute('aria-labelledby')).toBe('unit-label')
    expect(group().hasAttribute('aria-label')).toBe(false)
  })

  it('marks exactly the bound value aria-checked and gives it the only tab stop', () => {
    const { radios } = mount({}, 'ft')
    expect(radios().map((r) => r.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(radios().map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '0', '-1'])
  })

  it('puts the tab stop on the first enabled option when nothing is checked', () => {
    const { radios } = mount({
      options: [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
      ],
    }, null)
    expect(radios().map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '0'])
    expect(radios().every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true)
  })
})

describe('SegmentedControl — selection and keyboard', () => {
  it('click selects, updates v-model and emits change once', async () => {
    const { value, changes, radios } = mount()
    radios()[2].click()
    await nextTick()
    expect(value.value).toBe('in')
    expect(changes).toEqual(['in'])
    expect(radios()[2].getAttribute('aria-checked')).toBe('true')
    radios()[2].click()
    await nextTick()
    expect(changes).toEqual(['in']) // re-clicking the checked segment is not a change
  })

  it('ArrowRight / ArrowDown move to the next option, select it and focus it, wrapping', async () => {
    const { value, radios } = mount({}, 'ft')
    key(radios()[1], 'ArrowRight')
    await nextTick(); await nextTick()
    expect(value.value).toBe('in')
    expect(document.activeElement).toBe(radios()[2])
    key(radios()[2], 'ArrowDown')
    await nextTick(); await nextTick()
    expect(value.value).toBe('m')
    expect(document.activeElement).toBe(radios()[0])
  })

  it('ArrowLeft / ArrowUp move to the previous option, wrapping', async () => {
    const { value, radios } = mount({}, 'm')
    key(radios()[0], 'ArrowLeft')
    await nextTick(); await nextTick()
    expect(value.value).toBe('in')
    key(radios()[2], 'ArrowUp')
    await nextTick(); await nextTick()
    expect(value.value).toBe('ft')
  })

  it('Home and End jump to the first and last option', async () => {
    const { value, radios } = mount({}, 'ft')
    key(radios()[1], 'End')
    await nextTick(); await nextTick()
    expect(value.value).toBe('in')
    key(radios()[2], 'Home')
    await nextTick(); await nextTick()
    expect(value.value).toBe('m')
  })

  it('arrow keys skip disabled options', async () => {
    const { value, radios } = mount({
      options: [
        { value: 'm', label: 'Metres' },
        { value: 'ft', label: 'Feet', disabled: true },
        { value: 'in', label: 'Inches' },
      ],
    }, 'm')
    key(radios()[0], 'ArrowRight')
    await nextTick(); await nextTick()
    expect(value.value).toBe('in')
    expect(radios()[1].disabled).toBe(true)
  })

  it('Space and Enter select the focused option', async () => {
    const { value, radios } = mount({}, 'm')
    key(radios()[1], ' ')
    await nextTick()
    expect(value.value).toBe('ft')
    key(radios()[2], 'Enter')
    await nextTick()
    expect(value.value).toBe('in')
  })

  it('a disabled group selects nothing', async () => {
    const { value, radios, group } = mount({ disabled: true }, 'm')
    expect(group().getAttribute('aria-disabled')).toBe('true')
    radios()[1].click()
    key(radios()[0], 'ArrowRight')
    await nextTick()
    expect(value.value).toBe('m')
  })
})

describe('SegmentedControl — tokens only', () => {
  it('sizes segments from --touch-target and paints only with tier-2 utilities', () => {
    const { radios } = mount({}, 'm')
    const [checked, other] = radios()
    expect(checked.className).toContain('min-h-[var(--touch-target)]')
    expect(checked.className).toContain('bg-primary')
    expect(checked.className).toContain('text-primary-foreground')
    expect(other.className).toContain('text-fg3')
    expect(checked.className).toContain('focus-visible:ring-ring')
    for (const r of radios()) {
      expect(r.className).not.toMatch(/#[0-9a-f]{3,8}|rgb\(|hsl\(\d|gray-\d|navy-\d|blue-\d/i)
    }
  })
})
