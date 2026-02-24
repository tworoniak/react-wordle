export type Mark = 'correct' | 'present' | 'absent';

export type Row = {
  guess: string;
  marks: Mark[] | null;
};

export type GameStatus = 'playing' | 'won' | 'lost';

export type KeyStatus = Mark;

export type Stats = {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDayId: string | null; // e.g. "2026-02-24"
  lastResult: 'won' | 'lost' | null;
};
