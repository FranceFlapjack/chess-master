---
id: thinking/checks-captures-attacks
track: How to think
title: Checks, captures, attacks
lede: Before every move, list the forcing moves for both sides, in that order. It takes ten seconds and it finds most tactics on its own.
level: 1
sources:
  - Levy Rozman (GothamChess), How to Win at Chess (2023) and the "Checks, Captures, Attacks" videos — paraphrased and credited; the routine is his framing of standard advice, https://www.youtube.com/@GothamChess
  - Composed positions for this lesson, checked with Stockfish 18.
---

## The routine

Forcing moves are the ones the opponent has to answer: checks, captures, and moves that attack something valuable. Tactics are made of them. So before you move:

1. **Checks.** Every check you can give. Every check the opponent could give after your move.
2. **Captures.** Every capture, including the bad-looking ones. Count attackers and defenders on each piece.
3. **Attacks.** Moves that threaten a piece, a mate or a fork next move.

List them for yourself, then for the opponent. Only then choose. Most of the time the list is short and nothing is there. The times something is there are the games you win or lose.

## Play it

<p class="puzzle-intro">1 · Checks first. The knight has one check. What does it do?</p>

```try
fen: 2q2rk1/5ppp/8/5N2/8/8/5PPP/3Q2K1 w - - 0 1
solution: Ne7+ Kh8 Nxc8
hint: A knight check that also attacks something else is a fork.
prompt: White to play. Start with the checks.
success: Ne7+ forks the king and the queen. The list of checks had one entry, and it won the game.
```

<p class="puzzle-intro">2 · Captures. Count the attackers and defenders of the pawn on e5.</p>

```try
fen: r1bqkbnr/pppp1ppp/2n5/4p3/8/5N2/PBPPPPPP/RN1QKB1R w KQkq - 0 1
solution: Nxe5 Nxe5 Bxe5
hint: Two attackers, one defender.
prompt: White to play. Is the pawn free?
success: Attacked by the knight and the bishop on b2, defended once. Nxe5 Nxe5 Bxe5 and White is a pawn up.
```

<p class="puzzle-intro">3 · Attacks. Black's bishop on b4 has no defender. Find the move that attacks it and something else.</p>

```try
fen: r1bqk2r/ppp2ppp/4pn2/8/1bP5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 1
solution: Qa4+
hint: A check that also attacks the loose piece.
prompt: White to play.
success: Qa4+ checks and attacks the bishop on b4. Whatever blocks the check, the bishop falls next move.
```

## Remember

- Checks, captures, attacks. Yours, then theirs. Every move.
- A loose piece (no defender) is a target for any double attack.
- Count attackers and defenders before capturing.
- The routine is slow for a week and automatic after a month.

+++ Read more: where the routine comes from

The advice to look at forcing moves first is as old as chess teaching, but the three-word form used here comes from Levy Rozman, whose GothamChess channel and book *How to Win at Chess* teach it to beginners as the first habit to build. He is right about the order: checks are the most forcing, then captures, then threats. The point of saying it aloud is to make sure the list is actually made rather than skipped when a move looks obvious. Most blunders at club level happen on obvious moves.

+++
