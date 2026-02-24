import type { Mark } from './types';

export function evaluateGuess(guess: string, answer: string): Mark[] {
  const g = guess.toUpperCase().split('');
  const a = answer.toUpperCase().split('');

  const marks: Mark[] = Array(g.length).fill('absent');

  const remaining = new Map<string, number>();

  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      marks[i] = 'correct';
    } else {
      remaining.set(a[i], (remaining.get(a[i]) ?? 0) + 1);
    }
  }

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
