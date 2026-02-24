import type { Mark } from '../game/types';

export function Tile({
  letter,
  mark,
  flip,
  flipDelayMs,
}: {
  letter: string;
  mark: Mark | null;
  flip?: boolean;
  flipDelayMs?: number;
}) {
  const cls = ['tile'];
  if (mark) cls.push(`tile--${mark}`);
  if (flip) cls.push('tile--flip');

  return (
    <div
      className={cls.join(' ')}
      style={{ animationDelay: `${flipDelayMs ?? 0}ms` }}
    >
      {letter}
    </div>
  );
}
