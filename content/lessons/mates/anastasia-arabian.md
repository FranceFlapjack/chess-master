---
id: mates/anastasia-arabian
track: Checkmate patterns
title: Anastasia's and the Arabian mate
lede: Two rook-and-knight mates on the edge of the board. The knight takes the king's escape squares and the rook gives the check.
level: 2
sources:
  - Wikipedia, "Checkmate pattern" (CC BY-SA), https://en.wikipedia.org/wiki/Checkmate_pattern — Anastasia's mate is named after the novel Anastasia und das Schachspiel (Heinse, 1803); the Arabian mate is the oldest named mate, from the medieval game.
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The shapes

**Anastasia's mate.** A knight on e7 covers g8 and g6. With the king on h7 (or h8) and the g-pawn in the way, a rook on the h-file is mate. The usual route: knight check, queen sacrifice on h7 to pull the king onto the file, rook to the h-file.

```board
fen: 5r2/pp2Nppk/8/8/8/7R/PP4PP/6K1 b - - 0 1
highlight: g8, g6
caption: Mate. The rook checks along the h-file; g8 and g6 belong to the knight, g7 to Black's own pawn.
```

**The Arabian mate.** A knight on f6 covers h7 and g8; a rook on h7 (or on the seventh rank) mates a king on h8. The rook is protected by the knight, so the king cannot take it.

```board
fen: 6rk/7R/5N2/8/8/8/8/6K1 b - - 0 1
highlight: g8, h7
caption: Rook on h7, knight on f6, king in the corner. The oldest mate in the game.
```

## Play it

<p class="puzzle-intro">1 · The knight is already on e7 and the rook waits on f3. The queen makes the door.</p>

```try
fen: 5r1k/ppq1Nppp/8/8/8/3Q1R2/PP4PP/6K1 w - - 0 1
solution: Qxh7+ Kxh7 Rh3#
hint: The king has to be on the h-file for the rook to hit it.
prompt: White to play. Mate in two.
success: Anastasia's mate. The knight on e7 took g8 and g6, the pawn on g7 took g7.
```

<p class="puzzle-intro">2 · The rook is on the seventh, the knight on e4. Bring the knight to f6 with check and finish.</p>

```try
fen: 5bk1/pp1R4/8/q7/4N3/8/PP4PP/6K1 w - - 0 1
solution: Nf6+ Kh8 Rh7#
hint: After the knight check the king has only one square, and it is the corner.
prompt: White to play. Mate in two.
success: The Arabian mate. Rh7 is protected by the knight, and g8 belongs to it too.
```

<p class="puzzle-intro">3 · Anastasia's mate in three, from the knight jump. Queen on d3, rook on f3, knight on d5.</p>

```try
fen: 1q3rk1/pp3ppp/8/3N4/8/3Q1R2/PP4PP/6K1 w - - 0 1
solution: Ne7+ Kh8 Qxh7+ Kxh7 Rh3#
hint: Knight check first: it must arrive on e7 before the queen goes.
prompt: White to play. Force mate.
success: Ne7+ drove the king to h8, the queen dragged it to h7, the rook did the rest.
```

## Remember

- Knight on e7 (or e2 for Black's attack) and a rook that can reach the h-file: look for Anastasia.
- Knight on f6 and a rook on the seventh: look for the Arabian.
- In both, a queen sacrifice on h7 is the usual way to put the king on the h-file.
- Defending: a king on h7 with a black pawn on g7 and a white knight on e7 is in mortal danger from any rook. Move the g-pawn or trade the knight.

+++ Read more: names and origins

The Arabian mate comes from shatranj, the Arab and Persian form of the game, where the rook and knight moved exactly as they do today while the queen and bishop were weak. Rook-and-knight mates were the strongest weapon in the game, and players catalogued them a thousand years ago.

Anastasia's mate takes its name from an 1803 German novel, *Anastasia und das Schachspiel*, by Wilhelm Heinse, which contains the position. The pattern is far older than the book, but the name stuck.

Both belong to a family: a minor piece takes the king's flight squares and a rook delivers the check. Once you have the knight-on-e7 and knight-on-f6 pictures in your head, you will find the same mates with a bishop doing the knight's job (that is Greco's mate, in the next lesson).

+++
