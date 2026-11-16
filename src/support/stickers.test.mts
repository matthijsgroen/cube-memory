import assert from "node:assert/strict";
import { test } from "node:test";

import { faceRange, inFaceRange, stickers } from "./stickers.ts";

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
