# Sticker → Letter Trainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unfolded-cube trainer that drills Speffz sticker → letter for edges and corners.

**Architecture:** One data module derives all 48 stickers from face order + clockwise position. One `CubeNet` component renders the net (optionally letters, optionally one highlighted sticker). Two pages (Learn, Drill) under `/letters`, replacing the `edge-memory` module.

**Tech Stack:** React 18, react-router 6 (lazy routes), Tailwind, Parcel, TypeScript. Tests: Node 24 built-in `node --test` with type stripping (no new dependencies).

**Spec:** `docs/superpowers/specs/2026-11-16-sticker-letter-trainer-design.md`

## Global Constraints

- Orientation: white top (U), green front (F). Face order U L F R B D, colours W O G R B Y.
- Speffz: per face, letters clockwise starting top-left. Corners at (row,col) (0,0) (0,2) (2,2) (2,0); edges at (0,1) (1,2) (2,1) (1,0). Letter index = faceIndex*4 + i → A–X.
- Edges shown lowercase, corners uppercase on the net. Typing is case-insensitive.
- Free recall only: no multiple choice.
- No new dependencies.

## Review Focus

- Shift / Cmd / arrow keys or pasting multiple characters must not count as an answer — use a single-char text input and only evaluate `/[a-x]/i`; other characters are ignored (Task 3).
- Typing during wrong-answer feedback must not skip or double-answer — input disabled while feedback shows (Task 3).
- Wrong stickers re-queue; the round must still end — round ends when every sticker in the set has been answered correctly once (Task 3).
- On a phone there is no physical keyboard — the visible autofocused input brings up the on-screen keyboard (Task 3).
- Same letter exists as edge and corner (e.g. `c`/`C`) — the highlight alone decides which is asked; the prompt text says "edge" or "corner" (Task 3).

---

### Task 0: Save the user's work in progress

The working tree holds uncommitted user work (`Menu.tsx` extraction, `edge-memory/games/`). Task 2 deletes `edge-memory`. Before starting, ask the user to commit or confirm; do not delete uncommitted work without that.

### Task 1: Sticker data

**Files:**
- Create: `src/support/stickers.ts`
- Create: `src/support/stickers.test.ts`
- Modify: `package.json` (script `"test": "node --test src/**/*.test.ts"`)
- Modify: `tsconfig.json` (add `"allowImportingTsExtensions": true` so the test can import `./stickers.ts`)

**Interfaces:**
- Produces:
  ```ts
  export type Face = "U" | "L" | "F" | "R" | "B" | "D";
  export type PieceType = "edge" | "corner";
  export type Sticker = { letter: string; type: PieceType; face: Face; row: number; col: number };
  export const faces: Face[];                       // ["U","L","F","R","B","D"]
  export const faceColor: Record<Face, string>;     // Tailwind bg classes: U bg-slate-100, L bg-orange-500, F bg-green-500, R bg-red-500, B bg-blue-500, D bg-yellow-300
  export const stickers: Sticker[];                 // 48 entries; letter lowercase for edges, uppercase for corners
  ```

- [ ] **Step 1: Write failing test** `src/support/stickers.test.ts` using `node:test` + `node:assert`, importing `./stickers.ts`:
  ```ts
  const find = (letter: string) => stickers.find((s) => s.letter === letter)!;
  assert.equal(stickers.length, 48);
  assert.deepEqual(find("C"), { letter: "C", type: "corner", face: "U", row: 2, col: 2 }); // UFR
  assert.deepEqual(find("Q"), { letter: "Q", type: "corner", face: "B", row: 0, col: 0 });
  assert.deepEqual(find("f"), { letter: "f", type: "edge", face: "L", row: 1, col: 2 });   // LF = orange-green
  assert.deepEqual(find("x"), { letter: "x", type: "edge", face: "D", row: 1, col: 0 });
  ```
- [ ] **Step 2:** `yarn test` — Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `src/support/stickers.ts` by looping faces × 4 positions using the constraint table above.
- [ ] **Step 4:** `yarn test` passes; `yarn check-types` passes.
- [ ] **Step 5:** Commit `feat: speffz sticker data`.

### Task 2: Cube net + Learn page, replace edge-memory

**Files:**
- Create: `src/components/CubeNet.tsx`
- Create: `src/modules/letters/Index.tsx`, `src/modules/letters/Learn.tsx`
- Modify: `src/application/Router.tsx` (replace `/edge-memory` routes with `/letters` → index, `learn`, `drill`)
- Modify: `src/application/App.tsx` (single entry `{ path: "/letters", name: "Sticker letters" }`; drop the dead `/corner-memory` entry)
- Delete: `src/modules/edge-memory/`, `src/components/Edge.tsx`, `src/support/edges.ts`

**Interfaces:**
- Consumes: `stickers`, `faces`, `faceColor`, `PieceType` from Task 1.
- Produces:
  ```ts
  // src/components/CubeNet.tsx
  export type Props = {
    show: PieceType | "both" | "none";   // which letters are printed on stickers
    highlight?: Sticker;                  // drawn with a thick ring, other stickers dimmed
  };
  export const CubeNet: React.FC<Props>;
  ```
  Pages export `Component` (react-router lazy convention, as existing pages do).

- [ ] **Step 1:** `CubeNet`: CSS grid 12×9 cells; face offsets U(3,0) L(0,3) F(3,3) R(6,3) B(9,3) D(3,6) in (col,row) cell units. Centre cell shows the face letter.
- [ ] **Step 2:** `Learn.tsx`: `CubeNet` plus three buttons (Zijdes / Hoeken / Beide) setting `show`.
- [ ] **Step 3:** `Index.tsx`: `Menu` with Learn, Drill, Back.
- [ ] **Step 4:** Verify: `yarn check-types && yarn lint` pass; `yarn start`, open `/letters/learn`, check `C` sits on the white face bottom-right next to green/red and `f` on orange next to green.
- [ ] **Step 5:** Commit `feat: cube net learn mode, replace edge memory`.

### Task 3: Drill page

**Files:**
- Create: `src/modules/letters/Drill.tsx`

**Interfaces:**
- Consumes: `CubeNet`, `stickers`, `shuffle` from `src/support/shuffle.ts`, `Menu`.

- [ ] **Step 1:** Mode picker before the round: Zijdes / Hoeken / Gemengd. Queue = shuffled stickers of that set.
- [ ] **Step 2:** Round: show `CubeNet show="none" highlight={queue[0]}`, prompt "Welke letter? (zijde|hoek)", autofocused `<input maxLength={1}>`.
  - Typed char not matching `/^[a-x]$/i`: clear input, ignore.
  - Correct (case-insensitive): drop from queue, record response time, next.
  - Wrong: show correct letter on the net (`show` for that type) for 1500 ms with input disabled; move sticker to end of queue; mark it as missed.
- [ ] **Step 3:** End when queue empty: show "first-try correct X/N", average response time (ms, 1 decimal, same formatter as old EdgeMemory), list of missed letters, and `Menu` (Again / Back).
- [ ] **Step 4:** Verify: `yarn check-types && yarn lint`; manual run of each Review Focus case (Shift, paste "ab", typing during feedback, deliberately wrong answers then finish round, mobile viewport in devtools).
- [ ] **Step 5:** Commit `feat: sticker letter drill`.
