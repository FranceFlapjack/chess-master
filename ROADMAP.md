# Roadmap

Status: **Phase 0 scaffold delivered 2026-09-12.** Awaiting design comments.

## Phase 0 — Scaffold (done 2026-09-12)
- Shell, sidebar curriculum with progress, hash router, home page.
- Board component: drag + click input, eased animation, legal-move dots, last-move / check / selection tints, arrows, promotion picker, illegal-move shake, synthesised sounds (Web Audio), mute.
- Lesson renderer with `board` / `pgn` / `try` fences; annotated game viewer with keyboard nav; exercises with hint / reset / show solution.
- Progress: points per day, streak with one rest day per week, 12-week activity grid, export/import.
- One complete lesson: Tactics → The Greek Gift (Greco c.1620, Colle–O'Hanlon 1930, Markland–Klundt 1971, Lasker–Bauer 1889).
- `scripts/check-content.mjs` validates all FENs, PGNs and solutions.

## Phase 1 — Content (next)
Write the tracks in this order, one branch each, running the checker on every commit:
1. Tactics (10 more lessons) — puzzle sets per theme curated from the Lichess CC0 puzzle DB.
2. Checkmate patterns (6).
3. Endgames (8) — lean on Capablanca ch. 1–2 (public domain).
4. Openings (10) — Wikibooks lines + Lichess explorer stats (needs `js/explorer.js`).
5. Middlegame strategy (10) — Nimzowitsch / Lasker for prophylaxis and planning.
6. How to think (3), Study a whole game (3).
7. First steps (7, beginner track).

Open questions for the owner: which openings they already play (repertoire choice); Lichess / chess.com username for a future "your games" lesson type.

## Phase 2 — Exercises & review
- Daily puzzle review mode (spaced repetition over solved/failed puzzles).
- Lichess explorer stats on opening lessons (`explorer.lichess.org/masters`, no auth).
- Variations in the PGN viewer (chess.js drops them; needs a small parser).

## Phase 3 — Design drafts
- Iterate `css/tokens.css` and layout on owner comments. Dark mode. Mobile polish. Custom "cute" piece set as SVG.
- Sound: replace synthesised set with CC0 samples if they feel better.

## Later — Play mode
- Vs engine: Stockfish single-thread lite WASM (~7 MB), vendored, in a Web Worker.
- Local two-player on one screen.
- Online vs friend needs a server; decide then.

## Non-goals (for now)
- Accounts / cloud sync. Progress is local, with export/import.
- A build step or framework.
