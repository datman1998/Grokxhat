import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DATA, EXAMPLES } from '../src/lib/data.js'

const INDEX = resolve(__dirname, '..', 'index.html')
const MINI = resolve(__dirname, '..', 'public', 'mini-prompt.html')

// Pull a top-level `const NAME = <literal>` value out of an inline <script> body
// without executing the surrounding code (which references `document` etc).
function extractLiteral(source, identifier) {
  const head = `const ${identifier} = `
  const idx = source.indexOf(head)
  if (idx === -1) return null
  let i = idx + head.length
  while (i < source.length && /\s/.test(source[i])) i++
  const open = source[i]
  if (open !== '{' && open !== '[') return null
  const close = open === '{' ? '}' : ']'
  const start = i
  let depth = 0
  while (i < source.length) {
    const c = source[i]
    if (c === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++
      continue
    }
    if (c === '/' && source[i + 1] === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++
      i += 2
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      const quote = c
      i++
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i++
        i++
      }
      i++
      continue
    }
    if (c === open) depth++
    else if (c === close) {
      depth--
      if (depth === 0) { i++; break }
    }
    i++
  }
  return source.slice(start, i)
}

function evalLiteral(expr) {
  return new Function(`return (${expr})`)()
}

function loadFromFile(file, identifier) {
  const html = readFileSync(file, 'utf8')
  const literal = extractLiteral(html, identifier)
  if (!literal) throw new Error(`Could not find const ${identifier} in ${file}`)
  return evalLiteral(literal)
}

describe('i18n parity', () => {
  for (const file of [INDEX, MINI]) {
    it(`${file} declares STRINGS with no + en locales`, () => {
      const strings = loadFromFile(file, 'STRINGS')
      expect(strings).toBeTypeOf('object')
      expect(Object.keys(strings).sort()).toEqual(['en', 'no'])
    })

    it(`${file} has the same key set in no and en`, () => {
      const strings = loadFromFile(file, 'STRINGS')
      const noKeys = Object.keys(strings.no).sort()
      const enKeys = Object.keys(strings.en).sort()
      expect(noKeys).toEqual(enKeys)
    })

    it(`${file} has non-empty string values in both locales`, () => {
      const strings = loadFromFile(file, 'STRINGS')
      for (const lang of ['no', 'en']) {
        for (const [key, value] of Object.entries(strings[lang])) {
          expect(typeof value, `${lang}.${key}`).toBe('string')
          expect(value.length, `${lang}.${key}`).toBeGreaterThan(0)
        }
      }
    })
  }
})

describe('chip + example data shape (src/lib/data.js)', () => {
  it('every DATA entry has no, en, prompt fields', () => {
    for (const [group, items] of Object.entries(DATA)) {
      expect(Array.isArray(items), `DATA.${group}`).toBe(true)
      items.forEach((item, idx) => {
        expect(typeof item.no, `DATA.${group}[${idx}].no`).toBe('string')
        expect(typeof item.en, `DATA.${group}[${idx}].en`).toBe('string')
        expect(typeof item.prompt, `DATA.${group}[${idx}].prompt`).toBe('string')
      })
    }
  })

  it('every EXAMPLES entry has bilingual title/category/desc + english prompt', () => {
    expect(Array.isArray(EXAMPLES)).toBe(true)
    EXAMPLES.forEach((ex, idx) => {
      for (const field of ['title', 'category', 'desc']) {
        expect(typeof ex[field]?.no, `EXAMPLES[${idx}].${field}.no`).toBe('string')
        expect(typeof ex[field]?.en, `EXAMPLES[${idx}].${field}.en`).toBe('string')
      }
      expect(typeof ex.prompt, `EXAMPLES[${idx}].prompt`).toBe('string')
    })
  })
})

describe('mini-prompt OPTIONS shape', () => {
  it('every OPTIONS entry has [no, en, value] (aspect adds w, h)', () => {
    const options = loadFromFile(MINI, 'OPTIONS')
    for (const [group, items] of Object.entries(options)) {
      expect(Array.isArray(items), `OPTIONS.${group}`).toBe(true)
      items.forEach((entry, idx) => {
        expect(Array.isArray(entry), `OPTIONS.${group}[${idx}]`).toBe(true)
        expect(typeof entry[0], `OPTIONS.${group}[${idx}][0] (no)`).toBe('string')
        expect(typeof entry[1], `OPTIONS.${group}[${idx}][1] (en)`).toBe('string')
        expect(typeof entry[2], `OPTIONS.${group}[${idx}][2] (value)`).toBe('string')
        if (group === 'aspect') {
          expect(typeof entry[3], `OPTIONS.aspect[${idx}][3] (w)`).toBe('number')
          expect(typeof entry[4], `OPTIONS.aspect[${idx}][4] (h)`).toBe('number')
        }
      })
    }
  })
})
