import {
  cross,
  cubie,
  dot,
  type Face,
  normal,
  type PieceType,
  pieceView,
  stickers,
  type Vec,
} from "./stickers.ts";

/** state[position] = index (in `stickers`) of the sticker sitting there. */
export type State = number[];

export const solved = (): State => stickers.map((_, i) => i);

const key = (v: Vec, n: Vec) => `${v.join()}|${n.join()}`;
const indexAt = new Map(
  stickers.map((s, i) => [key(cubie(s), normal[s.face]), i]),
);

// Clockwise quarter turn (seen from outside the face) around outward axis a:
// Rodrigues with θ = -90°: v' = a(a·v) - a×v
const rotate = (v: Vec, a: Vec): Vec => {
  const c = cross(a, v);
  const d = dot(a, v);
  return [a[0] * d - c[0], a[1] * d - c[1], a[2] * d - c[2]];
};

const turnMap = (face: Face): number[] => {
  const axis = normal[face];
  return stickers.map((s, i) => {
    const v = cubie(s);
    if (dot(v, axis) !== 1) return i;
    return indexAt.get(key(rotate(v, axis), rotate(normal[s.face], axis)))!;
  });
};
const turns = Object.fromEntries(
  (["U", "D", "L", "R", "F", "B"] as Face[]).map((f) => [f, turnMap(f)]),
) as Record<Face, number[]>;

const turn = (state: State, face: Face): State => {
  const next = state.slice();
  turns[face].forEach((to, from) => (next[to] = state[from]));
  return next;
};

/** Moves in standard notation: "R", "U'", "F2". */
export const applyMoves = (state: State, moves: string[]): State =>
  moves.reduce((s, move) => {
    const times = move.endsWith("'") ? 3 : move.endsWith("2") ? 2 : 1;
    for (let t = 0; t < times; t++) s = turn(s, move[0] as Face);
    return s;
  }, state);

// ponytail: random-move scramble, not random-state; fine for memo practice.
export const scramble = (length = 25) => {
  const faces: Face[] = ["U", "D", "L", "R", "F", "B"];
  const moves: string[] = [];
  while (moves.length < length) {
    const face = faces[Math.floor(Math.random() * 6)];
    if (moves.at(-1)?.[0] === face) continue;
    moves.push(face + ["", "'", "2"][Math.floor(Math.random() * 3)]);
  }
  return { moves, state: applyMoves(solved(), moves) };
};

/** Sticker positions of a piece, starting at `i`, in clockwise order. */
const pieceOrder = (i: number): number[] => {
  const s = stickers[i];
  const v = cubie(s);
  const at = (f: Face) => indexAt.get(key(v, normal[f]))!;
  const { sides } = pieceView(s);
  return sides.length === 1 ? [i, at(sides[0])] : [i, at(sides[1]), at(sides[0])];
};

const samePiece = (a: number, b: number) =>
  cubie(stickers[a]).join() === cubie(stickers[b]).join();

// Old Pochmann buffers: edge UR (b), corner ULB (A).
const bufferLetter: Record<PieceType, string> = { edge: "b", corner: "A" };

/**
 * Old Pochmann memo: follow the buffer; when the buffer piece comes home
 * while pieces are unsolved, cycle break to the first free letter (A→X).
 */
export const memo = (start: State, type: PieceType) => {
  const state = start.slice();
  const buffer = stickers.findIndex((s) => s.letter === bufferLetter[type]);
  const letters: string[] = [];
  const breaks: number[] = [];
  const isSolved = (i: number) => pieceOrder(i).every((p) => state[p] === p);
  const breakOrder = stickers
    .map((_, i) => i)
    .filter((i) => stickers[i].type === type && !samePiece(i, buffer))
    .sort((a, b) =>
      stickers[a].letter.toUpperCase().localeCompare(stickers[b].letter.toUpperCase()),
    );

  const swapWithBuffer = (target: number) => {
    const from = pieceOrder(buffer);
    const to = pieceOrder(target);
    from.forEach((p, k) => ([state[p], state[to[k]]] = [state[to[k]], state[p]]));
    letters.push(stickers[target].letter);
  };

  for (let guard = 0; guard < 100; guard++) {
    const home = state[buffer];
    if (!samePiece(home, buffer)) {
      swapWithBuffer(home);
      continue;
    }
    const next = breakOrder.find((i) => !isSolved(i));
    if (next === undefined) {
      // A valid cube can't end with only the buffer flipped/twisted.
      if (!isSolved(buffer)) throw new Error("buffer left unsolved");
      return { letters, breaks };
    }
    breaks.push(letters.length);
    swapWithBuffer(next);
  }
  throw new Error("memo did not terminate");
};
