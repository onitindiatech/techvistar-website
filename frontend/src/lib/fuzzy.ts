export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 1;
  if (t.includes(q)) return 1 + (t.startsWith(q) ? 0.5 : 0);

  let ti = 0;
  let score = 0;
  for (let qi = 0; qi < q.length; qi += 1) {
    const ch = q[qi];
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    score += 1 / (1 + found - ti);
    ti = found + 1;
  }
  return score / q.length;
}
