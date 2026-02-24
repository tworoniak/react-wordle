import { useMemo } from 'react';
import { Board } from './components/Board';
import Keyboard from './components/Keyboard';
import { useWordle } from './hooks/useWordle';
import { useKey } from './hooks/useKey';
import { buildKeyStatuses } from './game/keyboard';
import { WORDS } from './game/words';

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function App() {
  const initial = useMemo(() => pickWord(), []);
  const { state, type, backspace, submit, reset, activeRowIndex } =
    useWordle(initial);

  useKey({
    onChar: type,
    onEnter: submit,
    onBackspace: backspace,
  });

  const statuses = buildKeyStatuses(state.rows);
  const disabled = state.status !== 'playing';

  return (
    <div className='app'>
      <header className='top'>
        <h1>Word Game</h1>
        <button onClick={() => reset(pickWord())} type='button'>
          New
        </button>
      </header>

      <Board
        rows={state.rows}
        current={state.current}
        activeRowIndex={activeRowIndex}
      />

      <Keyboard
        onChar={type}
        onEnter={submit}
        onBackspace={backspace}
        statuses={statuses}
        disabled={disabled}
      />

      {state.message && (
        <p className='message' role='status' aria-live='polite'>
          {state.message}
        </p>
      )}
    </div>
  );
}
