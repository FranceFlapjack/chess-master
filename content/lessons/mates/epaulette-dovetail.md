---
id: mates/epaulette-dovetail
track: Checkmate patterns
title: Epaulette and dovetail mates
lede: Two queen mates where the king is trapped by its own pieces. Learn the shapes and you will see them one move before your opponent does.
level: 2
sources:
  - Wikipedia, "Checkmate pattern" (CC BY-SA), https://en.wikipedia.org/wiki/Checkmate_pattern — the dovetail mate is also called Cozio's mate after Carlo Cozio (1766).
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The shapes

**Epaulette mate.** The king stands on the edge with its own pieces on both sides, like the epaulettes on a uniform. The queen mates from two squares away on the file, covering the three squares in front of the king by herself.

```board
fen: 3q1rkr/pp6/8/8/8/6Q1/5PPP/6K1 b - - 0 1
highlight: f8, h8
caption: Epaulette mate. The rooks on f8 and h8 are the epaulettes; the queen covers f7, g7 and h7.
```

**Dovetail mate** (Cozio's mate). The queen stands diagonally next to the king, protected. She covers every neighbouring square except two, and those two are blocked by the king's own pieces.

```board
fen: r7/pp6/3b4/2pk4/4Q3/5P2/6PP/6K1 b - - 0 1
highlight: c5, d6
caption: Dovetail mate. Qe4 is protected by the pawn; the pawn on c5 and the bishop on d6 seal the king in.
```

## Play it

<p class="puzzle-intro">1 · Epaulette in one. Black's rooks have been dragged to f8 and h8, and the g-file is open.</p>

```try
fen: 3q1rkr/pp6/8/8/8/8/2Q2PPP/6K1 w - - 0 1
solution: Qg6#
hint: The queen wants the file, two squares from the king.
prompt: White to play. Mate in one.
success: Both flanks were filled by Black's own rooks. The queen covered the rest.
```

<p class="puzzle-intro">2 · Dovetail in one. The king on d5 is out in the open, or so it seems.</p>

```try
fen: r7/pp6/3b4/2pk4/8/5P2/6PP/1Q4K1 w - - 0 1
solution: Qe4#
hint: Diagonally next to the king, on a square the f-pawn protects.
prompt: White to play. Mate in one.
success: c5 and d6 were Black's own pieces. Every other square was the queen's, including c6 behind the king.
```

<p class="puzzle-intro">3 · Epaulette on the e-file. The king never castled and both rooks came to the centre.</p>

```try
fen: 3rkr2/pp4pp/2p5/8/8/1Q6/PP3PPP/6K1 w - - 0 1
solution: Qe6#
hint: Same shape, turned on its side: the queen two squares up the file.
prompt: White to play. Mate in one.
success: d8 and f8 were the epaulettes. Rooks that come to the centre before the king leaves it are a liability, not a strength.
```

## Remember

- Epaulette: king on the edge, own pieces on both sides, queen two squares away on the file.
- Dovetail: queen diagonally adjacent and protected, the two uncovered squares filled by the king's own pieces.
- Both are recognition mates. There is usually no calculation; either the shape is there or it is not.
- Defending: when your king is on an open file, do not park pieces on both sides of it.

+++ Read more: shapes you can see one move early

These mates rarely appear from nowhere. The epaulette comes from a king that has been checked along its back rank and answered by moving a rook next to itself, or from a king in the centre with both rooks developed to d8 and f8 before the king has gone anywhere. The dovetail comes from a king that has been driven into the open and is surrounded by its own defenders, which now get in its way.

The practical habit is to look at your opponent's king and ask: which of its neighbouring squares are already unavailable because its own pieces stand there? Every occupied square is one the queen does not need to cover. When four or five of the eight are filled, a single protected queen move is often mate, and the sacrifice that gets the queen there is worth calculating.

Carlo Cozio, a Piedmontese count, described the dovetail in his 1766 treatise, which is why the pattern also carries his name. The epaulette name is 19th-century and comes from the military uniforms of the time.

+++
