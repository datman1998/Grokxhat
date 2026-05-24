import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const HTML_FILES = [
  resolve(__dirname, '..', 'index.html'),
  resolve(__dirname, '..', 'public', 'mini-prompt.html'),
]

function extractClassicScriptBodies(html) {
  // Only classic inline scripts — module scripts use ES module syntax (import/export)
  // which `new Function()` rejects. Module scripts are validated by Vite at build
  // time and by the dedicated test files (buildPrompt.test.js, etc.) at runtime.
  const bodies = []
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || ''
    if (/\bsrc\s*=/.test(attrs)) continue
    if (/\btype\s*=\s*["']module["']/i.test(attrs)) continue
    bodies.push(m[2])
  }
  return bodies
}

describe('classic inline <script> blocks in HTML files', () => {
  for (const file of HTML_FILES) {
    it(`${file} classic inline scripts parse without SyntaxError`, () => {
      const html = readFileSync(file, 'utf8')
      const bodies = extractClassicScriptBodies(html)
      for (const [i, body] of bodies.entries()) {
        expect(
          () => new Function(body),
          `classic inline <script> #${i + 1} in ${file} failed to parse`,
        ).not.toThrow()
      }
    })
  }
})
