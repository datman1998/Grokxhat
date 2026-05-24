import { describe, it, expect } from 'vitest';
import { randomizeSelection } from '../src/lib/randomize.js';

function seq(values) {
  let i = 0;
  return () => values[i++ % values.length];
}

const FULL_DATA = {
  subject: Array.from({ length: 12 }, (_, i) => ({ no: `S${i}`, en: `subject-${i}` })),
  outfit: Array.from({ length: 10 }, (_, i) => ({ no: `O${i}`, en: `outfit-${i}` })),
  style: Array.from({ length: 10 }, (_, i) => ({ no: `St${i}`, en: `style-${i}` })),
  lighting: Array.from({ length: 8 }, (_, i) => ({ no: `L${i}`, en: `lighting-${i}` })),
  camera: Array.from({ length: 7 }, (_, i) => ({ no: `C${i}`, en: `camera-${i}` })),
  color: Array.from({ length: 7 }, (_, i) => ({ no: `Co${i}`, en: `color-${i}` })),
  mood: Array.from({ length: 6 }, (_, i) => ({ no: `M${i}`, en: `mood-${i}` })),
  aspect: Array.from({ length: 5 }, (_, i) => ({ no: `A${i}`, en: `--ar ${i}:1` })),
};

describe('randomizeSelection', () => {
  it('subject and aspect always have exactly one selection', () => {
    for (let i = 0; i < 200; i++) {
      const sel = randomizeSelection({ DATA: FULL_DATA });
      expect(sel.subject).toHaveLength(1);
      expect(sel.aspect).toHaveLength(1);
    }
  });

  it('outfit, style, lighting, camera, color, mood each have 1 or 2 selections', () => {
    for (let i = 0; i < 200; i++) {
      const sel = randomizeSelection({ DATA: FULL_DATA });
      for (const cat of ['outfit', 'style', 'lighting', 'camera', 'color', 'mood']) {
        expect(sel[cat].length).toBeGreaterThanOrEqual(1);
        expect(sel[cat].length).toBeLessThanOrEqual(2);
      }
    }
  });

  it('indices are always within bounds of the corresponding pool', () => {
    for (let i = 0; i < 200; i++) {
      const sel = randomizeSelection({ DATA: FULL_DATA });
      for (const cat of Object.keys(FULL_DATA)) {
        for (const idx of sel[cat]) {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThan(FULL_DATA[cat].length);
        }
      }
    }
  });

  it('selections within a multi-pick category are unique (no duplicates)', () => {
    for (let i = 0; i < 200; i++) {
      const sel = randomizeSelection({ DATA: FULL_DATA });
      for (const cat of ['outfit', 'style', 'lighting', 'camera', 'color', 'mood']) {
        expect(new Set(sel[cat]).size).toBe(sel[cat].length);
      }
    }
  });

  it('is deterministic with a seeded random function', () => {
    const seed = () => seq([0, 0.5, 0.99, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95]);
    const a = randomizeSelection({ DATA: FULL_DATA, random: seed() });
    const b = randomizeSelection({ DATA: FULL_DATA, random: seed() });
    expect(a).toEqual(b);
  });

  it('does not hang when itemsToSelect exceeds pool length (regression for the original index.html:958 bug)', () => {
    // The legacy `while(chosen.size < itemsToSelect)` loop would spin forever
    // if itemsToSelect exceeded pool.length, because Set could never grow past
    // pool.length. pickN now caps the desired count to pool.length.
    //
    // Single-item pools across the board + a random that always returns 0.9
    // forces Math.floor(0.9*2)+1 === 2 for every desired-count computation, so
    // every multi-pick category demands 2 from a 1-item pool — exactly the
    // condition the original code couldn't handle.
    const tinyData = {
      subject: [{ no: 'S', en: 's' }],
      outfit: [{ no: 'O', en: 'o' }],
      style: [{ no: 'St', en: 'st' }],
      lighting: [{ no: 'L', en: 'l' }],
      camera: [{ no: 'C', en: 'c' }],
      color: [{ no: 'Co', en: 'co' }],
      mood: [{ no: 'M', en: 'm' }],
      aspect: [{ no: 'A', en: 'a' }],
    };
    const constantHighRandom = () => 0.9;

    const sel = randomizeSelection({ DATA: tinyData, random: constantHighRandom });

    for (const cat of Object.keys(tinyData)) {
      expect(sel[cat]).toEqual([0]);
    }
  });
});
