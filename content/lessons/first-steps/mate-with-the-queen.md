---
id: first-steps/mate-with-the-queen
track: First steps
title: Mating with the queen
lede: King and queen against a lone king. Push the king to the edge with the queen, bring your king, mate. Two minutes once you know it.
level: 0
sources:
  - Capablanca, Chess Fundamentals (1921), chapter 1, "Some simple mates" — public domain, https://www.gutenberg.org/ebooks/33870
  - Positions checked with Stockfish 18.
---

## The method

1. **Box the king in.** Put the queen a knight's move away from the enemy king. From there she takes away most of its squares and can never be attacked. Each time the king moves, follow it with the queen, keeping the knight's-move distance, and the box shrinks.
2. **Edge.** When the king is on the edge of the board, stop. Do not take its last square: that is stalemate.
3. **Bring your king** up until it faces the enemy king with one rank between them.
4. **Mate** with the queen on the edge, protected by your king, or next to the king.

```board
fen: 8/8/8/3k4/8/2Q5/8/4K3 w - - 0 1
arrows: c3c4:alt
highlight: c4
caption: Queen a knight's move from the king. Black's king has only three squares, all going backwards.
```

## Play it

<p class="puzzle-intro">1 · The king is on the edge and your king is close. Mate in one.</p>

```try
fen: 3k4/8/3K4/8/8/8/8/1Q6 w - - 0 1
solution: Qb8#
hint: The queen to the edge, on a square the black king cannot reach.
prompt: White to play. Mate in one.
success: Qb8 is mate. The white king on d6 covers c7, d7 and e7; the queen covers the rest of the back rank.
```

<p class="puzzle-intro">2 · Same idea from the side. Mate in one.</p>

```try
fen: 7k/8/6K1/8/8/8/8/1Q6 w - - 0 1
solution: Qb8#
hint: Along the edge, from a distance.
prompt: White to play. Mate in one.
success: Qb8 along the edge: the king on g6 takes g7 and h7, the queen takes the whole back rank.
```

<p class="puzzle-intro">3 · Not yet mate. Bring your king, without letting the black king out. One good move.</p>

```try
fen: 4k3/8/8/8/8/8/1Q6/4K3 w - - 0 1
solution: Qb7|Qb6|Qd4|Qg7
tolerance: 30
hint: Keep the queen a knight's move from the king, cutting off the seventh rank or the d-file, then the king comes.
prompt: White to play. Tighten the box.
success: The queen holds the black king to the edge. Now walk your king up to e6, and mate follows on the back rank.
```

## Remember

- Queen a knight's move from the king. Follow it. Do not check needlessly.
- King to the edge, then stop and bring your own king.
- Before every move near the end, ask: does the enemy king still have a move? If not, and it is not check, do not play it.

+++ Read more: the other basic mates

King and rook against king works the same way with more patience: the rook cuts off ranks one at a time while the king helps. Two bishops need the enemy king in a corner. Bishop and knight is hard and rare. The Endgames track's refresher lesson has all of them, once the queen mate is easy for you. Practise this one against the computer on the play page: give yourself the queen ending by taking back moves, and time yourself.

+++
