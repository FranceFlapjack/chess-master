---
id: endgames/converting-a-piece
track: Endgames
title: Converting an extra piece
lede: Being a piece up wins the game only if you know what to do with it. Trade pieces, keep pawns, and use the piece to win more.
level: 1
sources:
  - Capablanca, Chess Fundamentals (1921), chapter 1, "Relative value of the pieces" and the general principles on exchanges — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The rules

- **Ahead in material: exchange pieces, not pawns.** With fewer pieces on the board the extra one weighs more; with fewer pawns there is less to win with.
- **Keep at least one pawn.** A lone knight or bishop cannot mate. Two pawns is comfortable.
- **Use the piece.** An extra knight or bishop attacks pawns the defender cannot cover. Win a second pawn; the rest is technique.
- **Do not rush.** Improve every piece first. The defender's counterplay is the only way to lose.

```board
fen: 3r2k1/pp3ppp/8/8/8/2N5/PP3PPP/3R2K1 w - - 0 1
arrows: d1d8
caption: A knight up. Trade the rooks and the ending is elementary.
```

## Play it

<p class="puzzle-intro">1 · A knight up with rooks on. Simplify.</p>

```try
fen: 3r2k1/pp3ppp/8/8/8/2N5/PP3PPP/3R2K1 w - - 0 1
solution: Rxd8+
tolerance: 80
hint: Fewer pieces, same extra knight.
prompt: White to play. Make the win as easy as possible.
success: Without rooks, Black has no counterplay at all. The knight and king win pawns at leisure.
```

<p class="puzzle-intro">2 · A bishop up. Black's only hope is the passed a-pawn. Deal with it first.</p>

```try
fen: 8/5k2/8/p7/8/8/1B3K2/8 w - - 0 1
solution: Ba3|Bc1|Bd4|Bc3
hint: The bishop stops the pawn from a distance. Then the king walks over.
prompt: White to play. Stop the counterplay.
success: Any square on a diagonal that covers a1 or a3 holds the pawn for good. The king then collects it and the rest is a basic mate.
```

## Remember

- Ahead: trade pieces, keep pawns.
- Never trade down to a lone minor piece.
- First stop the opponent's counterplay, then win more material, then promote.
- The extra piece is an attacker. Point it at pawns the king cannot defend.

+++ Read more: Capablanca's exchange principles

Capablanca gives the exchange rule at the start of *Chess Fundamentals* and returns to it throughout: when you are ahead, exchange pieces; when you are behind, avoid exchanges of pieces and exchange pawns instead, because a bare board with no pawns is the one place where being a piece down does not matter. The reason is arithmetic. An extra knight among ten pieces is a small share of the army; an extra knight among two is the whole army.

The most common way a piece-up game is thrown away is haste: pushing pawns before the pieces are placed, allowing a passed pawn to run, or trading into an ending with no pawns left. Slow down, improve everything, and win the second pawn before you push the first.

+++
