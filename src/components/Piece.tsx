import { faceFill, pieceView, Sticker } from "@/support/stickers";

export type Props = {
  sticker: Sticker;
  letter?: string;
};

const stroke = "stroke-black/60";

// Isometric view, asked sticker on top. Corner: top + left + right face.
// Edge: top + one front face.
export const Piece: React.FC<Props> = ({ sticker, letter }) => {
  const { top, sides } = pieceView(sticker);
  const isCorner = sides.length === 2;
  return (
    <svg viewBox="0 0 100 100" className="w-48 h-48" strokeWidth={1.5} strokeLinejoin="round">
      {isCorner ? (
        <>
          <polygon points="50,8 90,30 50,52 10,30" className={`${faceFill[top]} ${stroke}`} />
          <polygon points="10,30 50,52 50,96 10,74" className={`${faceFill[sides[0]]} ${stroke}`} />
          <polygon points="50,52 90,30 90,74 50,96" className={`${faceFill[sides[1]]} ${stroke}`} />
        </>
      ) : (
        <>
          <polygon points="30,10 95,10 70,42 5,42" className={`${faceFill[top]} ${stroke}`} />
          <polygon points="5,42 70,42 70,92 5,92" className={`${faceFill[sides[0]]} ${stroke}`} />
          {/* plastic body, for depth */}
          <polygon points="70,42 95,10 95,60 70,92" className={`fill-slate-800 ${stroke}`} />
        </>
      )}
      {letter && (
        <text
          x={50}
          y={isCorner ? 30 : 26}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-[14px] font-bold fill-black"
        >
          {letter}
        </text>
      )}
    </svg>
  );
};
