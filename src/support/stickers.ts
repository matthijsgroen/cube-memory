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
