export type Mark = 'correct' | 'present' | 'absent';

export type Row = {
  guess: string;
  marks: Mark[] | null;
};

export type GameStatus = 'playing' | 'won' | 'lost';
