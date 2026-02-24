// src/App.tsx
import { useMemo } from 'react';
import { Board } from './components/Board';
import { useWordle } from './hooks/useWordle';
import { useKey } from './hooks/useKey';

const WORDS = ['REACT', 'STATE', 'HOOKS', 'VITEZ', 'TYPES']; // replace later

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function App() {
  const initial = useMemo(() => pickWord(), []);
  const { state, type, backspace, submit, reset, activeRowIndex } =
    useWordle(initial);

  useKey({
    onChar: type,
    onBackspace: backspace,
    onEnter: submit,
  });

  return (
    <div className='app'>
      <header className='top'>
        <h1>Word Game</h1>
        <button onClick={() => reset(pickWord())}>New</button>
      </header>

      <Board
        rows={state.rows}
        current={state.current}
        activeRowIndex={activeRowIndex}
      />

      {state.message && <p className='message'>{state.message}</p>}
      <p className='status'>Status: {state.status}</p>
    </div>
  );
}
