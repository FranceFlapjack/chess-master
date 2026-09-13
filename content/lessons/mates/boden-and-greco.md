---
id: mates/boden-and-greco
track: Checkmate patterns
title: Boden's and Greco's mate
lede: Two bishop mates. Boden's needs two bishops on crossing diagonals against a king that castled long; Greco's needs one bishop to take g8 while a heavy piece comes down the h-file.
level: 2
sources:
  - Schulder – Boden, London 1853. Move list checked against Wikipedia, "Boden's Mate" (CC BY-SA), https://en.wikipedia.org/wiki/Boden%27s_Mate
  - Wikipedia, "Checkmate pattern" (CC BY-SA) for Greco's mate, named after Gioachino Greco (c. 1600–1634), https://en.wikipedia.org/wiki/Checkmate_pattern
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The shapes

**Boden's mate.** The king has castled queenside. One bishop checks along the a6–c8 diagonal, the other covers b8 and c7 from the f4–b8 diagonal. The king's remaining squares are filled by its own rook and pawn. It is usually set up by a queen sacrifice on c3 (or c6) that drags the b-pawn away and opens the checking diagonal.

```board
fen: 2kr3r/p2p4/B7/8/5B2/8/8/6K1 b - - 0 1
highlight: b8, c7, b7
caption: Boden's mate. Ba6 checks; Bf4 takes b8 and c7; the rook and pawn on d8 and d7 block the rest.
```

**Greco's mate.** A bishop on the a2–g8 diagonal takes g8 away from a king on h8, the g-pawn blocks g7, and a queen or rook arrives on the open h-file.

```board
fen: 5r1k/pp4p1/8/8/2B5/7Q/PP3PP1/6K1 b - - 0 1
highlight: g8, g7
caption: Greco's mate. The queen checks on the h-file, the bishop on c4 covers g8.
```

## Play it

<p class="puzzle-intro">1 · Schulder – Boden, London 1853. White has just taken on d5 and left the c3 pawn as the only thing between Black's bishop and a3. You are Black.</p>

```try
fen: 2k1rb1r/ppp3pp/2n2q2/3B1b2/5P2/2P1BQ2/PP1N1P1P/2KR3R b - - 0 14
solution: Qxc3+ bxc3 Ba3#
hint: The queen is worth less than the b-pawn's job.
prompt: Black to play. Mate in two.
success: The move that gave the mate its name. bxc3 was forced and opened a3–c1; the bishop on f5 already had b1 and c2.
```

<p class="puzzle-intro">2 · Greco's mate in one. The h-file is open and the bishop on c4 sees g8.</p>

```try
fen: 3q1r1k/pp4p1/8/8/2B5/4Q3/PP3PP1/6K1 w - - 0 1
solution: Qh3#
hint: Where can the queen give check that the king cannot answer?
prompt: White to play. Mate in one.
success: A queen check down the h-file, and g8 belonged to the bishop.
```

<p class="puzzle-intro">3 · Boden's mate, composed. The knight on c6 is the target, and the bishop on e2 is waiting for a diagonal to open. Notice which of the king's squares are already filled by its own pieces.</p>

```try
fen: 2kr3r/pp1nq3/2n5/8/Q4B2/8/4BPPP/6K1 w - - 0 1
solution: Qxc6+ bxc6 Ba6#
hint: Same recipe as Boden's own game: give the queen so the b-pawn must leave.
prompt: White to play. Mate in two.
success: bxc6 opened the a6–c8 diagonal, and the bishop on f4 already covered b8 and c7. The knight on d7 blocked its own king.
```

## Remember

- Boden's: king on c8 (or c1), two bishops on crossing diagonals, a queen sacrifice on c3 or c6 to open the b-file diagonal.
- Greco's: king on h8, own pawn on g7, a bishop covering g8, an open h-file. Often the h-file is opened by a piece sacrifice on h7 first.
- Both start from the same question: which of the king's escape squares are already blocked by its own pieces?

+++ Read more: the games in full

**Schulder – Boden, London 1853.** Samuel Boden was one of the strongest English players of the 1850s. The game is short, but it shows the pattern building from move 12: both black bishops aim at the white queenside before White has castled, and 13.O-O-O walks into it.

```pgn
file: schulder-boden-1853.pgn
```

**Greco's mate** goes back to the manuscripts of Gioachino Greco, an Italian who travelled Europe in the 1620s playing for money and writing down model games. His collection contains the earliest recorded examples of many mating patterns, including the Greek gift on h7 that the Tactics track opens with. The two ideas belong together: the sacrifice on h7 opens the h-file, and the bishop on the a2–g8 diagonal closes g8.

+++
