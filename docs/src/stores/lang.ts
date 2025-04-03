import { atom } from 'nanostores'

export const Langs = {
  HTML: 'HTML',
  React: 'React',
} as const

const $lang = atom<keyof typeof Langs>(Langs.HTML)

export default $lang
