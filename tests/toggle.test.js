import { describe, it, expect } from 'vitest';
import { toggleSelection } from '../src/lib/toggle.js';
import { createInitialState } from '../src/lib/state.js';

describe('toggleSelection', () => {
  describe('single-select categories (subject, aspect)', () => {
    it('selecting a second subject replaces the first', () => {
      const state = createInitialState();
      toggleSelection(state, 'subject', 2);
      const result = toggleSelection(state, 'subject', 5);
      expect(result).toEqual({ accepted: true, action: 'selected' });
      expect(state.selected.subject).toEqual([5]);
    });

    it('selecting a second aspect replaces the first', () => {
      const state = createInitialState();
      toggleSelection(state, 'aspect', 0);
      toggleSelection(state, 'aspect', 1);
      expect(state.selected.aspect).toEqual([1]);
    });

    it('re-toggling a single-select chip just re-selects it (no deselect path)', () => {
      const state = createInitialState();
      toggleSelection(state, 'subject', 3);
      toggleSelection(state, 'subject', 3);
      expect(state.selected.subject).toEqual([3]);
    });
  });

  describe('multi-select categories', () => {
    it('allows up to 3 selections in style', () => {
      const state = createInitialState();
      expect(toggleSelection(state, 'style', 0).accepted).toBe(true);
      expect(toggleSelection(state, 'style', 1).accepted).toBe(true);
      expect(toggleSelection(state, 'style', 2).accepted).toBe(true);
      expect(state.selected.style).toEqual([0, 1, 2]);
    });

    it('rejects a 4th selection with reason "max-reached" and does not mutate state', () => {
      const state = createInitialState();
      toggleSelection(state, 'style', 0);
      toggleSelection(state, 'style', 1);
      toggleSelection(state, 'style', 2);
      const before = [...state.selected.style];

      const result = toggleSelection(state, 'style', 3);

      expect(result).toEqual({ accepted: false, reason: 'max-reached' });
      expect(state.selected.style).toEqual(before);
    });

    it('re-toggling an already-selected multi-select chip deselects it', () => {
      const state = createInitialState();
      toggleSelection(state, 'style', 0);
      toggleSelection(state, 'style', 1);

      const result = toggleSelection(state, 'style', 0);

      expect(result).toEqual({ accepted: true, action: 'deselected' });
      expect(state.selected.style).toEqual([1]);
    });

    it('after deselecting, a new chip can be added back up to the cap', () => {
      const state = createInitialState();
      toggleSelection(state, 'style', 0);
      toggleSelection(state, 'style', 1);
      toggleSelection(state, 'style', 2);
      toggleSelection(state, 'style', 0); // deselect
      expect(toggleSelection(state, 'style', 3).accepted).toBe(true);
      expect(state.selected.style).toEqual([1, 2, 3]);
    });

    it('the cap is per-category — other categories are unaffected', () => {
      const state = createInitialState();
      toggleSelection(state, 'style', 0);
      toggleSelection(state, 'style', 1);
      toggleSelection(state, 'style', 2);
      expect(toggleSelection(state, 'lighting', 0).accepted).toBe(true);
      expect(toggleSelection(state, 'lighting', 1).accepted).toBe(true);
    });
  });
});
