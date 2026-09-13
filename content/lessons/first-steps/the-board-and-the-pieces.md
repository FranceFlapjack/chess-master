---
id: first-steps/the-board-and-the-pieces
track: First steps
title: The board and how the pieces move
lede: Eight by eight, a light square in the right-hand corner, and six kinds of piece. Move each one on the board below until it feels natural.
level: 0
sources:
  - Capablanca, Chess Fundamentals (1921), the introductory pages — public domain, https://www.gutenberg.org/ebooks/33870
  - FIDE Laws of Chess, article 3, as summarised in Wikipedia, "Rules of chess" (CC BY-SA), https://en.wikipedia.org/wiki/Rules_of_chess
---

## The board

Files are the columns, lettered a to h from White's left. Ranks are the rows, numbered 1 to 8 from White's side. Every square has a name: the bottom-left square for White is a1, the top-right h8. Set the board so that each player has a light square in the right-hand corner.

## The pieces

- **King** ♔: one square in any direction. It can never be captured; when it is attacked and cannot escape, the game is over.
- **Queen** ♕: any number of squares in a straight line, along a rank, a file or a diagonal.
- **Rook** ♖: any number of squares along a rank or a file.
- **Bishop** ♗: any number of squares along a diagonal. Each bishop stays on the colour it started on.
- **Knight** ♘: an L: two squares one way and one square sideways. It is the only piece that jumps over others.
- **Pawn** ♙: one square forward, or two from its starting square; it captures one square diagonally forward. It never moves backwards.

No piece except the knight may pass through an occupied square. You capture by moving onto the square of an enemy piece, which is removed.

```board
fen: 4k3/8/8/8/3N4/8/8/4K3 w - - 0 1
highlight: b3, b5, c2, c6, e2, e6, f3, f5
caption: The knight on d4 can reach the eight marked squares. Two one way, one sideways.
```

```board
fen: 4k3/8/8/8/3B4/8/8/4K3 w - - 0 1
arrows: d4a1, d4h8, d4a7, d4g1
caption: The bishop on d4 runs along both diagonals as far as the board allows.
```

## Play it

<p class="puzzle-intro">1 · Move the knight from d4 to f5.</p>

```try
fen: 4k3/8/8/8/3N4/8/8/4K3 w - - 0 1
solution: Nf5
tolerance: 30
hint: Two squares up, one to the right. Or one up, two to the right: same square.
prompt: White to play. Knight to f5.
success: That is the L. Every knight move lands on the opposite colour from where it started.
```

<p class="puzzle-intro">2 · The bishop on c1 can capture one black pawn. Find it.</p>

```try
fen: 4k3/8/8/6p1/8/8/8/2B1K3 w - - 0 1
solution: Bxg5
tolerance: 30
hint: Follow the diagonal from c1 towards the top right.
prompt: White to play. Capture with the bishop.
success: c1, d2, e3, f4, g5: all on one diagonal, all empty until the pawn.
```

<p class="puzzle-intro">3 · The rook on a1 can capture the pawn on a7. Do it.</p>

```try
fen: 4k3/p7/8/8/8/8/8/R3K3 w - - 0 1
solution: Rxa7
tolerance: 30
hint: Straight up the a-file.
prompt: White to play. Capture with the rook.
success: A rook goes as far as it likes along a file or rank, and stops when it captures.
```

## Remember

- Light square in the right-hand corner. Files a–h, ranks 1–8.
- Queen: any direction. Rook: straight. Bishop: diagonal. Knight: an L, and it jumps. King: one step. Pawn: forward, captures diagonally.
- Only knights jump. Everything else needs a clear path.

+++ Read more: which way round, and a habit for reading the board

Two things beginners get wrong for months. The board is the right way round when the square in your right-hand corner is light ("white on the right"). And the queen starts on her own colour: the white queen on the light square d1, the black queen on the dark square d8.

When you look at a board, get in the habit of naming squares. "The knight is on f3" is faster and clearer than "the knight is over there near the king", and it is how every book, video and this course talks about the game.

+++
