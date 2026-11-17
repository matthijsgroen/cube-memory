export type Face = "U" | "L" | "F" | "R" | "B" | "D";
export type PieceType = "edge" | "corner";
export type Sticker = {
  letter: string;
  type: PieceType;
  face: Face;
  row: number;
  col: number;
};

// Orientation: white top, green front.
export const faces: Face[] = ["U", "L", "F", "R", "B", "D"];

export const faceColor: Record<Face, string> = {
  U: "bg-slate-100",
  L: "bg-orange-500",
  F: "bg-green-500",
  R: "bg-red-500",
  B: "bg-blue-500",
  D: "bg-yellow-300",
};

// Speffz: clockwise per face, starting top-left.
const cornerCells = [
  [0, 0],
  [0, 2],
  [2, 2],
  [2, 0],
];
const edgeCells = [
  [0, 1],
  [1, 2],
  [2, 1],
  [1, 0],
];

const letterAt = (faceIndex: number, i: number) =>
  String.fromCharCode(65 + faceIndex * 4 + i);

export const stickers: Sticker[] = faces.flatMap((face, f) => [
  ...cornerCells.map(([row, col], i) => ({
    letter: letterAt(f, i),
    type: "corner" as const,
    face,
    row,
    col,
  })),
  ...edgeCells.map(([row, col], i) => ({
    letter: letterAt(f, i).toLowerCase(),
    type: "edge" as const,
    face,
    row,
    col,
  })),
]);

export const faceName: Record<Face, string> = {
  U: "Wit",
  L: "Oranje",
  F: "Groen",
  R: "Rood",
  B: "Blauw",
  D: "Geel",
};

// Each face owns 4 consecutive letters: U = A–D, L = E–H, ...
export const faceRange = (face: Face) => {
  const f = faces.indexOf(face);
  return `${letterAt(f, 0)}–${letterAt(f, 3)}`;
};

export const inFaceRange = (sticker: Sticker, char: string) =>
  Math.floor((char.toUpperCase().charCodeAt(0) - 65) / 4) ===
  faces.indexOf(sticker.face);

export const faceFill: Record<Face, string> = {
  U: "fill-slate-100",
  L: "fill-orange-500",
  F: "fill-green-500",
  R: "fill-red-500",
  B: "fill-blue-500",
  D: "fill-yellow-300",
};

type Vec = [number, number, number];

// 3D frame: x = right (R), y = up (U), z = front (F).
const normal: Record<Face, Vec> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
  R: [1, 0, 0],
  L: [-1, 0, 0],
};

// Cubie position of a sticker, following how each face is drawn in the net.
const cubie = ({ face, row, col }: Sticker): Vec => {
  const x = col - 1;
  const y = 1 - row;
  switch (face) {
    case "U":
      return [x, 1, row - 1];
    case "D":
      return [x, -1, 1 - row];
    case "F":
      return [x, y, 1];
    case "B":
      return [-x, y, -1];
    case "R":
      return [1, y, -x];
    case "L":
      return [-1, y, x];
  }
};

const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * The piece holding `sticker`, viewed with that sticker on top.
 * Edges: one side. Corners: [left, right] as seen from outside the corner.
 */
export const pieceView = (sticker: Sticker): { top: Face; sides: Face[] } => {
  const pos = cubie(sticker).join();
  const sides = stickers
    .filter((s) => s.face !== sticker.face && cubie(s).join() === pos)
    .map((s) => s.face);
  if (sides.length === 2) {
    // Right side is the next sticker clockwise around the corner from the top.
    const [a, b] = sides;
    const aIsRight = dot(cross(normal[sticker.face], normal[a]), normal[b]) < 0;
    return { top: sticker.face, sides: aIsRight ? [b, a] : [a, b] };
  }
  return { top: sticker.face, sides };
};
