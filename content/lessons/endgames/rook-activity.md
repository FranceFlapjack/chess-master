---
id: endgames/rook-activity
track: Endgames
title: Rook activity and the seventh rank
lede: In rook endings the active rook is worth a pawn. Put it on the seventh, put it behind passed pawns, and never let it babysit.
level: 2
sources:
  - Tarrasch's rule, as quoted in Wikipedia, "Tarrasch rule" (CC BY-SA), https://en.wikipedia.org/wiki/Tarrasch_rule
  - Capablanca, Chess Fundamentals (1921), chapter 4 on rook endings — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions for this lesson, checked with Stockfish 18.
---

## Three habits

**The seventh rank.** A rook on the seventh attacks every pawn that has not moved and ties the enemy king to the back rank. Two rooks on the seventh usually win outright.

**Behind passed pawns.** Tarrasch's rule, in his words: "The rooks belong behind passed pawns, behind their own in order to support their advance, behind the enemy's in order to impede their advance." A rook in front of its own pawn blocks it and gets pushed off; a rook behind it gains a tempo with every step.

**Activity over material.** A rook that defends a pawn passively is worth less than a rook that attacks. Give the pawn if that is what it costs to activate the rook.

```board
fen: 6k1/pp3ppp/8/8/8/8/PP1R1PPP/6K1 w - - 0 1
arrows: d2d7
highlight: b7, c7, a7
caption: Rd7 hits b7 and c7 at once and pins the king to the back rank.
```

## Play it

<p class="puzzle-intro">1 · The seventh rank. Black's pawns are all still at home.</p>

```try
fen: r5k1/1pp2ppp/p7/8/8/2P5/PP3PPP/3R2K1 w - - 0 1
solution: Rd7
tolerance: 40
hint: One square wins two targets.
prompt: White to play. Find the most active square for the rook.
success: On d7 the rook attacks b7 and c7 and keeps the king on the back rank. Black can defend one pawn, not both.
```

<p class="puzzle-intro">2 · Tarrasch's rule. White has a passed a-pawn and the rook is on b1, in nobody's way. Where does it belong?</p>

```try
fen: 2r5/5k2/5pp1/7p/P7/5KP1/5P1P/1R6 w - - 0 1
solution: Ra1
tolerance: 40
hint: Behind the passed pawn, so every step of the pawn is supported and the rook is never in the way.
prompt: White to play. Put the rook where it belongs.
success: From a1 the rook pushes the pawn from behind. If Black's rook goes to a8 to stop it, it is tied there for the rest of the game, and the white king is free.
```

<p class="puzzle-intro">3 · The second rank from Black's side. The white king is stuck on the first rank and the pawns on a2 and f2 have no defender but the king.</p>

```try
fen: 2r3k1/1p3ppp/p7/8/8/1P6/P4PPP/1R4K1 b - - 0 1
solution: Rc2
tolerance: 40
hint: The same idea as the seventh rank, seen from Black's side.
prompt: Black to play. Activate the rook.
success: On c2 the rook attacks a2 and f2 and confines the king. A pawn falls.
```

## Remember

- Rook to the seventh: it attacks pawns and boxes in the king.
- Rooks behind passed pawns, yours and theirs.
- An active rook is worth a pawn. Do not tie it to defence if there is any alternative.
- The king is a fighting piece in rook endings: bring it to the pawns.

+++ Read more: why rook endings are drawn so often

Rook endings are the most common ending in practice, and the most often drawn. The reason is activity: a single active rook, checking from a distance or sitting behind a passed pawn, holds back an extra pawn more often than not. So the side with the extra pawn must keep the enemy rook passive, and the side without it must get the rook active at any price, even a second pawn.

Capablanca's chapter on rook endings in *Chess Fundamentals* makes the same point in his own way: the first thing to look at is not the pawn count but which rook is doing something. The two positions in the previous lessons, Lucena and Philidor, are where the fight ends up once one side has reduced the game to a single passed pawn.

+++
