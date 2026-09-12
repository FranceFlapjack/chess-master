---
id: openings/london-system
track: Openings
title: The London System
lede: 1.d4 and Bf4 against everything. One setup, a solid centre, and plans you can play on autopilot while you learn the rest.
level: 1
sources:
  - Wikibooks, Chess Opening Theory, London System (CC BY-SA), https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._d4/1...d5/2._Bf4
  - Wikipedia, "London System" (CC BY-SA), https://en.wikipedia.org/wiki/London_System
  - The …Qb6 trap is standard theory; positions checked with Stockfish 18.
---

## The idea

White plays d4, Bf4, e3, Nf3, c3, Nbd2, Bd3 in almost any order, against almost anything. The pawns on c3, d4 and e3 make a pyramid that nothing can break, and the bishop on f4 is outside it, already developed. It is not ambitious, and that is the point: you reach a middlegame you understand every single game.

```board
fen: r1bq1rk1/p4ppp/1pnbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R w KQ - 0 9
arrows: f3e5, d1e2:alt, h2h4:alt
highlight: e5
caption: A typical London position. White's plans: a knight to e5, then Qf3 or h4 against the king, or dxc5 and the e4 break. The bishop retreats to g3 when attacked, so it can never be traded for free.
```

**Watch out for …Qb6.** Black's most annoying idea is the queen attacking b2 while White's bishop has left c1. The answer is usually Qb3 or Nc3, and there is a trap for the greedy.

## Play it

<p class="puzzle-intro">1 · Play the London setup as White. Black's replies are played for you.</p>

```try
type: line
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
solution: d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3 b6
hint: d4, Bf4, e3, Nf3, c3, Nbd2, Bg3 when the bishop is attacked, Bd3.
prompt: White to play. Build the pyramid.
success: Same setup every game. Next come castling and the knight to e5.
```

<p class="puzzle-intro">2 · The greedy queen. 2…c5 3.e3 Qb6 4.Nc3 and Black took the pawn: 4…Qxb2?. You are White.</p>

```try
fen: rnb1kbnr/pp2pppp/8/2pp4/3P1B2/2N1P3/PqP2PPP/R2QKBNR w KQkq - 0 5
solution: Nxd5
hint: The knight jumps into the centre. It cannot be taken, and Nc7+ forking king and rook is the threat.
prompt: White to play. Punish 4…Qxb2.
success: A pawn regained with the threat of Nc7+, and the black queen is offside on b2 while White develops with tempo. Black's best is the sad 5…Na6.
```

## Remember

- d4, Bf4, e3, Nf3, c3, Nbd2, Bd3. Castle. Knight to e5.
- Bishop attacked by …Bd6? Retreat to g3, and after …Bxg3 hxg3 the h-file is yours.
- Against …Qb6, do not defend b2 passively. Qb3, or Nc3 and if …Qxb2 then Nxd5.
