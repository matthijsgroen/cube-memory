import assert from "node:assert/strict";
import { test } from "node:test";

import { faceRange, inFaceRange, pieceView, stickers } from "./stickers.ts";

const find = (letter: string) => stickers.find((s) => s.letter === letter)!;

test("speffz sticker positions", () => {
  assert.equal(stickers.length, 48);
  // UFR corner
  assert.deepEqual(find("C"), { letter: "C", type: "corner", face: "U", row: 2, col: 2 });
  assert.deepEqual(find("Q"), { letter: "Q", type: "corner", face: "B", row: 0, col: 0 });
  // LF edge, orange-green
  assert.deepEqual(find("f"), { letter: "f", type: "edge", face: "L", row: 1, col: 2 });
  assert.deepEqual(find("x"), { letter: "x", type: "edge", face: "D", row: 1, col: 0 });
});

test("face letter ranges", () => {
  assert.equal(faceRange("F"), "I–L");
  assert.equal(faceRange("D"), "U–X");
  assert.equal(inFaceRange(find("k"), "i"), true); // green edge, any green letter
  assert.equal(inFaceRange(find("K"), "L"), true);
  assert.equal(inFaceRange(find("K"), "m"), false);
  assert.equal(inFaceRange(find("a"), "D"), true);
  assert.equal(inFaceRange(find("a"), "e"), false);
});

test("piece view: asked sticker on top, neighbours as sides", () => {
  // UFR corner seen with white on top: green left, red right
  assert.deepEqual(pieceView(find("C")), { top: "U", sides: ["F", "R"] });
  // Same corner, asked from the green sticker (J): red left, white right
  assert.deepEqual(pieceView(find("J")), { top: "F", sides: ["R", "U"] });
  // UBR corner (Q on blue)
  assert.deepEqual(pieceView(find("Q")).sides.sort(), ["R", "U"]);
  // Edges have one side
  assert.deepEqual(pieceView(find("c")), { top: "U", sides: ["F"] });
  assert.deepEqual(pieceView(find("f")), { top: "L", sides: ["F"] });
  assert.deepEqual(pieceView(find("x")), { top: "D", sides: ["L"] });
});

test("every sticker has a complete piece", () => {
  for (const s of stickers) {
    const view = pieceView(s);
    assert.equal(view.sides.length, s.type === "edge" ? 1 : 2, s.letter);
    // No piece has two stickers of the same or opposite colour
    const pairs = [["U", "D"], ["L", "R"], ["F", "B"]];
    const faces = [view.top, ...view.sides];
    for (const [a, b] of pairs) assert.ok(!(faces.includes(a) && faces.includes(b)), s.letter);
  }
});
