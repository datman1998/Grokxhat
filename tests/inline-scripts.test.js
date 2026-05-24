import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const HTML_FILES = [
  resolve(__dirname, '..', 'index.html'),
  resolve(__dirname, '..', 'public', 'mini-prompt.html'),
]

function extractScriptBodies(html) {
  const bodies = []
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || ''
    if (/\bsrc\s*=/.test(attrs)) continue
    bodies.push(m[2])
  }
  return bodies
}

describe('inline <script> blocks in HTML files', () => {
  for (const file of HTML_FILES) {
    it(`${file} has at least one inline script`, () => {
      const html = readFileSync(file, 'utf8')
      const bodies = extractScriptBodies(html)
      expect(bodies.length).toBeGreaterThan(0)
    })

    it(`${file} inline scripts parse without SyntaxError`, () => {
      const html = readFileSync(file, 'utf8')
      const bodies = extractScriptBodies(html)
      for (const [i, body] of bodies.entries()) {
        expect(
          () => new Function(body),
          `inline <script> #${i + 1} in ${file} failed to parse`,
        ).not.toThrow()
      }
    })
  }
})
