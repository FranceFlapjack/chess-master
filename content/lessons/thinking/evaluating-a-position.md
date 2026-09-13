---
id: thinking/evaluating-a-position
track: How to think
title: Evaluating a position
lede: Who is better, and why? Four questions, in order, and a plan that follows from the answers.
level: 2
sources:
  - Capablanca, Chess Fundamentals (1921), chapter 2, "General principles" — public domain, https://www.gutenberg.org/ebooks/33870
  - Composed positions for this lesson, checked with Stockfish 18.
---

## Four questions

1. **Material.** Count it. A pawn is one, minor pieces three, rook five, queen nine. Then note whether the count is the whole story.
2. **King safety.** Is either king in the centre, or short of defenders, or facing open lines? A king in danger outweighs a pawn or two.
3. **Activity.** Which pieces are doing something? An undeveloped piece is a temporary pawn down. A rook on an open file, a knight on an outpost, a bishop on a long diagonal count for more than the same piece at home.
4. **Structure.** Isolated, doubled, backward and passed pawns; who has the better ending if the pieces come off.

Then decide: is the position won, better, equal, worse or lost, and what does the assessment say to do? Ahead in material with a safe king: simplify. Ahead in activity: attack now, before the opponent catches up. Better structure: trade pieces and go to the ending. Worse: seek complications, keep pieces on.

## Play it

<p class="puzzle-intro">1 · White is a pawn up but the king is in the centre and Black is fully developed. What does the evaluation tell White to do?</p>

```try
fen: r2qkb1r/pp3ppp/2n1bn2/8/3P4/2N1BN2/PP2BPPP/R2QK2R w KQkq - 0 1
solution: O-O
tolerance: 60
hint: Material is fine. King safety is not. Fix the biggest problem first.
prompt: White to play.
success: Castle. A pawn up with a safe king is a winning ending later; a pawn up with the king in the centre is a target now.
```

<p class="puzzle-intro">2 · Material is level. White's structure is healthy, Black's c-pawns are doubled and isolated. What does that tell White?</p>

```try
fen: 3q1rk1/pp3ppp/2p5/2p5/8/3QP3/PPP2PPP/3R2K1 w - - 0 1
solution: Qxd8
tolerance: 60
hint: Whose ending is better? Then head for it.
prompt: White to play.
success: Trade queens, and rooks too if offered. In the ending the doubled, isolated c-pawns are a permanent weakness and White's king gets to them first. Structure is an argument for simplifying.
```

## Remember

- Material, king safety, activity, structure. In that order, every time the position changes character.
- The evaluation tells you the plan: simplify, attack, go to the ending, or complicate.
- Count undeveloped pieces as missing. A lead in development is a real advantage, but it expires.
- Be honest. Evaluating your own position as better than it is loses more games than misjudging the opponent's.

+++ Read more: Capablanca's list

Capablanca's "General principles" chapter in *Chess Fundamentals* is short and mostly about initiative and development: get the pieces out, do not lose time, do not chase pawns while the king is in the centre. His evaluation questions are the same four given here, though he never wrote them as a list; they are what his annotations keep returning to. The habit to build is simply to ask them out loud before making a plan, and again whenever a trade or a pawn move changes the answer to one of them.

+++
