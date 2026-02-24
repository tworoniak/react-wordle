import type { Mark, Row as RowType } from '../game/types';
import { Row } from './Row';

export function Board({
  rows,
  current,
  activeRowIndex,
  shakeRowIndex,
  revealRowIndex,
}: {
  rows: RowType[];
  current: string;
  activeRowIndex: number;
  shakeRowIndex: number | null;
  revealRowIndex: number | null;
}) {
  return (
    <div className='board'>
      {rows.map((row, idx) => {
        const isActive = idx === activeRowIndex;
        const guess = isActive ? current : row.guess;
        const marks: Mark[] | null = row.marks;

        return (
          <Row
            key={idx}
            guess={guess}
            marks={marks}
            isShaking={shakeRowIndex === idx}
            isRevealing={revealRowIndex === idx}
          />
        );
      })}
    </div>
  );
}
