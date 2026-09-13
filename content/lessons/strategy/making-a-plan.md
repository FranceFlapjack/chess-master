---
id: strategy/making-a-plan
track: Middlegame strategy
title: Making a plan
lede: When there is no tactic, you need a plan. Read it from the pawn structure, then put every piece where the plan needs it.
level: 3
sources:
  - Botvinnik – Capablanca, AVRO 1938. Move list checked against Wikipedia (CC BY-SA), https://en.wikipedia.org/wiki/Botvinnik_versus_Capablanca,_AVRO_1938
  - Capablanca, Chess Fundamentals (1921), chapter 2, "General principles" — public domain, https://www.gutenberg.org/ebooks/33870
  - Puzzle moves checked with Stockfish 18.
---

## Where plans come from

A plan is an answer to "what is the position asking for?" Usually the pawn structure gives it:

- A pawn majority: advance it and make a passed pawn.
- An open file: take it and get to the seventh.
- A weak enemy pawn or square: attack it with everything.
- A space advantage in the centre: keep the pieces on and break through where the opponent is cramped.
- The opponent's king short of defenders: bring pieces and open lines.

Once you have the plan, every move should do one of three things: carry it out, prepare it, or stop the opponent's.

Botvinnik's game below is the model. From move 12 he has one idea: the pawn centre e3–e4–e5, then the passed e-pawn. Capablanca wins a pawn on the far side of the board, and it is irrelevant.

```board
fen: r3r1k1/p2q1ppp/1p3n2/3p4/P1pP4/1nP1PPN1/1BQ3PP/4RRK1 w - - 1 19
arrows: e3e4, e4e5
caption: Botvinnik – Capablanca after 18…Nb3. Black attacks a4. White plays 19.e4 and never looks back.
```

## Play it

<p class="puzzle-intro">1 · Botvinnik – Capablanca, AVRO 1938, after 18…Nb3. Black will take on a4 next. What does the position ask White to do?</p>

```try
fen: r3r1k1/p2q1ppp/1p3n2/3p4/P1pP4/1nP1PPN1/1BQ3PP/4RRK1 w - - 1 19
solution: e4
tolerance: 60
hint: The pawn on a4 is not the point. Where is White stronger?
prompt: White to play. Carry out the plan.
success: 19.e4! The centre rolls: e5 follows, the knight on f6 must move, and the passed pawn on e6 decides the game twenty moves later. The a4 pawn was the price.
```

<p class="puzzle-intro">2 · The same game, after 29…Qe7. The plan has produced a passed pawn on e6 and a black king short of defenders. Now the combination.</p>

```try
fen: 8/p3q1kp/1p2Pnp1/3pQ3/2pP4/1nP3N1/1B4PP/6K1 w - - 5 30
solution: Ba3 Qxa3 Nh5+ gxh5 Qg5+ Kf8 Qxf6+ Kg8 e7
tolerance: 100
hint: The bishop has done nothing all game. It gives itself to pull the queen away from the king, and then every move is a check.
prompt: White to play and win.
success: 30.Ba3!! Qxa3 31.Nh5+! gxh5 32.Qg5+ Kf8 33.Qxf6+ Kg8 34.e7. The pawn queens. Black's checks run out after 41.Kh5.
```

## Remember

- Read the plan from the pawn structure: majorities, open files, weak squares, space.
- Every move carries out the plan, prepares it, or stops the opponent's.
- A plan is worth a pawn. Do not abandon it to grab material.
- When the plan has been carried out, look for the tactic: it is usually there.

+++ Read more: the game in full, and Capablanca's principles

**Botvinnik – Capablanca, AVRO 1938.** A Nimzo-Indian where White accepts doubled c-pawns for the bishop pair and the centre. Capablanca, then 49, wins a pawn on the queenside; Botvinnik, 27, ignores it and executes the plan he chose on move 12. The finish, from 30.Ba3, is one of the most quoted combinations in chess.

```pgn
file: botvinnik-capablanca-1938.pgn
```

Capablanca's *Chess Fundamentals* devotes its second chapter to general principles for the middlegame. The advice is short: before doing anything else, bring the pieces to squares where they act; the initiative is worth material; and a plan, even a simple one, is better than a series of good-looking moves. The plan he most often recommends is the one Botvinnik used against him: get a pawn majority in the centre and advance it.

+++
