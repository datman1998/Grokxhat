export function buildPrompt({ state, customText = '', negative = '', DATA }) {
  const parts = [];

  const subjects = state.selected.subject.map(i => DATA.subject[i].en);
  const trimmedCustom = customText.trim();

  if (trimmedCustom) {
    parts.push(trimmedCustom);
  } else if (subjects.length > 0) {
    parts.push(subjects[0]);
  } else {
    parts.push('A beautiful detailed scene');
  }

  state.selected.outfit.forEach(i => parts.push(DATA.outfit[i].en));
  state.selected.style.forEach(i => parts.push(DATA.style[i].en));
  state.selected.lighting.forEach(i => parts.push(DATA.lighting[i].en));
  state.selected.camera.forEach(i => parts.push(DATA.camera[i].en));
  state.selected.color.forEach(i => parts.push(DATA.color[i].en));
  state.selected.mood.forEach(i => parts.push(DATA.mood[i].en));

  let finalPrompt = '';

  if (state.mode === 'flux') {
    finalPrompt = parts.join('. ');
    finalPrompt = finalPrompt.replace(/\.\s*\./g, '.').trim();
    if (!finalPrompt.endsWith('.')) finalPrompt += '.';
  } else {
    finalPrompt = parts.join(', ').replace(/, ,/g, ',').trim();
  }

  if (state.selected.aspect.length > 0) {
    const arCode = DATA.aspect[state.selected.aspect[0]].en;
    finalPrompt += ' ' + arCode;
  }

  const trimmedNeg = negative.trim();
  if (trimmedNeg && state.mode === 'midjourney') {
    finalPrompt += ` --no ${trimmedNeg}`;
  }

  return finalPrompt;
}
