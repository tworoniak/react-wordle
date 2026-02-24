// src/hooks/useWordle.ts
import { useCallback, useMemo, useReducer } from 'react';
import { evaluateGuess, type Mark } from '../game/logic';

const WORD_LEN = 5;
const MAX_TRIES = 6;

type Row = { guess: string; marks: Mark[] | null };

type State = {
  answer: string;
  rows: Row[];
  current: string;
  status: 'playing' | 'won' | 'lost';
  message: string | null;
};

type Action =
  | { type: 'TYPE'; char: string }
  | { type: 'BACKSPACE' }
  | { type: 'SUBMIT' }
  | { type: 'RESET'; answer: string }
  | { type: 'SET_MESSAGE'; message: string | null };

function init(answer: string): State {
  return {
    answer,
    rows: Array.from({ length: MAX_TRIES }, () => ({ guess: '', marks: null })),
    current: '',
    status: 'playing',
    message: null,
  };
}

function reducer(state: State, action: Action): State {
  if (action.type === 'RESET') return init(action.answer);

  if (state.status !== 'playing') {
    if (action.type === 'SET_MESSAGE')
      return { ...state, message: action.message };
    return state;
  }

  switch (action.type) {
    case 'TYPE': {
      if (state.current.length >= WORD_LEN) return state;
      return {
        ...state,
        current: state.current + action.char.toUpperCase(),
        message: null,
      };
    }
    case 'BACKSPACE': {
      if (!state.current) return state;
      return { ...state, current: state.current.slice(0, -1), message: null };
    }
    case 'SUBMIT': {
      if (state.current.length !== WORD_LEN) {
        return { ...state, message: `Need ${WORD_LEN} letters.` };
      }

      const idx = state.rows.findIndex((r) => r.marks === null);
      if (idx === -1) return state;

      const guess = state.current;
      const marks = evaluateGuess(guess, state.answer);

      const rows = state.rows.slice();
      rows[idx] = { guess, marks };

      const won = guess === state.answer.toUpperCase();
      const lastTry = idx === MAX_TRIES - 1;

      return {
        ...state,
        rows,
        current: '',
        status: won ? 'won' : lastTry ? 'lost' : 'playing',
        message: won
          ? 'You got it!'
          : lastTry
            ? `Answer: ${state.answer}`
            : null,
      };
    }
    case 'SET_MESSAGE':
      return { ...state, message: action.message };
    default:
      return state;
  }
}

export function useWordle(answer: string) {
  const [state, dispatch] = useReducer(reducer, answer, init);

  const type = useCallback(
    (char: string) => dispatch({ type: 'TYPE', char }),
    [],
  );
  const backspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), []);
  const submit = useCallback(() => dispatch({ type: 'SUBMIT' }), []);
  const reset = useCallback(
    (nextAnswer: string) => dispatch({ type: 'RESET', answer: nextAnswer }),
    [],
  );
  const setMessage = useCallback(
    (message: string | null) => dispatch({ type: 'SET_MESSAGE', message }),
    [],
  );

  const activeRowIndex = useMemo(
    () => state.rows.findIndex((r) => r.marks === null),
    [state.rows],
  );

  return {
    state,
    dispatch,
    type,
    backspace,
    submit,
    reset,
    setMessage,
    activeRowIndex,
  };
}
