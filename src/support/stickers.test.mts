import assert from "node:assert/strict";
import { test } from "node:test";
import { stickers } from "./stickers.ts";

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
