# Chess Master

**Live at https://franceflapjack.github.io/chess-master/**

A chess course as a website. Every lesson is built on a real game or a real book, with an interactive board inside the text: play through the model game, then try the idea yourself.

Static site, no build. Run locally:

```
python3 scripts/serve.py
```

Open http://localhost:8000. Validate content with `node scripts/check-content.mjs`; check every puzzle against the engine with `node scripts/verify-puzzles.mjs "" 800`.

Eight tracks, 58 lessons: First steps, How to think, Tactics, Openings, Middlegame strategy, Endgames, Checkmate patterns, Study a whole game. Plus an openings book of 84 lines and a play page against Stockfish or the site's own engine, with an evaluation bar and a post-game review.

Play mode runs [Stockfish 18](https://github.com/nmrugg/stockfish.js) (GPL-3) as WebAssembly inside the page.

Libraries: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2), [cm-chessboard](https://github.com/shaack/cm-chessboard) (MIT), [marked](https://github.com/markedjs/marked) (MIT). See `vendor/VERSIONS.md`.

Game records are public facts; book quotations come only from public-domain or Creative Commons sources and every lesson lists its sources.
