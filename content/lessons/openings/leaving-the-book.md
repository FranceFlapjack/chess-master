---
id: openings/leaving-the-book
track: Openings
title: What to do when you leave the book
lede: Your opponent plays a move you have never seen. Good. Now the opening is a checklist, not a memory test.
level: 2
sources:
  - J. R. Capablanca, Chess Fundamentals (1921), general principles of development — public domain, https://www.gutenberg.org/ebooks/33870
  - Positions checked with Stockfish 18; the "line" puzzles accept any move the engine rates close to best.
---

## The idea

Out of book, run four questions in order. Is my king safe, and is the opponent's? Which of my pieces is still at home? Which pawn break do I want, and is it ready? What is my worst-placed piece, and where would it be better? Answer them and a good move appears. Not the best move, but a good one, and out of book that is enough.

```board
fen: r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 b - - 0 9
arrows: c6a5:alt, c8e6:alt, c8b7:alt, h7h6:alt
caption: A quiet position with no forcing moves. Several moves are fine: …Na5, …Be6, …Bb7, …h6. The puzzles on this page accept any move the engine rates as good, because that is what out-of-book play is.
```

## Play it

<p class="puzzle-intro">1 · No book move to remember. Improve a piece. Any good move is accepted.</p>

```try
type: line
fen: r1bq1rk1/2p1bppp/p1np1n2/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR1K1 b - - 0 9
solution: Na5
hint: Which black piece is doing the least? The knight on c6 is blocked by its own pawns. It can attack the bishop and come to c4 later.
prompt: Black to play. Find a good, sensible move.
success: If your move was accepted, it was within a fraction of a pawn of the engine's choice. That is the standard out of book: good enough, not perfect.
```

<p class="puzzle-intro">2 · The premature attack. White played 4.Ng5 before castling. You are Black. The answer is a pawn break, not a defence.</p>

```try
type: line
fen: r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4
solution: d5 exd5 Na5
hint: Strike at the bishop's diagonal with …d5, then hit the bishop with the knight rather than recapturing.
prompt: Black to play. Answer the early knight sortie.
success: …d5 blocked the bishop and …Na5 sends it away. White has moved a knight twice and a bishop twice; Black is developing.
```

<p class="puzzle-intro">3 · Both sides have developed. What now? You are White.</p>

```try
type: line
fen: r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5
solution: O-O
hint: King safety first. Nothing else is urgent, and the rook comes to e1 next.
prompt: White to play. Answer the first question on the checklist.
success: Castling is the move that keeps every option open. Out of book, when nothing is urgent, put the king away.
```

## Remember

- Four questions: king safety, pieces at home, pawn breaks, worst piece.
- Out of book, "good" beats "best". A sensible move played quickly is worth more than a perfect move found in ten minutes.
- If the opponent breaks the principles, punish it with development, not with your own pawn grabs.
