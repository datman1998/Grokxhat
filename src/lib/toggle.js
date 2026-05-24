const SINGLE_SELECT = new Set(['subject', 'aspect']);
const MAX_MULTI = 3;

export function toggleSelection(state, category, index) {
  if (SINGLE_SELECT.has(category)) {
    state.selected[category] = [index];
    return { accepted: true, action: 'selected' };
  }

  const existing = state.selected[category].indexOf(index);

  if (existing > -1) {
    state.selected[category].splice(existing, 1);
    return { accepted: true, action: 'deselected' };
  }

  if (state.selected[category].length >= MAX_MULTI) {
    return { accepted: false, reason: 'max-reached' };
  }

  state.selected[category].push(index);
  return { accepted: true, action: 'selected' };
}
