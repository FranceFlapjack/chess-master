---
id: first-steps/value-of-the-pieces
track: First steps
title: What the pieces are worth
lede: Pawn 1, knight 3, bishop 3, rook 5, queen 9. The numbers tell you whether a trade is good, and they are wrong just often enough to keep chess interesting.
level: 0
sources:
  - Capablanca, Chess Fundamentals (1921), "Relative value of the pieces" — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions, checked with Stockfish 18.
---

## The table

| Piece | Value |
|---|---|
| Pawn | 1 |
| Knight | 3 |
| Bishop | 3 |
| Rook | 5 |
| Queen | 9 |

The king has no value: it cannot be traded. Use the numbers to judge exchanges. A knight for a rook is called winning the exchange (two points). A bishop for three pawns is roughly level. Two rooks are a little more than a queen; two minor pieces are a little more than a rook.

The numbers are a guide, not a law. A piece is worth what it does in the position, and the rest of this course is largely about when the table is wrong: an active rook against a passive one, a knight on a square nothing can attack, a pawn about to queen.

## Play it

<p class="puzzle-intro">1 · You can take a pawn or a queen. Take the right one.</p>

```try
fen: 3qk3/8/8/8/p2R4/8/8/4K3 w - - 0 1
solution: Rxd8+
hint: Nine is more than one.
prompt: White to play. Which capture?
success: The queen. Rxa4 would win one point and leave a queen on the board; Rxd8+ wins nine and gives check.
```

<p class="puzzle-intro">2 · A knight is worth three, a rook five. Use the knight to win the rook.</p>

```try
fen: r3k3/8/8/3N4/8/8/4P3/4K3 w - - 0 1
solution: Nc7+ Kd8 Nxa8
hint: A knight check that also attacks the rook.
prompt: White to play. Win the rook.
success: Nc7+ forks king and rook. Five points for nothing: the king must move and the rook falls.
```

## Remember

- 1, 3, 3, 5, 9. Learn it once.
- Before any capture, count what you give and what you get.
- When the position says the table is wrong, believe the position. That is what the rest of the course teaches.

+++ Read more: Capablanca's version

Capablanca gives the same table with one note: the bishop is slightly stronger than the knight in most positions, and two bishops are stronger still, but the difference is small enough that beginners should treat them as equal. He also warns against counting a queen as three minor pieces: in practice the minor pieces do better, because there are three of them and they can be in three places.

+++
