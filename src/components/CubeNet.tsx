import { Face, faceColor, faces, PieceType, Sticker, stickers } from "@/support/stickers";

export type Props = {
  show: PieceType | "both" | "none";
  highlight?: Sticker;
  // Scrambled cube: state[position] = index of the sticker there (see support/cube).
  state?: number[];
};

// Net layout in 3x3-face units: U on top, L F R B in a row, D below.
const faceOffset: Record<Face, [col: number, row: number]> = {
  U: [1, 0],
  L: [0, 1],
  F: [1, 1],
  R: [2, 1],
  B: [3, 1],
  D: [1, 2],
};

const position = (face: Face, row: number, col: number) => ({
  gridColumn: faceOffset[face][0] * 3 + col + 1,
  gridRow: faceOffset[face][1] * 3 + row + 1,
});

const cell = "aspect-square rounded-md border border-black/40 flex items-center justify-center font-bold text-black select-none";

export const CubeNet: React.FC<Props> = ({ show, highlight, state }) => (
  <div className="grid grid-cols-12 gap-0.5 w-full max-w-xl mx-auto px-4 text-sm sm:text-lg">
    {faces.map((face) => (
      <div
        key={face}
        className={`${cell} ${faceColor[face]} ${highlight ? "opacity-30" : ""} !text-black/30 text-xs`}
        style={position(face, 1, 1)}
      >
        {face}
      </div>
    ))}
    {stickers.map((s, i) => {
      const isHighlight = s === highlight;
      // ponytail: with a highlight, only that sticker may reveal its letter (drill feedback)
      const showLetter =
        (show === "both" || show === s.type) && (!highlight || isHighlight);
      return (
        <div
          key={s.letter}
          className={`${cell} ${faceColor[stickers[state?.[i] ?? i].face]} ${
            highlight && !isHighlight ? "opacity-30" : ""
          } ${isHighlight ? "ring-4 ring-black z-10 animate-pulse" : ""}`}
          style={position(s.face, s.row, s.col)}
        >
          {showLetter ? s.letter : ""}
        </div>
      );
    })}
  </div>
);
