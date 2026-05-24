function pickN(pool, desired, random) {
  const count = Math.min(desired, pool.length);
  const chosen = new Set();
  while (chosen.size < count) {
    chosen.add(Math.floor(random() * pool.length));
  }
  return Array.from(chosen);
}

export function randomizeSelection({ DATA, random = Math.random }) {
  const selected = {
    subject: [],
    outfit: [],
    style: [],
    lighting: [],
    camera: [],
    color: [],
    mood: [],
    aspect: [],
  };

  selected.subject.push(Math.floor(random() * DATA.subject.length));
  selected.outfit = pickN(DATA.outfit, Math.floor(random() * 2) + 1, random);

  for (const cat of ['style', 'lighting', 'camera', 'color', 'mood']) {
    selected[cat] = pickN(DATA[cat], Math.floor(random() * 2) + 1, random);
  }

  selected.aspect.push(Math.floor(random() * DATA.aspect.length));

  return selected;
}
