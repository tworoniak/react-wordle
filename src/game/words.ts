import ANSWERS from './answers.json';

export const WORDS: string[] = ANSWERS;
export const VALID_WORDS: string[] = ANSWERS; // or expand later

// --- METAL MODE: REAL 5-LETTER BANDS ONLY ---

export const METAL_BAND_WORDS: string[] = [
  'OPETH',
  'GHOST',
  'DEATH',
  'VENOM',
  'CYNIC',
  'TORCH', // Wolvhammer-adjacent vibes
  'SATYR', // Satyricon-adjacent conceptually
  'DRAIN', // crossover/thrash adjacent
  'SODOM', // thrash
  'TAAKE', // black metal
  'XIBAL', // Xibalba (hardcore/metal)
  'KORPI', // Korpiklaani short but used as name
  'VREID', // black metal
  'ABHOR', // Abhor (black metal)
  'SARGE', // Sargeist-adjacent vibe
];

// Include extra metal-ish guess words too (optional).
export const METAL_VALID_WORDS: string[] = [
  ...METAL_BAND_WORDS,
  ...VALID_WORDS,
  'BLEAK',
  'GRIND',
  'RIFTS',
  'BLAST',
  'DOOMY',
  'SLUDG',
  'BLACK',
  'CHAOS',
];
