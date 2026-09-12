---
id: tactics/greek-gift
track: Tactics
title: The Greek Gift
lede: Bishop takes h7 with check, knight to g5 with check, queen to h5. Four hundred years old and still winning games at every level.
level: 2
sources:
  - Gioachino Greco, manuscript games (c. 1620). Public domain. Move list as reproduced by Exeter Chess Club, https://exeterchessclub.org.uk/content/greek-gift
  - Colle – O'Hanlon, Nice 1930, and Markland – Klundt, Madrid 1971. Game records are facts and free to use; annotations here are our own.
  - Lasker – Bauer, Amsterdam 1889. Move list checked against Wikipedia, https://en.wikipedia.org/wiki/Lasker_versus_Bauer,_Amsterdam,_1889
  - The checklist of conditions is adapted from the Wikipedia article "Greek gift sacrifice" (CC BY-SA 4.0), https://en.wikipedia.org/wiki/Greek_gift_sacrifice
  - Video, if you prefer to watch it explained: Susan Polgar, "How to Master the Greek Gift Sacrifice (Bxh7+)", https://www.youtube.com/watch?v=psUv-bgYB88
---

## The idea

Black has castled, and the knight that guards h7 from f6 has left. White's bishop, knight and queen can all reach the king in three moves, each one with check or a mate threat. Give the bishop, and the rest of the army walks in.

```board
fen: r1bq1rk1/pppp1ppp/2n1p3/b2nP3/3P3P/2PB1N2/PP3PP1/RNBQK2R w KQ - 1 8
arrows: d3h7, f3g5:alt, d1h5:alt
highlight: h7
caption: Greco, c. 1620. Bishop takes h7, knight to g5, queen to h5.
```

**Before you give the bishop, check three things:** the knight can reach g5 safely, the queen can reach h5, and no black piece can come back to defend h7 in time. A white pawn on e5 usually guarantees the third.

## Play it

<p class="puzzle-intro">1 · Greco's line. You are White; Black's replies are played for you.</p>

```try
fen: r1bq1rk1/pppp1ppp/2n1p3/b2nP3/3P3P/2PB1N2/PP3PP1/RNBQK2R w KQ - 1 8
solution: Bxh7+ Kxh7 Ng5+ Kg8 Qh5
hint: Bishop first. Then the knight comes in with check, and the queen threatens mate on h7.
prompt: Find the three-move sequence that wins.
success: Qh7 is unstoppable without giving up the queen.
```

<p class="puzzle-intro">2 · The king walks out. Colle – O'Hanlon, Nice 1930. When the king goes to g6, the queen cannot check on h5. (Honesty note: engines today rate the quiet 12.Bc2 a little higher than the sacrifice, and with best defence Black holds. It is still the practical choice, and the pattern is the point.)</p>

```try
fen: r1bqr1k1/pp1n1ppp/3bp3/8/3pB3/2P2N2/PP3PPP/R1BQR1K1 w - - 0 12
solution: Bxh7+ Kxh7 Ng5+ Kg6 h4
hint: Against Kg6, bring the h-pawn: h5+ will drive the king further out.
prompt: Sacrifice, then find the right move against Kg6.
success: Colle's move. h5+ is coming and the king has to keep walking.
```

<p class="puzzle-intro">3 · The rook lift. Markland – Klundt, Madrid 1971. White has a rook on b3 with a clear third rank.</p>

```try
fen: r1b2rk1/pp3ppp/2nbp3/q7/3P4/1R1B1N2/P4PPP/2BQ1RK1 w - - 4 14
solution: Bxh7+ Kxh7 Ng5+ Kg6 Rh3
hint: The rook on b3 would love to be on the h-file.
prompt: Sacrifice, then bring the strongest piece you have not used yet.
success: Rh3 threatens Rh6+ and Qh5+. Black resigned three moves later.
```

<p class="puzzle-intro">4 · When it fails. You are Black. White just played the Greek gift and Ng5+ without checking who guards g5.</p>

```try
fen: rnb2r2/pp1nqppk/4p3/2ppP1N1/3P4/2N5/PPP2PPP/R2QK2R b KQ - 1 10
solution: Qxg5
hint: Which black piece is looking at g5?
prompt: Punish the sacrifice.
success: The queen simply takes the knight. White gave two pieces for a pawn.
```

## Remember

- Bishop takes h7, knight to g5, queen to h5. Check, check, threat.
- Kg8 loses to Qh5. Kg6 is met by h4. Kh6 usually loses the queen to a knight fork on f7.
- Run the checklist first. The most common way to lose with the Greek gift is playing it when g5 is covered.

+++ Read more: the full checklist

1. **The bishop can take h7 with check.** Nothing is in the way on the b1–h7 diagonal and the king is on g8.
2. **A knight can reach g5 with check next move.** Usually from f3, sometimes from e4 or h3. The square must not be covered by a black bishop on e7 or a queen that can take on g5 for free.
3. **The queen can join at once**, typically on h5, sometimes via d3 or the d1–h5 diagonal.
4. **Black cannot defend h7 in time.** The knight is not on f6, and there is no easy …Nf6 or …Bf5 coming back to cover it.
5. **Black's pieces are shut out.** A white pawn on e5 is the classic sign: it evicted the knight and stops the defence from returning.

If a black bishop sits on e7, add a sixth: you need an h-pawn on h4 so that after …Bxg5 you can recapture with the pawn and open the h-file.

The sacrifice is called the Greek gift because, like the wooden horse, it looks like a present and turns out to be the whole army. Some writers credit the name to Gioachino Greco instead, who wrote the first known example down around 1620.

+++

+++ Read more: the three king moves

After 1.Bxh7+ Kxh7 2.Ng5+ the king has three squares. Each has a standard answer.

**Back to g8.** The natural retreat, and usually the losing one. 3.Qh5 threatens mate on h7, and the only ways to stop it are …Qxg5 (giving up the queen) or …Re8 so the king can run to f8.

```board
fen: r1bq1rk1/pppp1pp1/2n1p3/b2nP1N1/3P3P/2P5/PP3PP1/RNBQK2R w KQ - 2 10
arrows: d1h5
caption: After 9…Kg8: 10.Qh5 and mate on h7 is threatened.
```

**Out to g6.** The most stubborn defence. The king covers h5 and h7, so bring more pieces: **h4** with the threat of h5+, often followed by Qg4 or Qd3+. Slower, but with a pawn on e5 boxing in Black's pieces the king rarely survives the walk.

```board
fen: r1bq1r2/pppp1pp1/2n1p1k1/b2nP1N1/3P3P/2P5/PP3PP1/RNBQK2R w KQ - 2 10
arrows: h4h5, d1g4:alt
highlight: h5
caption: After 9…Kg6: 10.h4 and h5+ is the threat.
```

**Up to h6.** Rarely played, because a knight check from f7 forks the king and the queen on d8. When the queen has already moved, Kh6 can be a real try, and then h4 or Qd3 with ideas of Qh3+ keeps the attack going.

```board
fen: r1bq1r2/pppp1pp1/2n1p2k/b2nP1N1/3P3P/2P5/PP3PP1/RNBQK2R w KQ - 2 10
arrows: g5f7:bad
highlight: d8, h6
caption: After 9…Kh6: 10.Nxf7+ wins the queen.
```

+++

+++ Read more: the games in full

**Greco, c. 1620.** The Greek gift in its purest form. Notice how every white move after the sacrifice comes with check or a mate threat.

```pgn
file: greco-greek-gift.pgn
```

**Colle – O'Hanlon, Nice 1930.** Colle built a whole opening system around the bishop on d3, and this is its most famous payoff. Black tries the g6 defence; watch the h-pawn and the second sacrifice on e6.

```pgn
file: colle-ohanlon-1930.pgn
```

**Lasker – Bauer, Amsterdam 1889.** The Greek gift's famous cousin: when the knight cannot come to g5, a second bishop takes on g7 instead. Same setup, a queen that reaches h5 and a rook that lifts to the third rank.

```pgn
file: lasker-bauer-1889.pgn
```

+++
