---
id: strategy/pawn-structure
track: Middlegame strategy
title: "Pawn structure: the skeleton of the game"
lede: Pieces move; pawns mostly stay. The pawns decide where the pieces belong, which files open, and where the weaknesses are.
level: 2
sources:
  - Philidor's "pawns are the soul of chess" and the definitions of isolated, doubled, backward and passed pawns as given in Wikipedia, "Pawn structure" (CC BY-SA), https://en.wikipedia.org/wiki/Pawn_structure
  - Wikipedia, "Breakthrough (chess)" (CC BY-SA), https://en.wikipedia.org/wiki/Breakthrough_(chess)
  - Nimzowitsch, My System (1925, Hereford translation), on the pawn chain — public domain.
  - Composed positions for this lesson, checked with Stockfish 18.
---

## Five words

- **Isolated:** no friendly pawn on either neighbouring file. It cannot be defended by a pawn, and the square in front of it belongs to the opponent.
- **Doubled:** two pawns on one file. They cannot protect each other and the front one is often a target.
- **Backward:** a pawn behind its neighbours that cannot advance safely. The square in front of it is a hole.
- **Passed:** no enemy pawn ahead of it on its file or the neighbouring files. It wants to queen, and it is worth more the further it goes.
- **Chain:** pawns protecting each other diagonally. Attack a chain at its base, the pawn that nothing protects.

```board
fen: 4k3/pp3ppp/2p5/3P4/8/2P5/PP3PPP/4K3 w - - 0 1
highlight: d5, c6
caption: The d5 pawn is passed only if no black pawn on c, d or e can stop it. Here c6 can, so it is not passed yet. Exchange on c6 and it will be.
```

**Majorities.** Where you have more pawns than the opponent on one wing, you can create a passed pawn by advancing them. Where you have fewer, keep them still.

## Play it

<p class="puzzle-intro">1 · The breakthrough. Three pawns against three, the kings far away. White to move makes a passed pawn by force.</p>

```try
fen: 8/ppp4k/8/PPP5/8/8/8/7K w - - 0 1
solution: b6 axb6 c6 bxc6 a6
hint: Push the middle pawn. Whichever way Black takes, the pawn on the other side runs.
prompt: White to play and force a passed pawn through.
success: 1.b6 axb6 2.c6! bxc6 3.a6 and the a-pawn queens. If 1…cxb6 then 2.a6! bxa6 3.c6 and the c-pawn does. The black king is too far to help.
```

<p class="puzzle-intro">2 · A backward pawn is a target. Black's d6 pawn cannot advance and no pawn can defend it. Bring the pressure.</p>

```try
fen: 3r2k1/pp3ppp/3p4/2p5/2P5/1P4P1/P4PBP/3R2K1 w - - 0 1
solution: Bxb7
tolerance: 60
hint: Count the attackers on d6, then count the pieces that can join.
prompt: White to play. Punish the structure.
success: The bishop takes a free pawn while the rook on d1 pins the weak d6 pawn to the rook behind it. Black cannot defend everything a bad structure leaves loose.
```

## Remember

- Name the pawns: isolated, doubled, backward, passed, chain. Each has a rule.
- Attack weak pawns with pieces; blockade passed pawns with pieces, best of all a knight.
- Your majority makes a passed pawn; use it. The opponent's majority: keep it blocked.
- Before every pawn move ask what square it gives up. Pawns do not come back.

+++ Read more: Philidor and Nimzowitsch

Philidor wrote in 1749 that pawns are the soul of chess, and meant that the pawn formation decides the plan. Nimzowitsch, in *My System*, worked that out in detail: the pawn chain, the blockade of the passed pawn, the idea that a weak square matters only if a piece can use it. The Middlegame track leans on both. The next lessons take the structures one at a time: the isolated queen's pawn, outposts, the open file, and the bishops that a pawn structure makes good or bad.

+++
