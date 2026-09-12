# Roadmap

Status: **Phase 0 scaffold + design draft 2 + play page (Stockfish) delivered 2026-09-12.** Next: engine project (own bot), then Tactics content.

## Phase 0 — Scaffold (done 2026-09-12)
- Shell, sidebar curriculum with progress, hash router, home page.
- Board component: drag + click input, eased animation, legal-move dots, last-move / check / selection tints, arrows, promotion picker, illegal-move shake, synthesised sounds (Web Audio), mute.
- Lesson renderer with `board` / `pgn` / `try` fences; annotated game viewer with keyboard nav; exercises with hint / reset / show solution.
- Progress: points per day, streak with one rest day per week, 12-week activity grid, export/import.
- One complete lesson: Tactics → The Greek Gift (Greco c.1620, Colle–O'Hanlon 1930, Markland–Klundt 1971, Lasker–Bauer 1889).
- `scripts/check-content.mjs` validates all FENs, PGNs and solutions.

## Phase 1 — Content (in progress)
Progress 2026-09-13: Tactics 6/11 ready (Greek gift, pin, fork, skewer, discovered attack, back rank), 44 puzzle moves verified against Stockfish with `scripts/verify-puzzles.mjs`. Games added: Morphy Opera 1858, Réti–Tartakower 1910, Fischer–Reshevsky 1958. Bernstein–Capablanca 1914 is used as a position only (full record not obtainable from an open source yet).

Write the tracks in this order, one branch each, running both checkers on every commit:
1. Tactics — remaining: removing the defender, deflection & decoy, zwischenzug, double bishop sacrifice, clearance & interference. Puzzle sets per theme from the Lichess CC0 puzzle DB later.
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
- Draft 2 (2026-09-12): metar-taf language — white, Helvetica Neue, uppercase labels, hairlines, square centred board. Owner will supply their own piece set and board art later; keep `--sq-*` tokens and `assets/pieces/` ready for it.
- Still to do: dark mode, mobile polish, eval bar on the play page.
- Sound: replace synthesised set with CC0 samples if they feel better.

## Play mode & the bot (planned with the owner 2026-09-12)

The owner wants their **own AI chess bot**: it plays against people, against bots their friends make, and stands as the "unbeatable last boss". Honest framing first:

- **A from-scratch engine that beats Stockfish is not a realistic goal.** Stockfish and Leela are the work of hundreds of people over decades, trained on billions of positions. Nobody builds a stronger one as a side project.
- **A from-scratch engine that beats every human you know and every bot your friends write is very realistic**, and building it is the best chess-programming education there is. A well-made JavaScript engine reaches roughly 1800–2200 Elo in the browser; with a small neural-net evaluation trained offline it can go higher.
- **The "last boss" can be two-tiered:** your own bot as the boss you built, and Stockfish (open source, runs in the browser) as the secret final form nobody beats.

It is not "a whole other program". The engine is a separate module in this repo (`js/engine/…`) that runs in a Web Worker so the page never freezes. Friends' bots plug in through the standard engine protocol, UCI (Universal Chess Interface): a text protocol every chess engine speaks (`position …`, `go depth 6`, `bestmove e2e4`). If a friend writes their bot in Python, it runs as its own process and a tiny bridge (Node or Python WebSocket) relays UCI lines to the arena page.

### Bot phase 1 — a real engine, simple version — **done 2026-09-12** (`js/engine/bot/`)
- `board.js`: own 0x88 move generator with make/unmake and Zobrist hashing; perft matches all six standard positions (`node scripts/perft.mjs`, ~7M nodes/s).
- `search.js`: iterative deepening, negamax alpha-beta, quiescence with delta pruning, transposition table (1M entries), killers, history, null-move pruning, check extension, late-move reductions, PVS. ~1.5M nodes/s, depth 9–10 in under a second.
- `eval.js`: material + Michniewski piece-square tables, tapered king table, bishop pair.
- `uci.js` speaks UCI; `worker.js` runs it in the site (`js/engine/bot.js`), `scripts/bot-uci.mjs` runs it standalone on stdin/stdout for any GUI or match runner.
- `scripts/match.mjs [games] [elo] [botMs] [sfMs]` plays it against Stockfish (Elo-limited) under Node and prints the score. This is the yardstick for every improvement.
- On the play page as the "Chess Learn Bot" opponent, 0.8 s per move.
- **Ladder so far (2026-09-12, 300 ms per move each side):** vs Stockfish@1500 +2 =0 −0; @1800 +3 =0 −1; @2000 +3 =0 −1. Caveat: Stockfish's Elo limiter is calibrated for longer thinking times, so at 300 ms the limited engine is probably weaker than its label; treat these as a relative yardstick, and rerun with `botMs=sfMs=1000` before quoting a number.
- Known limits: `stop` cannot interrupt a running search (searches are time-bounded instead); no opening book; no pawn-structure or king-safety terms yet.

### Bot phase 2 — make it strong — **version 0.2 delivered 2026-09-12**
- Evaluation v2: doubled/isolated/passed pawns, king pawn shelter and open files near the king, mobility for all pieces, rooks on open/semi-open files and the seventh, bishop pair, insufficient-material draws, mop-up bonus to finish won endgames, tempo.
- Search: aspiration windows and futility pruning added to the phase-1 set.
- Opening book: `scripts/build-book.mjs` compiles 84 curated mainline openings (mainstream theory, as in Wikibooks' Chess Opening Theory) into `js/engine/bot/book.js`; the bot follows it for the first 12 moves and picks randomly among book moves, so games vary. The Lichess explorer API now requires authorisation, so the CC0 masters database could not be used directly; revisit with a token if a bigger book is wanted.
- Stop: the search cannot be interrupted, so the site restarts the bot's worker on take-back / new game (`UciEngine.restart`).
- Yardstick changed: Stockfish at a **fixed node count** (`node scripts/match.mjs 6 nodes:50000`) instead of UCI_Elo, which is not calibrated for 300 ms moves. `BOT_DIR=<dir>` plays an older build for before/after comparisons.
- **Ladder, fixed-node Stockfish, 300 ms per bot move (2026-09-12):**

  | Stockfish nodes/move | v0.1 | v0.2 |
  |---|---|---|
  | 2 000 | +3 =0 −3 | +5 =1 −0 |
  | 8 000 | +0 =0 −6 | +0 =0 −6 |
  | 20 000 | +0 =0 −6 | +0 =0 −6 |

  So v0.2 is clearly stronger than v0.1, and the bot at 300 ms sits between Stockfish at 2k and 8k nodes. Next rungs to add: 3k and 5k nodes, and longer bot times.
- Still to do here: bitboard move generator for speed; pawn hash; a learned evaluation (phase 3).

### Bot phase 3 — a learned evaluation (optional, the "smartest" part)
- Train a small NNUE-style network offline in Python on Lichess evaluations (CC0), export weights to JSON, run inference in JS.
- This is how modern engines got their strength jump; a small net is feasible in-browser.

### Play page & arena
- Human vs Stockfish: **done 2026-09-12** (`js/play.js`, `js/engine/`): seven strengths (UCI_Elo 1320…2600, Boss = full), colour choice, take-back, hint, resign, results and points recorded. Eval bar still to do.
- Bot vs bot arena: two UCI engines (workers or external bridges) play a match; Elo ladder kept in localStorage; PGN export of every game.
- Final boss tier: Stockfish 18 lite single-thread WASM (~7 MB), vendored under `vendor/stockfish/` (GPL-3).
- Local two-player on one screen is trivial. Online vs friend needs a server; decide then.

## Non-goals (for now)
- Accounts / cloud sync. Progress is local, with export/import.
- A build step or framework.
