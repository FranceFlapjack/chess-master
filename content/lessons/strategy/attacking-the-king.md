---
id: strategy/attacking-the-king
track: Middlegame strategy
title: Attacking the castled king
lede: Count attackers against defenders around the king. When you have more, open lines and sacrifice; when you do not, bring another piece first.
level: 3
sources:
  - Rotlewi – Rubinstein, Łódź 1907 ("Rubinstein's Immortal"). Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Rotlewi_versus_Rubinstein
  - Kasparov – Topalov, Wijk aan Zee 1999. Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Kasparov%27s_Immortal
  - Puzzle moves checked with Stockfish 18.
---

## The arithmetic

An attack on the king works when more of your pieces reach the king's squares than the opponent has defenders there. So the plan has three steps, in order:

1. **Bring pieces.** Rooks to open files that point at the king, bishops on the long diagonals, a knight on f5 or g5, the queen last.
2. **Open lines.** A pawn break (f4–f5, g4–g5, or e4–e5 to remove the f6 knight) or an exchange sacrifice that removes a defender.
3. **Strike** with checks and forcing moves so the defender never gets a free tempo to bring help.

Rubinstein's game below is the model: every black piece points at the king before a single sacrifice, then two sacrifices in a row remove the two pieces that hold White together.

```board
fen: 2rr2k1/1b3ppp/pb2p3/1p2P3/1P2BPnq/P1N3P1/1B2Q2P/R4R1K b - - 0 22
arrows: c8c3, d8d2, b7e4, b6g1
caption: Rotlewi – Rubinstein after 22.g3. Both rooks, both bishops and the queen aim at the king. The knight on c3 and the queen on e2 are all that holds White.
```

## Play it

<p class="puzzle-intro">1 · Rubinstein's Immortal, after 22.g3. Black's queen is attacked. Ignore it.</p>

```try
fen: 2rr2k1/1b3ppp/pb2p3/1p2P3/1P2BPnq/P1N3P1/1B2Q2P/R4R1K b - - 0 22
solution: Rxc3 gxh4 Rd2
hint: Remove the knight that guards e4, then attack the queen that guards everything else.
prompt: Black to play. Two sacrifices.
success: 22…Rxc3! 23.gxh4 Rd2!! The queen is offered. 24.Qxd2 Bxe4+ 25.Qg2 Rh3 and mate on h2 cannot be stopped. 24.Bxc3 Bxe4+ 25.Qxe4 Rxh2# and 24.Qxg4 Bxe4+ 25.Rf3 Rxf3 are no better.
```

<p class="puzzle-intro">2 · Kasparov – Topalov, Wijk aan Zee 1999, after 35…Kd1. The king has walked into the white camp. Finish the hunt.</p>

```try
fen: 3r3r/1R3p1p/6p1/1p6/2q5/5PPB/1Q5P/1K1k4 w - - 0 36
solution: Bf1 Rd2 Rd7 Rxd7 Bxc4
hint: First cut off the king and attack the queen with a quiet bishop move. The rook on b7 then joins with a threat the king cannot meet.
prompt: White to play and win.
success: 36.Bf1! Rd2 37.Rd7! Rxd7 38.Bxc4 bxc4 and the queen and pawn ending is easily won. Quiet moves in a king hunt: the pieces close in, and the checks come at the end.
```

## Remember

- Count attackers and defenders before you sacrifice. If you are behind, bring a piece.
- Open lines with a pawn break or a sacrifice that removes a defender.
- Every move of the strike should be a check or a threat.
- The opponent's counterplay on the other wing is the clock. Attack faster, or slow it down first.

+++ Read more: the games in full

**Rotlewi – Rubinstein, Łódź 1907.** Rubinstein was, in 1907, on his way to being the strongest player in the world. The game is a Tarrasch Defence where White's slow queen moves let Black finish development first, and the bishops on b6 and b7 do the rest.

```pgn
file: rotlewi-rubinstein-1907.pgn
```

**Kasparov – Topalov, Wijk aan Zee 1999.** The most famous game of modern chess, and an honest note: engines have shown that 24.Rxd4 was not the strongest move and that Black could have held with 25…Qxe7. Over the board the combination is more than fifteen moves deep; nobody has ever defended against something like it at the board. Play through it for the king walk.

```pgn
file: kasparov-topalov-1999.pgn
```

+++
