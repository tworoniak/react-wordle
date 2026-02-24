# 🎯 React Wordle

A modern Wordle-inspired game built with React + TypeScript + Vite + Sass, featuring daily puzzles, free play mode, animations, keyboard support, and persistent statistics.

---

## 🚀 Tech Stack

- ⚛️ React (with Hooks)
- 🔷 TypeScript
- ⚡ Vite
- 🎨 Sass (SCSS architecture with @use / @forward)
- 💾 LocalStorage (stats persistence)

---

## ✨ Features

### 🎮 Game Modes

- Daily Mode — deterministic puzzle based on the current date
- Free Mode — unlimited randomly-seeded puzzles
- 🤘 Metal Mode - Metal band names

### 🧠 Gameplay

- 5-letter word, 6 attempts
- Word validation against a valid word list
- Proper duplicate-letter handling (Wordle rules)
- On-screen keyboard
- Physical keyboard support

### 🎨 UI & UX

- Tile flip animation on reveal
- Shake animation for invalid guesses
- Dynamic keyboard key coloring
- Responsive layout
- Accessible status messages (aria-live)

### 📊 Stats Tracking

- Games played
- Wins
- Current streak
- Max streak
- Daily puzzle completion lock
- Persisted via localStorage

### 📤 Sharing

- Emoji result grid (🟩 🟨 ⬛)
- Copy to clipboard support

---

## 🔮 Future Improvements

- Tile flip 3D transform refinement
- Dark mode toggle
- Timer / speed mode
- Animated modal for stats
- Hard mode (must use revealed hints)
- Online leaderboard
- PWA support

---

## 📂 Project Structure

```code
src/
  components/
    Board.tsx
    Keyboard.tsx
    Row.tsx
    Tile.tsx

  game/
    answers.json
    daily.ts
    keyboard.ts
    logic.ts
    pick.ts
    storage.ts
    types.ts
    words.ts

  hooks/
    useKey.ts
    useWordle.ts

  styles/
    abstracts/
      _index.scss
      _mixins.scss
      _variables.scss

    base/
      _base.scss
      _index.scss
      _reset.scss

    components/
      _board.scss
      _index.scss
      _keyboard.scss

    app.scss

  App.tsx
  main.tsx

```
