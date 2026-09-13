---
id: first-steps/reading-notation
track: First steps
title: Reading chess notation
lede: Every move has a short name. Once you can read them, every book, video and lesson in this course opens up.
level: 0
sources:
  - Wikipedia, "Algebraic notation (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
---

## The system

A move is the piece letter and the square it goes to. Pieces: K king, Q queen, R rook, B bishop, N knight (K was taken). Pawns have no letter.

- **e4**: a pawn moves to e4. **Nf3**: a knight moves to f3.
- **x** means capture: **Bxe5**, bishop takes on e5. Pawn captures give the file the pawn came from: **exd5**.
- **+** check, **#** checkmate. **O-O** castles kingside, **O-O-O** queenside. **e8=Q** promotes to a queen.
- When two of the same piece could go to the square, add the file or rank: **Nbd2**, **R1e2**.
- Move numbers: **1. e4 e5 2. Nf3 Nc6** means White's first move, Black's first, and so on. A move written after dots, **2… Nc6**, is Black's.
- Annotations: **!** good move, **?** mistake, **!!** brilliant, **??** blunder, **?!** dubious.

The move lists in this app are all in this notation, and clicking any move shows the position.

## Play it

<p class="puzzle-intro">1 · Play 1. e4, then answer 1…e5 with 2. Nf3.</p>

```try
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
solution: e4 e5 Nf3
tolerance: 50
hint: The king's pawn two squares; then the knight from g1 to f3.
prompt: White to play. 1. e4, and after Black's reply, 2. Nf3.
success: 1. e4 e5 2. Nf3. The most common opening moves in chess, and you have just read and played them.
```

<p class="puzzle-intro">2 · Play the capture Bxf7+.</p>

```try
fen: r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1
solution: Bxf7+
tolerance: 200
hint: The bishop on c4 takes the pawn on f7 with check.
prompt: White to play. Bxf7+.
success: Bishop takes f7, check. You have read a capture and a check.
```

## Remember

- Piece letter + square. x for a capture, + for check, # for mate.
- Pawns have no letter; pawn captures name the file they came from.
- O-O and O-O-O are castling; =Q is promotion.

+++ Read more: older notation

Books before about 1980 in English used descriptive notation: P-K4 for e4, N-KB3 for Nf3, with squares named from each player's side. Capablanca's *Chess Fundamentals*, quoted throughout this course, was written that way; the quotations here have been converted. If you meet it, the trick is that the squares are counted from the side of whoever is moving, so P-K4 by Black is what we call e5.

+++
