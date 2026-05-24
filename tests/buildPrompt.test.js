import { describe, it, expect } from 'vitest';
import { buildPrompt } from '../src/lib/buildPrompt.js';
import { createInitialState } from '../src/lib/state.js';

const DATA = {
  subject: [
    { no: 'Person', en: 'A detailed portrait of a person' },
    { no: 'Landskap', en: 'A vast landscape' },
  ],
  outfit: [
    { no: 'Bikini', en: 'wearing a tiny micro bikini' },
    { no: 'Latex', en: 'wearing a glossy black latex bodysuit' },
  ],
  style: [
    { no: 'Foto', en: 'ultra-photorealistic, 8k resolution' },
    { no: 'Anime', en: 'vibrant anime style illustration' },
  ],
  lighting: [
    { no: 'Golden', en: 'warm golden hour lighting' },
  ],
  camera: [
    { no: '85mm', en: 'shot on 85mm lens' },
  ],
  color: [
    { no: 'Warm', en: 'warm color palette' },
  ],
  mood: [
    { no: 'Epic', en: 'epic scale, awe-inspiring atmosphere' },
  ],
  aspect: [
    { no: '1:1', en: '--ar 1:1' },
    { no: '16:9', en: '--ar 16:9' },
  ],
};

describe('buildPrompt', () => {
  it('falls back to the default scene when nothing is selected and no custom text is provided (flux)', () => {
    const state = createInitialState();
    expect(buildPrompt({ state, DATA })).toBe('A beautiful detailed scene.');
  });

  it('uses the selected subject when no custom text is provided', () => {
    const state = createInitialState();
    state.selected.subject = [1];
    expect(buildPrompt({ state, DATA })).toBe('A vast landscape.');
  });

  it('custom text overrides the selected subject', () => {
    const state = createInitialState();
    state.selected.subject = [0];
    expect(buildPrompt({ state, customText: 'My own scene', DATA })).toBe('My own scene.');
  });

  it('trims surrounding whitespace from custom text', () => {
    const state = createInitialState();
    expect(buildPrompt({ state, customText: '   Hi there   ', DATA })).toBe('Hi there.');
  });

  it('flux mode joins parts with ". " and ends with a single period', () => {
    const state = createInitialState();
    state.selected.subject = [0];
    state.selected.style = [0];
    state.selected.lighting = [0];
    expect(buildPrompt({ state, DATA })).toBe(
      'A detailed portrait of a person. ultra-photorealistic, 8k resolution. warm golden hour lighting.',
    );
  });

  it('flux mode collapses double periods when a part already ends with a period', () => {
    const state = createInitialState();
    expect(buildPrompt({ state, customText: 'Already ends with period.', DATA })).toBe(
      'Already ends with period.',
    );
  });

  it('midjourney mode joins parts with ", "', () => {
    const state = createInitialState();
    state.mode = 'midjourney';
    state.selected.subject = [0];
    state.selected.style = [0];
    state.selected.lighting = [0];
    expect(buildPrompt({ state, DATA })).toBe(
      'A detailed portrait of a person, ultra-photorealistic, 8k resolution, warm golden hour lighting',
    );
  });

  it('emits outfit chips immediately after the subject', () => {
    const state = createInitialState();
    state.mode = 'midjourney';
    state.selected.subject = [0];
    state.selected.outfit = [1];
    state.selected.style = [0];
    expect(buildPrompt({ state, DATA })).toBe(
      'A detailed portrait of a person, wearing a glossy black latex bodysuit, ultra-photorealistic, 8k resolution',
    );
  });

  it('appends the aspect ratio in flux mode', () => {
    const state = createInitialState();
    state.selected.subject = [0];
    state.selected.aspect = [1];
    expect(buildPrompt({ state, DATA })).toBe('A detailed portrait of a person. --ar 16:9');
  });

  it('appends the aspect ratio in midjourney mode', () => {
    const state = createInitialState();
    state.mode = 'midjourney';
    state.selected.subject = [0];
    state.selected.aspect = [1];
    expect(buildPrompt({ state, DATA })).toBe('A detailed portrait of a person --ar 16:9');
  });

  it('appends the negative prompt only in midjourney mode', () => {
    const state = createInitialState();
    state.mode = 'midjourney';
    state.selected.subject = [0];
    expect(buildPrompt({ state, negative: 'blurry, low quality', DATA })).toBe(
      'A detailed portrait of a person --no blurry, low quality',
    );
  });

  it('ignores the negative prompt in flux mode', () => {
    const state = createInitialState();
    state.selected.subject = [0];
    const result = buildPrompt({ state, negative: 'blurry', DATA });
    expect(result).not.toContain('--no');
    expect(result).toBe('A detailed portrait of a person.');
  });

  it('ignores an empty/whitespace negative prompt even in midjourney mode', () => {
    const state = createInitialState();
    state.mode = 'midjourney';
    state.selected.subject = [0];
    expect(buildPrompt({ state, negative: '   ', DATA })).toBe('A detailed portrait of a person');
  });

  it('aspect ratio is appended after the negative prompt prefix slot (aspect first, then --no)', () => {
    const state = createInitialState();
    state.mode = 'midjourney';
    state.selected.subject = [0];
    state.selected.aspect = [0];
    expect(buildPrompt({ state, negative: 'blurry', DATA })).toBe(
      'A detailed portrait of a person --ar 1:1 --no blurry',
    );
  });
});
