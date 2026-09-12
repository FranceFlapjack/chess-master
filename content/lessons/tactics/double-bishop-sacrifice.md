---
id: tactics/double-bishop-sacrifice
track: Tactics
title: The double bishop sacrifice
lede: One bishop takes h7, the other takes g7, and the king is left with nothing in front of it. Lasker played it in 1889 and it has carried his name since.
level: 3
sources:
  - Lasker – Bauer, Amsterdam 1889. Move list checked against Wikipedia, https://en.wikipedia.org/wiki/Lasker_versus_Bauer,_Amsterdam,_1889
  - Puzzle positions taken from the game itself, checked with Stockfish 18.
---

## The idea

The Greek gift removes the h-pawn and brings a knight. When there is no knight to bring, a second bishop can remove the g-pawn instead. What is needed: two bishops aimed at h7 and g7, a queen that can reach the h-file with check, and a rook that can lift to the third rank. The queen and rook then mate, or win the queen.

```board
fen: r4rk1/1b2bppp/ppq1p3/2ppB2n/5P2/1P1BP3/P1PPQ1PP/R4RK1 w - - 0 15
arrows: d3h7, e5g7:alt, e2h5:alt
highlight: h7, g7
caption: Lasker – Bauer after 14…Nxh5. Both bishops point at the king, the queen can reach h5 with check, and the rook on f1 can lift to f3.
```

**The check before you start.** After both sacrifices the king stands on g7 or h7 with no pawns. Your queen must give check at once, and your rook must be able to join within two moves. If either is missing, you have given two bishops for two pawns.

## Play it

<p class="puzzle-intro">1 · Lasker – Bauer, move 15. Both sacrifices.</p>

```try
fen: r4rk1/1b2bppp/ppq1p3/2ppB2n/5P2/1P1BP3/P1PPQ1PP/R4RK1 w - - 0 15
solution: Bxh7+ Kxh7 Qxh5+ Kg8 Bxg7
hint: Bishop takes h7, queen takes the knight with check, bishop takes g7.
prompt: White to play. Strip the king.
success: If the king does not take on g7, Qh8 is mate. If it does, the queen and rook finish the job.
```

<p class="puzzle-intro">2 · Move 18. The king has taken the second bishop. Bring the rook.</p>

```try
fen: r4r2/1b2bpk1/ppq1p3/2pp3Q/5P2/1P2P3/P1PP2PP/R4RK1 w - - 0 18
solution: Qg4+
hint: Check to push the king to the h-file. The rook lift comes next.
prompt: White to play. Keep the king on the run.
success: After 18…Kh7 Lasker played 19.Rf3, threatening Rh3 mate, and Black had to give up the queen on h6 to stop it. (Engines find 19.Qh3+ first, a slightly faster route to the same win.)
```

<p class="puzzle-intro">3 · Move 22. Black has given the queen. Now find the move that justifies everything.</p>

```try
fen: r4r2/1b2bp2/pp5k/2ppp3/5PQ1/1P2P3/P1PP2PP/R5K1 w - - 0 22
solution: Qd7
hint: A quiet move. Two black bishops are loose, and one queen move attacks both.
prompt: White to play. Win a piece.
success: The double attack on the two bishops is the point of the whole combination. Without it White would have given too much.
```

## Remember

- Two bishops on the king's pawns, a queen check on the h-file, a rook lift: all three are needed.
- The queen gives the first check; the rook lift is the threat that decides.
- Always look at the end of the line for a quiet double attack, as Lasker did with Qd7.

+++ Read more: the game in full

```pgn
file: lasker-bauer-1889.pgn
```

+++
