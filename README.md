# Chess Master

**Live at https://franceflapjack.github.io/chess-master/**

A chess course as a website. Every lesson is built on a real game or a real book, with an interactive board inside the text: play through the model game, then try the idea yourself.

Static site, no build. Run locally:

```
python3 scripts/serve.py
```

Open http://localhost:8000. Validate content with `node scripts/check-content.mjs`; check every puzzle against the engine with `node scripts/verify-puzzles.mjs "" 800`.

Eight tracks, 58 lessons: First steps, How to think, Tactics, Openings, Middlegame strategy, Endgames, Checkmate patterns, Study a whole game. Plus an openings book of 84 lines, a play page against Stockfish or the site's own engine with an evaluation bar and a post-game review, and a My games page that pulls your games from chess.com or Lichess (or a pasted PGN), reviews them, reports which openings you really play and where you leave the book, and turns your own early mistakes into drills. Only finished games are ever fetched.

Play mode runs [Stockfish 18](https://github.com/nmrugg/stockfish.js) (GPL-3) as WebAssembly inside the page.

Libraries: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2), [cm-chessboard](https://github.com/shaack/cm-chessboard) (MIT), [marked](https://github.com/markedjs/marked) (MIT). See `vendor/VERSIONS.md`.

Game records are public facts; book quotations come only from public-domain or Creative Commons sources and every lesson lists its sources.

## Using this

Copyright (c) 2026 FranceFlapjack. Free to read, learn from, share and build on, **with credit and not for sale** — the code under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/), the lessons and the design under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Credit reads "Chess Master by FranceFlapjack" with a link to https://franceflapjack.github.io/chess-master/. Everything under `vendor/` keeps its own licence (Stockfish is GPL-3). See [LICENSE](LICENSE).

`robots.txt` asks the generative-AI crawlers not to take the lessons for training. That is an opt-out the well-behaved ones honour, not a lock.
