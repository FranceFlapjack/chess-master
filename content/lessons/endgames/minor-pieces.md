---
id: endgames/minor-pieces
track: Endgames
title: Minor-piece endings
lede: The wrong bishop, the knight that cannot lose a tempo, and the pawns that decide which piece is better.
level: 2
sources:
  - Wikipedia, "Wrong bishop" and "Bishop and knight checkmate" (CC BY-SA), https://en.wikipedia.org/wiki/Wrong_bishop
  - Capablanca, Chess Fundamentals (1921), chapter 3 — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The rules

**The wrong bishop.** A bishop and a rook pawn cannot win if the bishop does not control the queening square and the defending king can reach the corner. The attacking king cannot drive it out without stalemate.

**Bishop against knight.** With pawns on both wings the bishop is better: it reaches both sides at once. With pawns on one wing, or with pawns fixed on the bishop's colour, the knight is at least as good.

**The knight's weakness.** A knight cannot lose a tempo; a bishop can. In endings where the opposition decides, that matters.

```board
fen: 8/8/8/8/3B3P/8/5k2/7K w - - 0 1
highlight: h8
caption: White cannot win. The bishop on d4 is dark-squared and h8 is dark: the wrong bishop would be a light one. Change it to a light-squared bishop and the black king heads for h8 and draws.
```

## Play it

<p class="puzzle-intro">1 · The wrong bishop. White has a light-squared bishop and an h-pawn. Black to move: where does the king go?</p>

```try
fen: 8/5k2/8/5K2/7P/3B4/8/8 b - - 0 1
solution: Kg7|Kg8
hint: The bishop does not control h8. A king in the corner cannot be driven out.
prompt: Black to play and draw.
success: Head for the corner. Once the king reaches h8 or g8 with the h-pawn coming, there is no way to force it out without stalemate.
```

<p class="puzzle-intro">2 · The same material from the other side. The black king on d7 has not reached the corner yet. White to move.</p>

```try
fen: 8/3k4/8/5K2/7P/3B4/8/8 w - - 0 1
solution: Kg6
tolerance: 60
hint: The pawn is not in a hurry. The king is.
prompt: White to play and win.
success: Kg6 keeps the black king out of the corner: g7 and f7 are covered by the king, h7 by the bishop. The pawn runs home.
```

## Remember

- Rook pawn plus wrong bishop plus defending king in the corner: draw. Check the colour of the queening square.
- Bishop with pawns on both wings; knight with pawns on one wing or fixed on the bishop's colour.
- Knights cannot pass the move. Bishops can.
- In minor-piece endings the king is the strongest attacker. Bring it forward first.

+++ Read more: which minor piece to keep

The choice usually happens in the middlegame, when an exchange is offered. Ask two questions. Are there pawns on both sides of the board? Then the bishop's long range counts and you should keep the bishop. Are your own pawns fixed on the same colour as your bishop? Then the bishop is walled in by its own pawns, and the knight is the piece to keep.

Capablanca puts it plainly in *Chess Fundamentals*: the bishop is generally the stronger piece in the ending, but a knight in a blocked position, with a strong square in the centre, is a match for it. The lesson on outposts in the Middlegame track is the other half of this.

+++
