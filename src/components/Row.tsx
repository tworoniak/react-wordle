import type { Mark } from '../game/types';
import { Tile } from './Tile';

export function Row({
  guess,
  marks,
  isShaking,
  isRevealing,
}: {
  guess: string;
  marks: Mark[] | null;
  isShaking?: boolean;
  isRevealing?: boolean;
}) {
  const letters = guess.toUpperCase().padEnd(5, ' ').split('');

  return (
    <div className={`row${isShaking ? ' row--shake' : ''}`}>
      {letters.map((ch, i) => (
        <Tile
          key={i}
          letter={ch === ' ' ? '' : ch}
          mark={marks?.[i] ?? null}
          flip={Boolean(isRevealing && marks)}
          flipDelayMs={isRevealing ? i * 120 : 0}
        />
      ))}
    </div>
  );
}
