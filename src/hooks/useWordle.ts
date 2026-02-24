import { useCallback, useMemo, useReducer } from 'react';
import { evaluateGuess } from '../game/logic';
import type { GameStatus, Mark, Row, Stats } from '../game/types';
import { loadStats, saveStats } from '../game/storage';

const WORD_LEN = 5;
const MAX_TRIES = 6;

type State = {
  answer: string;
  dayId: string; // for daily mode
  rows: Row[];
  current: string;
  status: GameStatus;
  message: string | null;

  // animations / UI flags
  shakeRowIndex: number | null; // trigger shake
  revealRowIndex: number | null; // trigger flip for just-submitted row

  // stats
  stats: Stats;
};

type Action =
  | { type: 'TYPE'; char: string }
  | { type: 'BACKSPACE' }
  | { type: 'SUBMIT'; validWords: Set<string> }
  | { type: 'RESET'; answer: string; dayId: string }
  | { type: 'SET_MESSAGE'; message: string | null };
// | { type: 'CLEAR_SHAKE' }
// | { type: 'CLEAR_REVEAL' };

function makeEmptyRows(): Row[] {
  return Array.from({ length: MAX_TRIES }, () => ({ guess: '', marks: null }));
}

function init({ answer, dayId }: { answer: string; dayId: string }): State {
  return {
    answer,
    dayId,
    rows: makeEmptyRows(),
    current: '',
    status: 'playing',
    message: null,
    shakeRowIndex: null,
    revealRowIndex: null,
    stats: loadStats(),
  };
}

function nextEmptyRowIndex(rows: Row[]) {
  return rows.findIndex((r) => r.marks === null);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET': {
      // Preserve stats across resets
      const stats = loadStats();
      return { ...init({ answer: action.answer, dayId: action.dayId }), stats };
    }

    case 'TYPE': {
      if (state.status !== 'playing') return state;
      if (state.current.length >= WORD_LEN) return state;
      return {
        ...state,
        current: (state.current + action.char).toUpperCase(),
        message: null,
      };
    }

    case 'BACKSPACE': {
      if (state.status !== 'playing') return state;
      if (!state.current) return state;
      return { ...state, current: state.current.slice(0, -1), message: null };
    }

    case 'SUBMIT': {
      if (state.status !== 'playing') return state;

      if (state.current.length !== WORD_LEN) {
        const idx = nextEmptyRowIndex(state.rows);
        return {
          ...state,
          message: `Need ${WORD_LEN} letters.`,
          shakeRowIndex: idx,
        };
      }

      const guess = state.current.toUpperCase();
      if (!action.validWords.has(guess)) {
        const idx = nextEmptyRowIndex(state.rows);
        return { ...state, message: 'Not in word list.', shakeRowIndex: idx };
      }

      const idx = nextEmptyRowIndex(state.rows);
      if (idx === -1) return state;

      const marks: Mark[] = evaluateGuess(guess, state.answer);
      const rows = state.rows.slice();
      rows[idx] = { guess, marks };

      const won = guess === state.answer.toUpperCase();
      const lastTry = idx === MAX_TRIES - 1;

      // update stats ONLY when game ends (won/lost) and only once per dayId
      let stats = state.stats;
      let status: GameStatus = 'playing';
      let message: string | null = null;

      if (won) {
        status = 'won';
        message = 'You got it!';
        stats = applyResult(stats, state.dayId, 'won');
      } else if (lastTry) {
        status = 'lost';
        message = `Answer: ${state.answer.toUpperCase()}`;
        stats = applyResult(stats, state.dayId, 'lost');
      }

      if (status !== 'playing') {
        saveStats(stats);
      }

      return {
        ...state,
        rows,
        current: '',
        status,
        message,
        shakeRowIndex: null,
        revealRowIndex: idx, // flip this row
        stats,
      };
    }

    case 'SET_MESSAGE':
      return { ...state, message: action.message };

    // case 'CLEAR_SHAKE':
    //   return { ...state, shakeRowIndex: null };

    // case 'CLEAR_REVEAL':
    //   return { ...state, revealRowIndex: null };

    default:
      return state;
  }
}

function applyResult(
  stats: Stats,
  dayId: string,
  result: 'won' | 'lost',
): Stats {
  // Prevent double-counting the same daily puzzle
  if (stats.lastPlayedDayId === dayId) return stats;

  const played = stats.played + 1;
  const wins = stats.wins + (result === 'won' ? 1 : 0);

  const currentStreak = result === 'won' ? stats.currentStreak + 1 : 0;
  const maxStreak = Math.max(stats.maxStreak, currentStreak);

  return {
    ...stats,
    played,
    wins,
    currentStreak,
    maxStreak,
    lastPlayedDayId: dayId,
    lastResult: result,
  };
}

export function useWordle(params: { answer: string; dayId: string }) {
  const [state, dispatch] = useReducer(reducer, params, init);

  const type = useCallback(
    (char: string) => dispatch({ type: 'TYPE', char }),
    [],
  );
  const backspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), []);

  const submit = useCallback(
    (validWords: Set<string>) => dispatch({ type: 'SUBMIT', validWords }),
    [],
  );

  const reset = useCallback((answer: string, dayId: string) => {
    dispatch({ type: 'RESET', answer, dayId });
  }, []);

  // const clearShake = useCallback(() => dispatch({ type: 'CLEAR_SHAKE' }), []);
  // const clearReveal = useCallback(() => dispatch({ type: 'CLEAR_REVEAL' }), []);

  const activeRowIndex = useMemo(
    () => nextEmptyRowIndex(state.rows),
    [state.rows],
  );

  return {
    state,
    type,
    backspace,
    submit,
    reset,
    activeRowIndex,
    // clearShake,
    // clearReveal,
  };
}
