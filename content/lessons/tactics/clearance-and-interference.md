---
id: tactics/clearance-and-interference
track: Tactics
title: Clearance and interference
lede: Clearance moves your own piece out of the way, with tempo, so another piece can use the line. Interference puts a piece in the way of an enemy line so its defence stops working.
level: 3
sources:
  - Composed positions for this lesson, checked with Stockfish 18. The interference puzzle follows the classic Novotny pattern (Antonín Novotný, 1854).
  - Pattern definitions as in the Wikipedia articles "Interference (chess)" and "Clearance (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Interference_(chess)
---

## The idea

Sometimes the piece blocking your attack is your own. **Clearance** moves it away, ideally with a check or a capture so the opponent has no time to react. Sometimes the enemy defence runs along a line. **Interference** drops a piece onto that line; capturing it puts the capturer on the line instead, or blocks a second line, and the defence collapses either way.

```board
fen: r2q1rk1/ppp2ppp/8/8/4N3/8/PPQ2PPP/RB3RK1 w - - 0 1
arrows: e4f6, c2h7:alt
highlight: e4, h7
caption: The knight on e4 blocks the queen on c2 and the bishop on b1 behind it. Nf6+ clears the diagonal with check, and Qxh7 is mate next move.
```

## Play it

<p class="puzzle-intro">1 · Clearance with check.</p>

```try
fen: r2q1rk1/ppp2ppp/8/8/4N3/8/PPQ2PPP/RB3RK1 w - - 0 1
solution: Nf6+ Qxf6 Qxh7#
hint: Your own knight is in the way of the queen. Move it with check.
prompt: White to play. Mate in two.
success: Whatever took the knight, the diagonal to h7 was open.
```

<p class="puzzle-intro">2 · Clearance with a capture. The rook on d4 blocks the long diagonal.</p>

```try
fen: rn3rk1/pp1r2pp/7Q/8/3R4/8/PB4PP/6K1 w - - 0 1
solution: Rxd7 Nxd7 Qxg7#
hint: Move the rook off the diagonal, taking something on the way.
prompt: White to play. Mate in two.
success: With the diagonal clear, the bishop on b2 supports the queen on g7.
```

<p class="puzzle-intro">3 · Interference, the Novotny. The rook on a7 guards g7 along the rank; the bishop on a3 guards f8 along the diagonal. The lines cross on e7.</p>

```try
fen: 7k/r5pp/8/3N4/3Q4/b1B5/PP4PP/5RK1 w - - 0 1
solution: Ne7 Rxe7 Rf8#
hint: Put a piece on the square where the two defensive lines cross. Whichever piece takes it blocks the other.
prompt: White to play. Mate in two.
success: If the rook takes, it blocks the bishop and Rf8 is mate. If the bishop takes, it blocks the rook and Qxg7 is mate, supported by the bishop on c3.
```

## Remember

- Your own piece in the way? Move it with check or a capture.
- Enemy defence along a line? Put something on the line, at the crossing point if there are two.
- Both ideas are about lines. Before you calculate, trace every line that matters through the position.
