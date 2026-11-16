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
