import type { PieceType } from "./stickers";

export type Words = Record<string, string>;

const ALL = "ABCDEFGHIJKLMNOPQRSTUVWX";

// Old Pochmann buffers: edge UR (B, m), corner ULB (A, E, R).
const buffers: Record<PieceType, string> = { edge: "BM", corner: "AER" };

export const lettersFor = (type: PieceType) =>
  [...ALL].filter((l) => !buffers[type].includes(l));

/** Every ordered letter pair that can show up in a chain, as uppercase "XY". */
export const pairsFor = (type: PieceType): string[] => {
  const letters = lettersFor(type);
  return letters.flatMap((a) => letters.filter((b) => b !== a).map((b) => a + b));
};

export const formatWordList = (words: Words) =>
  Object.keys(words)
    .sort()
    .filter((pair) => words[pair])
    .map((pair) => `${pair}: ${words[pair]}`)
    .join("\n");

/** Parses "XY: word" lines; ignores anything else. */
export const parseWordList = (text: string): Words =>
  Object.fromEntries(
    text
      .split("\n")
      .map((line) => line.match(/^\s*([a-x]{2})\s*:\s*(.+?)\s*$/i))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map((m) => [m[1].toUpperCase(), m[2]]),
  );
