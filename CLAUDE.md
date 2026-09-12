# Chess Learn

A chess course as a website: lessons built on real games and real books, with an interactive board inside the text. Play modes (vs engine, local two-player, online) come later.

Static site, **no build step, no framework** — deliberate. Plain HTML/CSS/ES modules; libraries are vendored under `vendor/` (see `vendor/VERSIONS.md`). Local only for now; GitHub Pages later.

**Before starting any work here, read `ROADMAP.md`** — it holds the agreed phases and what is next.

## About the owner

- Former architect, now a student pilot. Comfortable with HTML/JS and Python. Club-level chess player (~1200+); the beginner track exists for their friends.
- Wants explanations before implementation, additive development, and no claims that something works without running it.
- Likes the "Read more" game viewers (moves + description). Openings are the top priority. Does not want progress export/import in the UI (removed 2026-09-13).
- Design is iterated by comment: keep visual decisions in `css/tokens.css` so each comment is a small diff. Draft 2 follows the owner's metar-taf app: white ground, Helvetica Neue, small uppercase letter-spaced labels, hairline borders, square corners, outlined uppercase secondary buttons, full-square boards in a left-aligned column. Draft 3 (2026-09-13) adds the theme colour: dark green `--accent` (#1f5f45) for everything selected, done or primary (logo, current lesson, ticks, progress bars, primary buttons, current move, activity grid). Lesson portraits get an old-film treatment in CSS (`.board-aside`: warm monochrome, soft contrast, grain, vignette; the owner rejected a halftone); a `board` block takes `image`, `alt`, `credit`, optional `tone: faded|dark` and `focus: x% y%`. Photos live in `content/images/`, only public-domain or CC from Wikimedia Commons, credited in `sources:`. The owner will supply piece and board art; do not redesign those.

## Run

```
python3 scripts/serve.py
```
then open http://localhost:8000. ES modules and `fetch` do not work over `file://`.

When testing in the in-app Browser pane, keep the pane visible: hidden tabs pause `requestAnimationFrame`, so board animations (and anything awaiting them, like the play page's engine reply) stall until the tab is shown again. The dev server (`scripts/serve.py`) sends `Cache-Control: no-store`; if the browser still runs stale modules, fetch them with `{cache: 'reload'}` once.

Validate content before committing:
```
node scripts/check-content.mjs
node scripts/verify-puzzles.mjs tactics/ 800
```
The second asks Stockfish whether every reader move in every `try` block is its best (or a near-equal second). A composed puzzle that fails it is wrong, not the engine; fix the position. Historical sacrifices that engines dislike may stay, with an honesty note in the puzzle intro.

## Layout

- `index.html` shell; `js/app.js` router + sidebar + home; `js/lesson.js` Markdown → components.
- `js/board.js` is the single board component (cm-chessboard rendering + chess.js rules + sounds). Every board in the app goes through it.
- `js/pgn-viewer.js` annotated game viewer; `js/exercise.js` "try it" blocks; `js/progress.js` localStorage progress/points/streak; `js/activity-grid.js` the 12-week grid.
- `js/openings.js` the Openings book page (`#/openings/<id>`): every line from `scripts/build-book.mjs` (which also emits `content/openings/lines.json` with family, name and note) shown in the game viewer with drills from either side. Add or rename lines in the builder, never in the JSON.
- `js/play.js` play-vs-computer page; `js/engine/uci.js` is the UCI-over-Worker client every engine (Stockfish now, our own later) goes through; `js/engine/stockfish.js` loads `vendor/stockfish/` (GPL-3, ~7 MB) and defines the strength ladder.
- `js/engine/bot/` is our own engine (board → eval → search → uci → worker). Before touching `board.js` run `node scripts/perft.mjs`; after any search/eval change run `node scripts/match.mjs 4 1500` and record the score in ROADMAP.md.
- `content/curriculum.json` fixes track and lesson order; a lesson shows only when `"ready": true` and `content/lessons/<track>/<slug>.md` exists.
- `content/games/*.pgn` full games with `{comments}`; shared between lessons.

## Lesson format

Markdown with frontmatter (`id`, `track`, `title`, `lede`, `level`, `sources:` list). Three fences become components:

    ```board            ```pgn                ```try
    fen: …              file: name.pgn        fen: …
    arrows: e2e4, g1f3:alt   (or inline PGN)  solution: Bxh7+ Kxh7 Ng5+
    highlight: h7       orientation: b        hint: … / prompt: … / success: …
    caption: …
    ```

Arrow types: `main` (default), `alt`, `bad`; knight moves draw as an L. `try` solutions alternate reader move / auto reply, starting with the reader. Add `type: line` (optional `tolerance: N` cp, default 50) for opening drills: the verifier then accepts any reader move within that margin of the engine's best, and the page says "not the book move" instead of "wrong".

**Lesson shape (owner's rule):** short core idea → puzzles (`try` blocks, the main body) → a short "Remember" list → long explanations and full games collapsed behind `+++ Read more: title` … `+++` sections. A lesson ticks itself in the sidebar when all its puzzles are solved; "Mark as read" is the fallback for lessons without puzzles.

## Content rules — non-negotiable

1. **Game move lists are facts** and free to use. Annotations are ours.
2. **Quote at length only from public-domain or CC sources** and say so in `sources:`: Capablanca *Chess Fundamentals* (1921), Lasker's *Manual* (1925/27), Nimzowitsch *My System* (original Hereford translation only), Wikibooks *Chess Opening Theory* (CC BY-SA, attribute), Wikipedia (CC BY-SA, attribute), Lichess DB/explorer (CC0).
3. **Modern books and videos** (Rozman, Silman, …): paraphrase and credit, quotes of a sentence or two at most, link to the video. Never copy chapters.
4. **Every lesson has a non-empty `sources:` block.** The checker enforces it.
5. **Verify game records against a source before adding them**; do not trust memory for move lists.

## Workflow

Branch before editing; merge to `main` with `--ff-only` after the owner approves. Run the content checker before every commit.
