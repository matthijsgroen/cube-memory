# Sticker → letter trainer

## Intent

Training for blindfolded solving. The user knows the edge and corner algorithms,
but can't quickly link a sticker position to its letter ("coordinate"). This tool
drills that link until it is automatic. Step 2 (remembering the letter chain via
mnemonics) is a separate, later project.

## Goals

- Learn the Speffz scheme: per face 4 edge letters + 4 corner letters, A–X.
- Free recall: user types the letter, no multiple choice.
- See the sticker in its place on the cube, so the structure (face + clockwise position) is learned, not 48 loose facts.

## Non-goals

- Mnemonics / letter pairs / chain memorisation (step 2).
- 3D cube, scrambles, solving guidance.
- Custom lettering schemes or orientations.

## Anti-goals

- Recognition instead of recall (multiple choice) — that is why the current attempt doesn't work.

## Constraints

- Existing stack: React 18, react-router 6, Tailwind, Parcel.
- Orientation: white top, green front (matches `src/support/edges.ts`).
- Speffz, letters clockwise per face starting top-left, faces U L F R B D.

Corners: U: A=UBL B=UBR C=UFR D=UFL · L: E=LUB F=LUF G=LDF H=LDB ·
F: I=FUL J=FUR K=FDR L=FDL · R: M=RUF N=RUB O=RDB P=RDF ·
B: Q=BUR R=BUL S=BDL T=BDR · D: U=DFL V=DFR W=DBR X=DBL.

Edges: as in `src/support/edges.ts` (U: A=UB B=UR C=UF D=UL, etc.).

## Approaches

- **A. Unfolded cube net, type the letter** — chosen. Shows position and structure, trains recall.
- B. Extend current colour-pair quiz with corners + typing — cheaper, but stickers stay detached from their place.
- C. Rotating 3D cube — closest to the real thing, much more work, hidden faces.

## Design

- **Net component**: cross layout (U on top; L F R B in a row; D below), 3×3 per face, stickers in solved colours, centres show face letter.
- **Learn mode**: all letters shown on the net (toggle edges / corners / both).
- **Drill mode**: one sticker highlighted, user types the letter on the keyboard.
  - Correct: next sticker immediately.
  - Wrong: show correct letter briefly, sticker goes back into the queue.
  - Settings: edges / corners / mixed.
  - End of round: score + average response time.
- Lowercase letters for edges, uppercase for corners in the displayed net (common convention); typing is case-insensitive, the set (edges/corners) is known from the highlight.

## Builder's calls

- Replaces the existing `edge-memory` module (multiple choice) rather than living next to it.
- Round length (e.g. 24 stickers), feedback duration, styling of highlight.
- No persistent stats for now; add when user wants to track progress over days.
