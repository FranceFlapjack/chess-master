---
id: first-steps/check-checkmate-stalemate
track: First steps
title: Check, checkmate and stalemate
lede: The king is never captured. It is attacked (check), it cannot escape (checkmate, the game ends), or the side to move has no legal move at all and is not in check (stalemate, a draw).
level: 0
sources:
  - FIDE Laws of Chess, articles 1 and 5, as summarised in Wikipedia, "Rules of chess" (CC BY-SA), https://en.wikipedia.org/wiki/Rules_of_chess
  - Composed positions for this lesson, checked with Stockfish 18.
---

## Check

When a piece attacks the king, the king is in check, and the player must deal with it at once. There are only three ways: move the king to a safe square, capture the attacking piece, or put something in between (not possible against a knight or an adjacent piece). You may never make a move that leaves your own king in check.

## Checkmate

Check with no way out. The game is over: the side whose king is mated has lost. You do not take the king; the attack that cannot be answered is the end.

## Stalemate

The side to move is not in check but has no legal move at all. The game is a draw. Beginners with a big advantage lose half a point this way every day, so when you are winning, make sure the enemy king always has a move or is in check.

```board
fen: 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1
highlight: h8
caption: Stalemate. Black is not in check and has no legal move. Draw, even though White has a queen.
```

```board
fen: 6k1/5Q2/6K1/8/8/8/8/8 b - - 0 1
highlight: g8
caption: One square over, it is checkmate. Same pieces; the difference is whether the king is attacked.
```

## Play it

<p class="puzzle-intro">1 · Give check with the queen.</p>

```try
fen: 4k3/8/8/8/8/8/8/3QK3 w - - 0 1
solution: Qe2+|Qa4+|Qh5+
tolerance: 30
hint: Any square on the e-file or on a diagonal that leads to e8.
prompt: White to play. Put the black king in check.
success: Check. The black king must answer it on the next move. Notice that Qd8 or Qd7 would also be check, but the king would simply take the queen: a check is only useful if it is safe.
```

<p class="puzzle-intro">2 · Checkmate in one. The white king does the guarding.</p>

```try
fen: 6k1/8/6K1/8/8/8/8/Q7 w - - 0 1
solution: Qg7#
hint: Bring the queen next to the black king, on a square your own king protects.
prompt: White to play. Mate in one.
success: The queen checks, the king cannot take her because your king protects her, and there is nowhere to go.
```

<p class="puzzle-intro">3 · Avoid stalemate. White to move; which queen move keeps the win?</p>

```try
fen: 7k/8/6K1/8/8/8/8/Q7 w - - 0 1
solution: Qg7#
hint: Do not take away every square without giving check. Give check and mate at once.
prompt: White to play. Mate, not stalemate.
success: Qg7 is mate: check, protected by your king, no squares. A move that took away the last square without giving check would be stalemate and a draw.
```

## Remember

- Check: move the king, capture the attacker, or block.
- Checkmate: check with no answer. Game over.
- Stalemate: no legal move and no check. A draw, however far ahead you are.

+++ Read more: draws you did not want

Besides stalemate, a game is drawn if the same position occurs three times, if fifty moves pass without a pawn move or capture, or if neither side has enough material to mate (for example a lone king against king and bishop). Players can also agree a draw at any time. For a beginner the one that matters is stalemate: when you have a queen and the opponent only a king, make every move a check or make sure the king still has a square.

+++
