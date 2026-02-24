import type { Stats } from './types';

const KEY = 'react-wordle:stats:v1';

export const DEFAULT_STATS: Stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedDayId: null,
  lastResult: null,
};

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as Stats;
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: Stats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}
