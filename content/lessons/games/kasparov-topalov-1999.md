---
id: games/kasparov-topalov-1999
track: Study a whole game
title: Kasparov – Topalov, Wijk aan Zee 1999
lede: Kasparov's Immortal. A rook sacrifice, a king walk from a7 to d1 and back, and calculation twenty moves deep.
level: 3
sources:
  - Kasparov – Topalov, Hoogovens, Wijk aan Zee 1999. Move list checked against Wikipedia, "Kasparov's Immortal" (CC BY-SA), https://en.wikipedia.org/wiki/Kasparov%27s_Immortal
  - Puzzle moves checked with Stockfish 18. Note the honesty remark in the first pause.
---

## How to use this lesson

The famous move, 24.Rxd4, is not in the puzzles: engines have shown it was not the strongest, and that Black could have held with 25…Qxe7 instead of 25…Kb6. That takes nothing from what follows. Once the king steps to b6 the combination is sound and forced, and it is the longest forced king hunt ever played in a top tournament. The pauses are inside it.

## Play it

<p class="puzzle-intro">1 · After 24…cxd4. The rook is gone. Continue the attack with the rook that is left.</p>

```try
fen: b2r3r/k4p1p/p2q1np1/Np1P4/3p1Q2/P4PPB/1PP4P/1K2R3 w - - 0 25
solution: Re7+
tolerance: 60
hint: Check on the seventh, and the queen will follow to d4 with another check.
prompt: White to play.
success: 25.Re7+ and after 25…Kb6 (25…Qxe7 was the defence) 26.Qxd4+ Kxa5 27.b4+ Ka4 28.Qc3 the king is in a net on a4 and the hunt is on.
```

<p class="puzzle-intro">2 · After 30…Qc4. The king is on a4 with the white queen on c3. Find the sequence that drives it into the white camp.</p>

```try
fen: 3r3r/1R3p1p/p4np1/1p6/kPq5/P1Q2PPB/2P4P/1K6 w - - 1 31
solution: Qxf6 Kxa3 Qxa6+ Kxb4 c3+ Kxc3 Qa1+ Kd2 Qb2+ Kd1
tolerance: 100
hint: Take the knight, then check with the queen on a6 and the pawn on c3. The king has to take everything, and each capture takes it further from home.
prompt: White to play. The king walk.
success: 31.Qxf6! Kxa3 32.Qxa6+ Kxb4 33.c3+! Kxc3 34.Qa1+ Kd2 35.Qb2+ Kd1. The black king stands on d1, next to White's own king. 36.Bf1! follows, and the Middlegame track's attacking lesson shows the finish.
```

## What to take from it

- Calculation this deep is built from forcing moves: every move in the hunt is a check or a capture with a threat.
- Material means nothing while the king is running. Kasparov gave a rook and a knight and never counted.
- Even the greatest game has a defence the engine finds. Know it, and admire the game anyway.

+++ Read more: the game in full

```pgn
file: kasparov-topalov-1999.pgn
```

Topalov, then twenty-three, was a serious rival and a fine defender. Kasparov later said he had calculated the line from 24.Rxd4 to 37.Rd7 at the board, some fifteen moves, and that he had missed 25…Qxe7 only because it looked so unnatural.

+++
