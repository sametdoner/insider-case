# Horse Racing Game

Single-page Vue 2 app that simulates 6 horse-racing rounds with a generated pool of 20 horses. Races can be regenerated and run with animated progress, live track view, and recorded results.

## Prerequisites
- Node.js 18+ (recommended)
- npm (comes with Node)

## Install
```bash
npm install
```

## Run in dev mode
```bash
npm run dev
```
Then open the URL printed by Vite (defaults to `http://localhost:5173`).

## Run tests
```bash
npm test
```

## Build for production
```bash
npm run build
```
You can preview the build locally with:
```bash
npm run preview
```

## Project structure (high level)
- `src/components/` – UI components (controls, track, horse list, program, results).
- `src/store/` – Vuex store modules for horses, races, and UI state.
- `tests/` – Vitest unit/e2e-style tests covering store logic and UI flow.
