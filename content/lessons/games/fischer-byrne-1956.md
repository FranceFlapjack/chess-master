---
id: games/fischer-byrne-1956
track: Study a whole game
title: Byrne – Fischer, New York 1956
lede: The Game of the Century. A thirteen-year-old gives up his queen for a swarm of minor pieces and the whole board.
level: 3
sources:
  - Donald Byrne – Robert Fischer, Rosenwald Memorial, New York 1956. Move list checked against Wikipedia, "The Game of the Century (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/The_Game_of_the_Century_(chess)
  - Puzzle moves checked with Stockfish 18.
---

## How to use this lesson

One diagram and two pauses. The diagram is a quiet knight move that most players would never consider; the first pause is the queen sacrifice; the second is the windmill of checks that follows. Try each pause before reading on.

## Play it

**After 11.Bg5.** Fischer, with Black, plays a move that looks like it hangs a knight.

```board
fen: r2q1rk1/pp2ppbp/1np2np1/2Q5/3PPBb1/2N2N2/PP3PPP/3RKB1R b K - 0 11
arrows: b6a4, f6e4:alt
highlight: c3
caption: 11…Na4!! If 12.Nxa4 Nxe4 and the bishop on g5 hangs to the queen with more to come. Byrne played 12.Qa3 and Black took on c3 and e4 anyway. An honest note: the justification is more than ten moves deep, and the engine used to check this course does not find the move in the time it is given; it is offered here as a diagram rather than a puzzle for that reason.
```

<p class="puzzle-intro">1 · After 17.Kf1. Fischer's queen is attacked by the bishop on c5. He does not move it.</p>

```try
fen: r3r1k1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 2 17
solution: Be6
tolerance: 60
hint: Offer the queen. What White gets in return is a knight, a bishop and a rook with checks that never stop.
prompt: Black to play. The queen sacrifice.
success: 17…Be6!! 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6, and Black has two minor pieces and a rook for the queen, with every piece active.
```

<p class="puzzle-intro">2 · After 18.Bxb6. White has taken the queen. Now the checks: play five of them.</p>

```try
fen: r3r1k1/pp3pbp/1Bp1b1p1/8/2BP4/Q1n2N2/P4PPP/3R1K1R b - - 0 18
solution: Bxc4+ Kg1 Ne2+ Kf1 Nxd4+ Kg1 Ne2+ Kf1 Nc3+
tolerance: 100
hint: Bishop takes with check, then the knight shuttles between e2 and the pieces it can take, always with check. The king can only go to g1 and f1.
prompt: Black to play. The windmill.
success: 18…Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6. Black has rook, bishop and knight for the queen, every piece active, and White's queen on a3 is a spectator.
```

## What to take from it

- A piece is worth what it does. Three active minor pieces beat a queen that stands still.
- Every check is a free move. A sequence of checks can rearrange the whole board.
- 11…Na4 is a quiet move that begins a forcing sequence. Look for quiet moves that make threats, not just captures and checks.

+++ Read more: the game in full

```pgn
file: byrne-fischer-1956.pgn
```

Fischer was thirteen. The game was named "The Game of the Century" by Hans Kmoch in *Chess Review* the same year, and the name has stuck for seventy years. Byrne, a strong master and a professor of English, played out the mate rather than resign, a courtesy to the boy.

+++
