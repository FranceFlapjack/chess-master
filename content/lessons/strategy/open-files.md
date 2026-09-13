---
id: strategy/open-files
track: Middlegame strategy
title: Open files and the seventh rank
lede: Rooks need open files. Take the file before the opponent does, double on it, and land on the seventh rank.
level: 2
sources:
  - Nimzowitsch, My System (1925, Hereford translation), the chapter on open files — public domain.
  - Capablanca, Chess Fundamentals (1921) — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The rule

A file with no pawns on it is open; a file with only the opponent's pawn is half-open. The rooks go there. Whoever controls the only open file usually gets to the seventh rank first, and the seventh rank wins pawns and attacks kings.

- **Occupy** the file with a rook before the opponent can.
- **Double** rooks, or rook and queen, so the file cannot be contested.
- **Invade** on the seventh, or on any square the opponent cannot cover.
- **Contest** an enemy rook on the file with your own; trades on the file are fine when you have the last rook.

```board
fen: 2r2rk1/pp3ppp/2n5/8/8/2N5/PP3PPP/2R2RK1 w - - 0 1
arrows: f1d1
highlight: d1, d7
caption: The d-file is open and nobody holds it. Rfd1 takes it; Rd7 is the goal.
```

## Play it

<p class="puzzle-intro">1 · The only open file. White to move takes it first.</p>

```try
fen: 2r2rk1/pp3ppp/2n5/8/8/2N5/PP3PPP/2R2RK1 w - - 0 1
solution: Rfd1|Rcd1
tolerance: 50
hint: Where is there no pawn at all?
prompt: White to play. Take the file.
success: A rook on the d-file, with the second ready to double, keeps Black's rooks off it and heads for d7.
```

<p class="puzzle-intro">2 · Invade. White's rooks are doubled on the e-file and Black's e7 square is covered by nothing that can stay.</p>

```try
fen: 2r3k1/pp3pp1/2n4p/8/8/2N5/PP2RPPP/4R1K1 w - - 0 1
solution: Re7
tolerance: 50
hint: The seventh rank, protected from behind.
prompt: White to play. Get to the seventh.
success: On e7 the rook attacks b7 and f7 and confines the king. Black's rook cannot contest the file because White has two rooks on it.
```

## Remember

- Open file: take it first, double on it, go to the seventh.
- A rook on the seventh attacks pawns that have not moved and the king behind them.
- Half-open file: a target for your rook, a defensive duty for the opponent.
- If the file leads nowhere (every entry square is covered), it is not worth a fight. Look for another one.

+++ Read more: Nimzowitsch on the open file

Nimzowitsch begins *My System* with the open file, before the passed pawn, the pin or the discovered check, because he saw it as the clearest case of his method: the file is the road, the seventh rank the destination, and the pieces should be arranged with that destination in mind rather than for the sake of any single move. Capablanca's rook endings in *Chess Fundamentals* show the same idea a phase later: whoever's rook reaches the seventh rank first usually wins the pawn ending that follows.

+++
