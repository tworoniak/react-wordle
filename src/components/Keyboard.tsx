// src/components/Keyboard.tsx
import type { KeyStatus } from '../game/keyboard';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

function keyClass(status?: KeyStatus) {
  if (!status) return 'key';
  return `key key--${status}`;
}

export function Keyboard({
  onChar,
  onEnter,
  onBackspace,
  statuses,
  disabled,
}: {
  onChar: (c: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  statuses: Record<string, KeyStatus>;
  disabled?: boolean;
}) {
  return (
    <div className='keyboard' aria-label='On screen keyboard'>
      <div className='keyboard__row'>
        {ROWS[0].split('').map((c) => (
          <button
            key={c}
            className={keyClass(statuses[c])}
            onClick={() => onChar(c)}
            disabled={disabled}
            type='button'
          >
            {c}
          </button>
        ))}
      </div>

      <div className='keyboard__row'>
        {ROWS[1].split('').map((c) => (
          <button
            key={c}
            className={keyClass(statuses[c])}
            onClick={() => onChar(c)}
            disabled={disabled}
            type='button'
          >
            {c}
          </button>
        ))}
      </div>

      <div className='keyboard__row'>
        <button
          className='key key--wide'
          onClick={onEnter}
          disabled={disabled}
          type='button'
        >
          Enter
        </button>

        {ROWS[2].split('').map((c) => (
          <button
            key={c}
            className={keyClass(statuses[c])}
            onClick={() => onChar(c)}
            disabled={disabled}
            type='button'
          >
            {c}
          </button>
        ))}

        <button
          className='key key--wide'
          onClick={onBackspace}
          disabled={disabled}
          type='button'
          aria-label='Backspace'
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
