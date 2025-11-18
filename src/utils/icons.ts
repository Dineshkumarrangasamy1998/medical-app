import { defineComponent, h } from 'vue'

type SizeProp = number | string

function sizeToPx(size: SizeProp): string | number {
  return typeof size === 'number' ? size : size
}

export const EyeIcon = defineComponent({
  name: 'EyeIcon',
  inheritAttrs: false,
  props: {
    size: { type: [Number, String], default: 20 },
    strokeWidth: { type: [Number, String], default: 2 },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': props.strokeWidth as any,
          width: sizeToPx(props.size),
          height: sizeToPx(props.size),
          ...attrs,
        },
        [
          h('path', { d: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z' }),
          h('circle', { cx: '12', cy: '12', r: '3' }),
        ],
      )
  },
})

export const EyeOffIcon = defineComponent({
  name: 'EyeOffIcon',
  inheritAttrs: false,
  props: {
    size: { type: [Number, String], default: 20 },
    strokeWidth: { type: [Number, String], default: 2 },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': props.strokeWidth as any,
          width: sizeToPx(props.size),
          height: sizeToPx(props.size),
          ...attrs,
        },
        [
          h('path', { d: 'M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94' }),
          h('path', { d: 'M1 1l22 22' }),
          h('path', { d: 'M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 3-3 3 3 0 0 0-.88-2.12' }),
        ],
      )
  },
})

function icon(name: string, children: Array<Record<string, string>>) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      size: { type: [Number, String], default: 20 },
      strokeWidth: { type: [Number, String], default: 2 },
    },
    setup(props, { attrs }) {
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': props.strokeWidth as any,
            width: sizeToPx(props.size),
            height: sizeToPx(props.size),
            ...attrs,
          },
          children.map((attrs) => h('path', attrs)),
        )
    },
  })
}

export const LogoutIcon = icon('LogoutIcon', [
  { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
  { d: 'M16 17l5-5-5-5' },
  { d: 'M21 12H9' },
])

export const UserIcon = defineComponent({
  name: 'UserIcon',
  inheritAttrs: false,
  props: { size: { type: [Number, String], default: 20 }, strokeWidth: { type: [Number, String], default: 2 } },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': props.strokeWidth as any, width: sizeToPx(props.size), height: sizeToPx(props.size), ...attrs },
        [
          h('circle', { cx: '12', cy: '8', r: '4' }),
          h('path', { d: 'M4 20c0-3.3137 3.5817-6 8-6s8 2.6863 8 6' }),
        ],
      )
  },
})

export const EditIcon = icon('EditIcon', [
  { d: 'M3 21h6l11.2-11.2a2.5 2.5 0 0 0-3.54-3.54L5.46 16.46 3 21z' },
])

export const TrashIcon = icon('TrashIcon', [
  { d: 'M3 6h18' },
  { d: 'M8 6V4h8v2' },
  { d: 'M6 6l1 16h10l1-16' },
  { d: 'M9 10v10' },
  { d: 'M15 10v10' },
])

export const MenuIcon = icon('MenuIcon', [
  { d: 'M4 6h16' },
  { d: 'M4 12h16' },
  { d: 'M4 18h16' },
])

export const CloseIcon = icon('CloseIcon', [
  { d: 'M6 18L18 6' },
  { d: 'M6 6l12 12' },
])

export const BellIcon = icon('BellIcon', [
  { d: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Z' },
  { d: 'M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z' },
])

export const SettingsIcon = defineComponent({
  name: 'SettingsIcon',
  inheritAttrs: false,
  props: { size: { type: [Number, String], default: 20 }, strokeWidth: { type: [Number, String], default: 2 } },
  setup(props, { attrs }) {
    return () =>
      h(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': props.strokeWidth as any, width: sizeToPx(props.size), height: sizeToPx(props.size), ...attrs },
        [
          h('circle', { cx: '12', cy: '12', r: '3' }),
          h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6c.26-.11.55-.18.85-.21H10a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .7.4 1.34 1 1.51.26.11.55.18.85.21H17a1.65 1.65 0 0 0 1.51 1c.7 0 1.34.4 1.51 1V10c.7 0 1.34.4 1.51 1 .11.26.18.55.21.85V12a1.65 1.65 0 0 0-1.51 1c-.11.26-.18.55-.21.85V15Z' }),
        ],
      )
  },
})
