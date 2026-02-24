// src/hooks/useKey.ts
import { useEffect } from 'react';

type Handlers = {
  onChar: (c: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
};

export function useKey({ onChar, onEnter, onBackspace }: Handlers) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Enter') return onEnter();
      if (e.key === 'Backspace') return onBackspace();

      const isLetter = /^[a-zA-Z]$/.test(e.key);
      if (isLetter) onChar(e.key);
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBackspace, onChar, onEnter]);
}
