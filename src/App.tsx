import { useMemo, useState } from 'react';
import { Board } from './components/Board';
import Keyboard from './components/Keyboard';
import { useKey } from './hooks/useKey';
import { useWordle } from './hooks/useWordle';
import { buildKeyStatuses } from './game/keyboard';
import { getDayId, pickDailyWord } from './game/daily';
import { pickFromList } from './game/pick';
import {
  WORDS,
  VALID_WORDS,
  METAL_BAND_WORDS,
  METAL_VALID_WORDS,
} from './game/words';

function makeValidSet(words: string[]) {
  return new Set(words.map((w) => w.toUpperCase()));
}

export default function App() {
  const [mode, setMode] = useState<'daily' | 'free' | 'metal-bands'>('daily');
  const [seed, setSeed] = useState(0);

  const dayId = useMemo(() => {
    if (mode === 'daily') return getDayId();
    return `${mode}-${seed}`; // free-0, metal-bands-0, etc (pure)
  }, [mode, seed]);

  const answer = useMemo(() => {
    if (mode === 'daily') return pickDailyWord(); // your normal daily
    if (mode === 'free') return pickFromList(WORDS, seed); // normal free play
    return pickFromList(METAL_BAND_WORDS, seed); // 🔥 metal mode
  }, [mode, seed]);

  const validSet = useMemo(() => {
    if (mode === 'metal-bands') return makeValidSet(METAL_VALID_WORDS);
    return makeValidSet(VALID_WORDS);
  }, [mode]);

  const { state, type, backspace, submit, reset, activeRowIndex } = useWordle({
    answer,
    dayId,
  });

  useKey({
    onChar: type,
    onBackspace: backspace,
    onEnter: () => submit(validSet),
  });

  const statuses = buildKeyStatuses(state.rows);
  const disabled = state.status !== 'playing';

  const onNew = () => {
    if (mode === 'daily') {
      const d = getDayId();
      const a = pickDailyWord();
      reset(a, d);
      return;
    }

    const nextSeed = seed + 1;
    setSeed(nextSeed);

    const nextDayId = `${mode}-${nextSeed}`;
    const nextAnswer =
      mode === 'free'
        ? pickFromList(WORDS, nextSeed)
        : pickFromList(METAL_BAND_WORDS, nextSeed);

    reset(nextAnswer, nextDayId);
  };

  const cycleMode = () => {
    const next =
      mode === 'daily' ? 'free' : mode === 'free' ? 'metal-bands' : 'daily';
    setMode(next);

    // reset immediately into the new mode
    if (next === 'daily') {
      reset(pickDailyWord(), getDayId());
    } else if (next === 'free') {
      reset(pickFromList(WORDS, seed), `free-${seed}`);
    } else {
      reset(pickFromList(METAL_BAND_WORDS, seed), `metal-bands-${seed}`);
    }
  };

  return (
    <div className={`app ${mode === 'metal-bands' ? 'app--metal' : ''}`}>
      <header className='top'>
        <h1>React Wordle</h1>

        <div className='top__actions'>
          <button type='button' onClick={cycleMode}>
            Mode: {mode === 'metal-bands' ? 'metal 🤘' : mode}
          </button>
          <button type='button' onClick={onNew}>
            New
          </button>
        </div>
      </header>

      <Board
        rows={state.rows}
        current={state.current}
        activeRowIndex={activeRowIndex}
        shakeRowIndex={state.shakeRowIndex}
        revealRowIndex={state.revealRowIndex}
      />

      <Keyboard
        onChar={type}
        onEnter={() => submit(validSet)}
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
