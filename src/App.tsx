import { useMemo, useState } from 'react';
import { Board } from './components/Board';
import Keyboard from './components/Keyboard';
import { useKey } from './hooks/useKey';
import { useWordle } from './hooks/useWordle';
import { buildKeyStatuses } from './game/keyboard';
import { VALID_WORDS, WORDS } from './game/words';
import { getDayId, pickDailyWord } from './game/daily';

function makeValidSet() {
  return new Set(VALID_WORDS.map((w) => w.toUpperCase()));
}

// ✅ pure deterministic PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ✅ pure: derives a stable “free” word from a seed
function pickFreeWord(seed: number) {
  const rnd = mulberry32(seed);
  const idx = Math.floor(rnd() * WORDS.length);
  return WORDS[idx];
}

export default function App() {
  const validSet = useMemo(() => makeValidSet(), []);
  const [mode, setMode] = useState<'daily' | 'free'>('daily');

  // ✅ only state we need for re-rolls
  const [seed, setSeed] = useState(0);

  // ✅ pure derivation: no Date.now, no effects
  const dayId = useMemo(() => {
    if (mode === 'daily') return getDayId(); // pure (based on Date, but deterministic for current day)
    return `free-${seed}`; // pure
  }, [mode, seed]);

  const answer = useMemo(() => {
    if (mode === 'daily') return pickDailyWord(); // deterministic per day
    return pickFreeWord(seed); // deterministic per seed
  }, [mode, seed]);

  const { state, type, backspace, submit, reset, activeRowIndex } = useWordle({
    answer,
    dayId,
  });

  useKey({
    onChar: type,
    onBackspace: backspace,
    onEnter: () => submit(validSet),
  });

  // Clear shake/reveal flags (effects that only set internal flags are OK; if your lint hates these too,
  // we can move them into CSS animationend handlers instead.)
  // (keep your existing effects here)

  const statuses = buildKeyStatuses(state.rows);
  const disabled = state.status !== 'playing';

  const onNew = () => {
    if (mode === 'daily') {
      // daily “new” just reloads today’s puzzle
      const d = getDayId();
      const a = pickDailyWord();
      reset(a, d);
      return;
    }

    // free “new” advances seed
    setSeed((s) => s + 1);

    // reset using the NEXT seed value, without reading Date/impure calls
    const nextSeed = seed + 1;
    const nextDayId = `free-${nextSeed}`;
    const nextAnswer = pickFreeWord(nextSeed);
    reset(nextAnswer, nextDayId);
  };

  const toggleMode = () => {
    setMode((m) => (m === 'daily' ? 'free' : 'daily'));
    // also reset the board to the new mode’s puzzle
    // (we can do it purely using current seed)
    const nextMode = mode === 'daily' ? 'free' : 'daily';
    if (nextMode === 'daily') {
      const d = getDayId();
      const a = pickDailyWord();
      reset(a, d);
    } else {
      const d = `free-${seed}`;
      const a = pickFreeWord(seed);
      reset(a, d);
    }
  };

  return (
    <div className='app'>
      <header className='top'>
        <h1>React Wordle</h1>

        <div className='top__actions'>
          <button type='button' onClick={toggleMode}>
            Mode: {mode}
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
