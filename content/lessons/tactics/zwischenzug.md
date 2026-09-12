---
id: tactics/zwischenzug
track: Tactics
title: The in-between move
lede: You expected a recapture. Instead comes a check or a bigger threat, and only then the recapture. The German word is Zwischenzug.
level: 2
sources:
  - Composed positions for this lesson, checked with Stockfish 18.
  - The term and its standard examples are described in the Wikipedia article "Zwischenzug" (CC BY-SA), https://en.wikipedia.org/wiki/Zwischenzug
---

## The idea

Most exchanges run on autopilot: they take, you take back. The in-between move breaks the rhythm. Before recapturing, you insert a move your opponent must answer, a check or a threat against the queen, and collect the recapture afterwards with interest. It works because the piece you were going to recapture is not going anywhere.

```board
fen: r1b1kb1r/ppp2ppp/2n5/3q4/3pn3/5N2/PPP2PPP/RNBQR1K1 w kq - 0 8
arrows: b1c3, c3e4:alt
highlight: d5, e4
caption: Italian Game, after 7.Bxd5 Qxd5. White is a piece down and could take the knight with Rxe4+ at once. Better is 8.Nc3, attacking the queen first: the knight on e4 is still there next move.
```

**The question to ask:** must I recapture right now, or is there a check first?

## Play it

<p class="puzzle-intro">1 · Italian Game, a line every club player meets. White has just given a bishop on d5 and can take the knight on e4 back at once. Find something better first.</p>

```try
fen: r1b1kb1r/ppp2ppp/2n5/3q4/3pn3/5N2/PPP2PPP/RNBQR1K1 w kq - 0 8
solution: Nc3 Qa5 Nxe4
hint: The knight on e4 is pinned to the king by the rook and cannot leave. Attack the queen first, then take.
prompt: White to play. Find the in-between move.
success: The queen had to move, and the knight was still there to be taken, with a lead in development on top.
```

<p class="puzzle-intro">2 · You are Black. White's bishop has just captured on f4. You could recapture with the pawn on g5 and call it even.</p>

```try
fen: r2qkb1r/pppp1p1p/8/4n1p1/5B2/8/PP1P1PPP/R2QK2R b KQkq - 0 1
solution: Nd3+ Ke2 Nxf4+
hint: A knight check first. The bishop on f4 is not going anywhere.
prompt: Black to play. Do better than gxf4.
success: The check cost White a tempo, and the bishop was taken for free instead of traded.
```

## Remember

- Before every recapture, look for a check or a threat you can play first.
- The in-between move is strongest when the piece you will recapture cannot escape.
- The same idea defends: when your opponent expects a recapture, they often stop looking at your checks.
