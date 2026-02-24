import type { KeyStatus, Mark, Row } from './types';

const rank: Record<KeyStatus, number> = { absent: 0, present: 1, correct: 2 };

function mergeStatus(prev: KeyStatus | undefined, next: KeyStatus) {
  if (!prev) return next;
  return rank[next] > rank[prev] ? next : prev;
}

export function buildKeyStatuses(rows: Row[]) {
  const map: Record<string, KeyStatus> = {};

  for (const row of rows) {
    if (!row.marks) continue;
    const letters = row.guess.toUpperCase().split('');
    for (let i = 0; i < letters.length; i++) {
      const c = letters[i];
      const m = row.marks[i] as Mark;
      map[c] = mergeStatus(map[c], m);
    }
  }

  return map;
}
