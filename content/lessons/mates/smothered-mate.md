---
id: mates/smothered-mate
track: Checkmate patterns
title: Smothered mate and Philidor's legacy
lede: A knight alone mates a king that is boxed in by its own pieces. The queen sacrifice that forces the box is the oldest combination in the books.
level: 2
sources:
  - Wikipedia, "Smothered mate" (CC BY-SA), https://en.wikipedia.org/wiki/Smothered_mate — the pattern is in Lucena's book of 1497 and in Philidor's Analyse du jeu des Échecs (1749), hence the name Philidor's legacy.
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The shape

A knight cannot be blocked. If the king's neighbouring squares are all occupied by its own pieces, a knight check is mate, no matter how much material Black has left.

```board
fen: 6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1
arrows: g5f7
highlight: g8, g7, h7
caption: Nf7 is mate. The rook on g8 and the two pawns are Black's problem, not White's.
```

**Philidor's legacy** is the way you build this box when it is not there yet. The queen checks on the a2–g8 diagonal, the knight gives a double check to drive the king into the corner, then the queen is sacrificed on g8 so that the rook has to fill the last square.

## Play it

<p class="puzzle-intro">1 · The rook is already on g8 and the knight is ready. Finish it.</p>

```try
fen: 6rk/6pp/8/q5N1/8/8/8/6K1 w - - 0 1
solution: Nf7#
hint: Which piece can nothing block?
prompt: White to play. Mate in one.
success: Smothered. The queen on a5 could do nothing about a knight.
```

<p class="puzzle-intro">2 · The knight is on h6 and the queen on c4 looks at g8. Two moves.</p>

```try
fen: r2qr2k/pp4pp/7N/8/2Q5/8/PP4PP/6K1 w - - 0 1
solution: Qg8+ Rxg8 Nf7#
hint: Give the queen so that a black piece has to stand on g8.
prompt: White to play. Mate in two.
success: Rxg8 was forced, the box closed and the knight came in from h6.
```

<p class="puzzle-intro">3 · Philidor's legacy in full. The queen already sits on c4, the knight on e5. Four moves, every one of them a check.</p>

```try
fen: r2qr2k/pp4pp/8/4N3/2Q5/8/PP4PP/6K1 w - - 0 1
solution: Nf7+ Kg8 Nh6+ Kh8 Qg8+ Rxg8 Nf7#
hint: Knight check, double check, queen sacrifice, knight check. If the king ever goes to f8, the queen mates on f7.
prompt: White to play. Force mate.
success: The double check on the second move is the point: the king had to move, and it could only go back into the corner.
```

## Remember

- A king in the corner with a rook or pawn on g8/g7/h7 is one knight check from mate.
- Queen on the a2–g8 diagonal plus a knight that can reach f7 and h6: look for Philidor's legacy.
- The double check (knight to h6 with the queen behind it) is what makes it forced. A single check could be blocked.
- Defending: do not let a queen settle on the diagonal towards g8 while a knight hovers on g5 or e5, and keep the f-pawn if you can.

+++ Read more: the oldest combination

Luis Ramírez de Lucena printed the pattern in 1497, a few years after the queen got its modern powers, and it has been in every tactics book since. Philidor's *Analyse* of 1749 gives the full queen-sacrifice sequence, which is why the name stuck to him. Modern players know it from thousands of blitz games: it is the reason the knight on g5 in the Fried Liver and Two Knights lines is so dangerous, and the reason experienced players keep an eye on the f7 square long after the opening.

The defensive rules follow from the shape. The mate needs the king in the corner, its own pieces on g8/g7/h7, and a knight with a route to f7. Remove any one of them. Most often that means not answering a queen check on the diagonal with Kh8 by reflex: Kf8 sometimes walks out, and giving back material to break the box is far cheaper than the alternative.

+++
