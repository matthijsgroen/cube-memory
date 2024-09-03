export type CubeColor = "W" | "Y" | "B" | "O" | "R" | "G";

export type EdgePiece = `${CubeColor}${CubeColor}`;

export const colorNameMap: Record<CubeColor, string> = {
  W: "White",
  Y: "Yellow",
  B: "Blue",
  O: "Orange",
  R: "Red",
  G: "Green",
};

export const colorMap: Record<CubeColor, string> = {
  W: "bg-slate-100",
  Y: "bg-yellow-300",
  B: "bg-blue-500",
  O: "bg-orange-500",
  R: "bg-red-500",
  G: "bg-green-500",
};

export const edges: Record<string, EdgePiece> = {
  // T
  a: "WB",
  b: "WR",
  c: "WG",
  d: "WO",
  // L
  e: "OW",
  f: "OG",
  g: "OY",
  h: "OB",
  // F
  i: "GW",
  j: "GR",
  k: "GY",
  l: "GO",
  // R
  m: "RW",
  n: "RB",
  o: "RY",
  p: "RG",
  // B
  q: "BW",
  r: "BO",
  s: "BY",
  t: "BR",
  // D
  u: "YG",
  v: "YR",
  w: "YB",
  x: "YO",
};
