---
id: first-steps/castling-and-en-passant
track: First steps
title: Castling, en passant and promotion
lede: Three special moves. Castling tucks the king away, en passant is the pawn's odd capture, and promotion turns a pawn into a queen.
level: 0
sources:
  - FIDE Laws of Chess, article 3, as summarised in Wikipedia, "Castling", "En passant" and "Promotion (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Castling
  - Composed positions, checked with Stockfish 18.
---

## Castling

The king moves two squares towards a rook and the rook jumps to the square the king crossed. Kingside: king e1 to g1, rook h1 to f1. Queenside: king e1 to c1, rook a1 to d1. It is allowed only if the king and that rook have never moved, the squares between them are empty, the king is not in check, and the king does not pass through or land on an attacked square. Do it early; it is the fastest way to a safe king.

## En passant

If a pawn moves two squares from its starting square and lands beside an enemy pawn, that pawn may capture it as if it had moved only one square, on the very next move only. It is the rule everyone forgets and everyone is caught by once.

## Promotion

A pawn that reaches the last rank becomes a queen, rook, bishop or knight of its owner's choice. Nearly always a queen. You may have two queens.

```board
fen: 4k3/8/8/3Pp3/8/8/8/4K3 w - - 0 1
arrows: d5e6
highlight: e5
caption: Black has just played e7–e5. White's d5 pawn may take it en passant, landing on e6, this move only.
```

## Play it

<p class="puzzle-intro">1 · Castle kingside.</p>

```try
fen: r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1
solution: O-O
tolerance: 80
hint: Move the king two squares towards the h1 rook.
prompt: White to play. Castle.
success: King to g1, rook to f1. The king is behind its pawns and the rook is closer to the centre.
```

<p class="puzzle-intro">2 · Black has just played e7–e5 next to your pawn. Take it en passant.</p>

```try
fen: 4k3/8/8/3Pp3/8/8/8/4K3 w - e6 0 1
solution: dxe6
tolerance: 30
hint: Capture diagonally onto e6, as if the pawn had only moved one square.
prompt: White to play. En passant.
success: The pawn on e5 is removed and yours stands on e6. Next move it would have been too late.
```

<p class="puzzle-intro">3 · Promote.</p>

```try
fen: 8/4P3/8/8/8/8/k7/4K3 w - - 0 1
solution: e8=Q
hint: The last rank. Choose a queen.
prompt: White to play. Promote the pawn.
success: A new queen. King and queen against king is the first mate you will learn.
```

## Remember

- Castle early. King two squares, rook over it. Not through check, not out of check.
- En passant: only right after the two-square move, only by a pawn beside it.
- Promotion: a queen, almost always.

+++ Read more: the small print of castling

You may castle if the rook is attacked, and you may castle if the square next to the rook (b1 on the queenside) is attacked, because the king does not cross it. You may not castle if you have been in check earlier and answered it by moving the king, because the king has moved. And castling is a king move: touch the king first if you play with the touch-move rule.

+++
