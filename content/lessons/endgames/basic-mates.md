---
id: endgames/basic-mates
track: Endgames
title: Basic mates, a refresher
lede: Queen, rook and two bishops against a lone king. You know these; make sure you can do them fast and without stalemate.
level: 1
sources:
  - Capablanca, Chess Fundamentals (1921), chapter 1, "Some simple mates" — public domain, https://www.gutenberg.org/ebooks/33870
  - Positions checked with Stockfish 18.
---

## The method for all three

Drive the king to the edge, then to a corner if you need one, using your pieces to build a fence the king cannot cross. Bring your own king up; the mate needs it. Before every move check for stalemate.

- **King and queen.** The queen alone pushes the king to the edge (keep it a knight's move away from the enemy king and it can never be attacked). Then the king comes and the queen mates on the edge. Danger: a queen that takes away every square without giving check.
- **King and rook.** Rook and king together push rank by rank. When the kings face each other with the rook able to check on the edge, it is mate. Danger: the rook standing where the king can reach it.
- **Two bishops.** Side by side on adjacent diagonals they make a wall. Push the king to a corner, king close behind, and mate with the bishop on the long diagonal.

## Play it

<p class="puzzle-intro">1 · King and queen. The black king is on the edge and the white king is close. Mate in one.</p>

```try
fen: 6k1/Q7/5K2/8/8/8/8/8 w - - 0 1
solution: Qg7#
hint: The queen next to the king, protected by yours.
prompt: White to play. Mate in one.
success: Queen on g7, protected by the king on f6. Every escape square is covered.
```

<p class="puzzle-intro">2 · King and rook. Kings facing each other, rook ready. Mate in one.</p>

```try
fen: 4k3/8/4K3/8/8/8/8/7R w - - 0 1
solution: Rh8#
hint: The kings are in opposition. The rook checks along the edge.
prompt: White to play. Mate in one.
success: The rook checks on the back rank and the white king covers d7, e7 and f7.
```

<p class="puzzle-intro">3 · Two bishops. The black king is in the corner and the white king close. Mate in one.</p>

```try
fen: 7k/8/6K1/8/2B5/B7/8/8 w - - 0 1
solution: Bb2#
hint: One bishop already covers g8. The other needs the long diagonal.
prompt: White to play. Mate in one.
success: Bb2 checks along the long diagonal, Bc4 holds g8, the king holds g7 and h7.
```

## Remember

- Edge first, then corner if needed, king close, then mate.
- Queen: keep a knight's move from the enemy king; watch for stalemate.
- Rook: kings in opposition, rook checks on the edge.
- Bishops: a wall on two adjacent diagonals, then mate in the corner.
- Practise these against the computer until each takes under a minute.

+++ Read more: Capablanca's order of study

*Chess Fundamentals* begins with these mates, before openings and before any tactics, on the principle that a player should first know how a game ends. The book gives king and rook, king and two bishops, and king and queen, with the general rule that the king must be driven to the edge and that the attacking king must take part. It then moves straight to pawn promotion, which is where the rest of this track starts.

Bishop and knight against a lone king is also a forced win, but it is long and rare, and it is deliberately not in this track. If you meet it once in your playing life, look it up then.

+++
