// src/game/logic.ts
export type Mark = 'correct' | 'present' | 'absent';

export function evaluateGuess(guess: string, answer: string): Mark[] {
  const g = guess.toUpperCase().split('');
  const a = answer.toUpperCase().split('');

  const marks: Mark[] = Array(g.length).fill('absent');

  // Track remaining letters in answer after "correct" matches
  const remaining = new Map<string, number>();

  // Pass 1: correct positions
  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      marks[i] = 'correct';
    } else {
      remaining.set(a[i], (remaining.get(a[i]) ?? 0) + 1);
    }
  }

  // Pass 2: present (wrong spot) if available in remaining pool
  for (let i = 0; i < g.length; i++) {
    if (marks[i] === 'correct') continue;
    const c = g[i];
    const count = remaining.get(c) ?? 0;
    if (count > 0) {
      marks[i] = 'present';
      remaining.set(c, count - 1);
    }
  }

  return marks;
}
