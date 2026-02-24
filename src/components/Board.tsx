// src/components/Board.tsx
import type { Mark } from '../game/logic';

function tileClass(mark: Mark | null) {
  if (!mark) return 'tile';
  return `tile tile--${mark}`;
}

export function Board({
  rows,
  current,
  activeRowIndex,
}: {
  rows: { guess: string; marks: Mark[] | null }[];
  current: string;
  activeRowIndex: number;
}) {
  return (
    <div className='board'>
      {rows.map((row, idx) => {
        const isActive = idx === activeRowIndex;
        const letters = (isActive ? current : row.guess)
          .padEnd(5, ' ')
          .split('');

        return (
          <div className='row' key={idx}>
            {letters.map((ch, i) => {
              const mark = row.marks?.[i] ?? null;
              return (
                <div className={tileClass(mark)} key={i}>
                  {ch === ' ' ? '' : ch}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
