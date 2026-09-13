---
id: mates/immortal-games
track: Checkmate patterns
title: The Immortal and the Evergreen
lede: Anderssen's two most famous games end with mates that use every piece on the board. Play the finishes yourself, then see how they were built.
level: 3
sources:
  - Anderssen – Kieseritzky, London 1851 ("the Immortal Game"). Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Immortal_Game
  - Anderssen – Dufresne, Berlin 1852 ("the Evergreen Game"). Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Evergreen_Game
  - Both finishes checked with Stockfish 18.
---

## Why these two

Adolf Anderssen won the first international tournament in London in 1851 and was, for most of the 1850s, the best player alive. His attacking games were the model everyone learned from before Steinitz and positional chess. These two are the ones every chess player knows, and both end with a mate that only works because pieces were given away first.

In the Immortal, White gives a bishop, both rooks and the queen. In the Evergreen, the queen is sacrificed with check on the last move but two. Both finishes are short, forced, and yours to find.

## Play it

<p class="puzzle-intro">1 · The Immortal Game, after 20…Na6. Black is a queen and two rooks up. White has a knight on f5, a knight on d5, a bishop on d6 and a queen on f3, and it is mate in three.</p>

```try
fen: r1b1k1nr/p2p1ppp/n2B4/1p1NPN1P/6P1/3P1Q2/P1P1K3/q5b1 w kq - 2 21
solution: Nxg7+ Kd8 Qf6+ Nxf6 Be7#
hint: Take the pawn with check, then give the queen so that a knight has to block e7's defender.
prompt: White to play. Force mate.
success: 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7#. Three minor pieces mate a king surrounded by its whole army.
```

<p class="puzzle-intro">2 · The Evergreen Game, after 20.Rxe7+ Nxe7. Black threatens mate on g2 and is ahead in material. White to play and mate in four.</p>

```try
fen: 1r2k1r1/pbppnp1p/1b3P2/8/Q7/B1PB1q2/P4PPP/3R2K1 w - - 0 21
solution: Qxd7+ Kxd7 Bf5+ Ke8 Bd7+ Kf8 Bxe7#
hint: The queen goes on d7 with check. Then two bishop checks walk the king to f8, where the bishop on a3 sees it.
prompt: White to play. Force mate.
success: 21.Qxd7+ Kxd7 22.Bf5+ Ke8 23.Bd7+ Kf8 24.Bxe7#. If the king goes to c6 on move 22, Bd7 is mate at once.
```

## Remember

- A mating attack is about the squares around the king, not about material. Count the attackers that reach those squares.
- Every sacrifice in both games came with check or a forcing threat. The defender never had a free move.
- Before you sacrifice, find the mate to the end. Anderssen's combinations are famous because they were sound as well as beautiful.

+++ Read more: the games in full

**Anderssen – Kieseritzky, London 1851.** A casual game played during the tournament. Black's queen wanders from move 3 and takes both rooks; White ignores everything and plays for mate. Modern engines find defences for Black along the way (17…Qxb2 is the losing move, and 18…Bxg1 is worse), which takes nothing from the finish.

```pgn
file: anderssen-kieseritzky-1851.pgn
```

**Anderssen – Dufresne, Berlin 1852.** An Evans Gambit. The rook lift 19.Rad1 is the famous quiet move: White brings the last piece to the attack while allowing Black to take a knight with a mate threat, because the combination that follows is faster. Lasker later showed that 20…Kd8 instead of 20…Nxe7 was a tougher defence, though White still wins.

```pgn
file: anderssen-dufresne-1852.pgn
```

+++
