---
id: tactics/greek-gift
track: Tactics
title: The Greek Gift
lede: A bishop lands on h7 with check, the king takes it, and a knight and queen arrive before the rest of the defence can. Four hundred years old and still winning games at every level.
level: 2
sources:
  - Gioachino Greco, manuscript games (c. 1620). Public domain. Move list as reproduced by Exeter Chess Club, https://exeterchessclub.org.uk/content/greek-gift
  - Colle – O'Hanlon, Nice 1930, and Markland – Klundt, Madrid 1971. Game records are facts and free to use; annotations here are our own.
  - Lasker – Bauer, Amsterdam 1889. Move list checked against Wikipedia, https://en.wikipedia.org/wiki/Lasker_versus_Bauer,_Amsterdam,_1889
  - The checklist of conditions is adapted from the Wikipedia article "Greek gift sacrifice" (CC BY-SA 4.0), https://en.wikipedia.org/wiki/Greek_gift_sacrifice
  - Video, if you prefer to watch it explained: Susan Polgar, "How to Master the Greek Gift Sacrifice (Bxh7+)", https://www.youtube.com/watch?v=psUv-bgYB88
---

## The pattern

White has castled-side pieces aimed at Black's king: a bishop on the b1–h7 diagonal, a knight ready to jump to g5, and a queen that can reach h5. Black has castled short, and the knight that normally guards h7 from f6 is gone.

```board
fen: r1bq1rk1/pppp1ppp/2n1p3/b2nP3/3P3P/2PB1N2/PP3PP1/RNBQK2R w KQ - 1 8
arrows: d3h7, f3g5:alt, d1h5:alt
highlight: h7
caption: Greco's position after 7…Nd5. The bishop takes on h7, the knight comes to g5 with check, the queen to h5. Three moves, and the king has nowhere to hide.
```

The sacrifice is called the Greek gift because, like the wooden horse, it looks like a present and turns out to be the whole army. Some writers credit the name to Gioachino Greco instead, an Italian master who wrote the first known example down around 1620. Either story works: the idea is the same one Greco recorded, and it has hardly changed.

## The checklist

Before you give the bishop, check five things. If one is missing, the sacrifice usually fails, and you have simply lost a piece.

1. **The bishop can take h7 with check.** Nothing is in the way on the b1–h7 diagonal and the king is on g8.
2. **A knight can reach g5 with check next move.** Usually from f3, sometimes from e4 or h3. The square must not be covered by a black bishop on e7 or a queen that can take on g5 for free.
3. **The queen can join at once**, typically on h5, sometimes via the d1–h5 diagonal or d3.
4. **Black cannot defend h7 in time.** The knight is not on f6, and there is no easy …Nf6 or …Bf5 coming back to cover it.
5. **The e-pawn (or another piece) takes f6 and d6 away from Black's pieces.** A white pawn on e5 is the classic sign: it both evicted the knight and stops the defence from returning.

If a black bishop sits on e7, add a sixth: you need an h-pawn on h4 so that after …Bxg5 you can recapture with the pawn and open the h-file.

## The three king moves

After 1.Bxh7+ Kxh7 2.Ng5+ the king has three squares. Each has a standard answer, and knowing all three is what makes the sacrifice a technique rather than a gamble.

### Back to g8

```board
fen: r1bq1rk1/pppp1pp1/2n1p3/b2nP1N1/3P3P/2P5/PP3PP1/RNBQK2R w KQ - 2 10
arrows: d1h5
caption: After 9…Kg8, White plays 10.Qh5 and threatens Qh7 mate. Black can only delay it with …Re8 and a king walk, or give up the queen with …Qxg5.
```

The natural retreat, and usually the losing one. 3.Qh5 threatens mate on h7, and the only ways to stop it are …Qxg5 (giving up the queen) or …Re8 so the king can run to f8, which is what Greco's opponent tried.

### Out to g6

```board
fen: r1bq1r2/pppp1pp1/2n1p1k1/b2nP1N1/3P3P/2P5/PP3PP1/RNBQK2R w KQ - 2 10
arrows: h4h5, d1g4:alt
highlight: h5
caption: After 9…Kg6, the king blocks the queen's route to h7, so White brings more pieces: h4–h5+ is the main threat, and Qg4 or Qd3+ often follow.
```

The most stubborn defence. The king on g6 covers h5 and h7, so Qh5+ is no longer available for free. The standard plan is **h4** with the threat of h5+, driving the king further out, often followed by Qg4 or Qd3+. It is slower, but with a pawn on e5 boxing in Black's pieces, the king rarely survives the walk.

### Up to h6

```board
fen: r1bq1r2/pppp1pp1/2n1p2k/b2nP1N1/3P3P/2P5/PP3PP1/RNBQK2R w KQ - 2 10
arrows: g5f7:bad
highlight: d8, h6
caption: After 9…Kh6, the knight simply takes on f7 with check and forks the queen on d8.
```

Rarely played, because a knight check from f7 (or e6) usually forks the king and the queen on d8. When the queen has already moved, Kh6 can be a real try, and then h4 or Qd3 with ideas of Qh3+ keeps the attack going.

## Try it: Greco's line

Play the sacrifice yourself. You are White. Black's replies are played for you.

```try
fen: r1bq1rk1/pppp1ppp/2n1p3/b2nP3/3P3P/2PB1N2/PP3PP1/RNBQK2R w KQ - 1 8
solution: Bxh7+ Kxh7 Ng5+ Kg8 Qh5
hint: The bishop first. Then the knight comes in with check, and the queen threatens mate on h7.
prompt: Find the three-move sequence that wins.
success: That is the whole idea. Qh7 is unstoppable without giving up the queen.
```

Here is the complete game. Step through it and notice how every white move after the sacrifice comes with check or a mate threat.

```pgn
file: greco-greek-gift.pgn
```

## A model game: Colle – O'Hanlon, Nice 1930

Edgard Colle built a whole opening system around this bishop on d3, and this is its most famous payoff. Black chooses the g6 defence, so we get to see the h-pawn plan in practice.

```pgn
file: colle-ohanlon-1930.pgn
```

Two things to take from it. First, notice how Colle got the knight off f6: he exchanged it on e4 rather than driving it with a pawn. Second, when the king ran to g6, he did not hurry with checks. He played 14.h4, the threat of h5+ was enough, and then he found a second sacrifice to strip the last defenders.

## Try it: the Kg6 defence

You are White in Colle's position after 11…cxd4. Give the gift and find the follow-up against the king walk.

```try
fen: r1bqr1k1/pp1n1ppp/3bp3/8/3pB3/2P2N2/PP3PPP/R1BQR1K1 w - - 0 12
solution: Bxh7+ Kxh7 Ng5+ Kg6 h4
hint: When the king comes to g6 the queen cannot check on h5, so bring the h-pawn instead.
prompt: Play the sacrifice and the right move against Kg6.
success: Exactly Colle's continuation. h5+ is coming, and the king has to keep walking.
```

## When it does not work

The most common way to lose with the Greek gift is to play it when one item on the checklist is missing. Here the black queen sits on e7, covering g5.

```board
fen: rnb2rk1/pp1nqppp/4p3/2ppP3/3P4/2NB1N2/PPP2PPP/R2QK2R w KQ - 0 9
arrows: d3h7:bad, e7g5:alt
highlight: g5
caption: 9.Bxh7+? Kxh7 10.Ng5+ Qxg5 and White has given a bishop and a knight for a pawn and a queen for… no. Black just takes the knight. Check who guards g5 before you give the bishop.
```

Other warning signs: a black knight that can come back to f6 with tempo; a bishop on e7 when you have no h-pawn on h4; a black queen on c7 or d6 that can reach h2 or the g5 square; and a white king that is itself exposed to a counter-check.

## Try it: the rook lift

A modern example. In Markland – Klundt, Madrid 1971, White has already lifted a rook to b3, and after the king walks to g6 it swings to the h-file. You are White after 13…Qa5.

```try
fen: r1b2rk1/pp3ppp/2nbp3/q7/3P4/1R1B1N2/P4PPP/2BQ1RK1 w - - 4 14
solution: Bxh7+ Kxh7 Ng5+ Kg6 Rh3
hint: The rook on b3 has a clear third rank. Where would it like to be?
prompt: Sacrifice, then bring the strongest piece you have not used yet.
success: Rh3 threatens Rh6+ and Qh5+. Black resigned three moves later.
```

## The cousin: two bishops instead of one

Emanuel Lasker's game against Bauer in 1889 is not a Greek gift, but it comes from the same family: the bishop takes on h7, and when the knight is not available a second bishop takes on g7 to open the king completely. It is worth knowing because the setup, a queen that can reach h5 and a rook that can lift to the third rank, is the same. Play through it once now; it returns in the lesson on the double bishop sacrifice.

```pgn
file: lasker-bauer-1889.pgn
```

## Remember

- Bishop takes h7, knight to g5, queen to h5. Check, check, threat.
- Before you give the bishop, run the checklist: bishop hits h7, knight reaches g5 safely, queen can join, no defender of h7, Black's pieces are shut out.
- Kg8 loses to Qh5. Kg6 is met by h4. Kh6 usually loses the queen to a knight fork.
- Look for the sacrifice whenever the enemy knight leaves f6 and you have a pawn on e5.
