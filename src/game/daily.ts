import { WORDS } from './words';

export function getDayId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Deterministic “random”: pick answer by day index.
// Uses UTC so it’s consistent across timezones.
export function pickDailyWord(date = new Date()) {
  const utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const base = Date.UTC(2022, 0, 1); // arbitrary fixed epoch
  const dayIndex = Math.floor((utc - base) / 86400000);
  const idx = ((dayIndex % WORDS.length) + WORDS.length) % WORDS.length;
  return WORDS[idx];
}
