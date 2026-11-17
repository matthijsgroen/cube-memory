import assert from "node:assert/strict";
import { test } from "node:test";

import { applyMoves, memo, scramble, solved } from "./cube.ts";
import { stickers } from "./stickers.ts";

const idx = (letter: string) => stickers.findIndex((s) => s.letter === letter);

test("solved cube has empty chains", () => {
  assert.deepEqual(memo(solved(), "edge").letters, []);
  assert.deepEqual(memo(solved(), "corner").letters, []);
});

test("four U turns return to solved", () => {
  assert.deepEqual(applyMoves(solved(), ["U", "U", "U", "U"]), solved());
  assert.deepEqual(applyMoves(solved(), ["R", "R'"]), solved());
});

test("U turn chains", () => {
  const state = applyMoves(solved(), ["U"]);
  assert.deepEqual(memo(state, "edge").letters, ["a", "d", "c"]);
  assert.deepEqual(memo(state, "corner").letters, ["D", "C", "B"]);
});

test("two flipped edges in place: cycle breaks on first free letter", () => {
  // A single flipped edge is impossible on a real cube, so flip two: UF and UL.
  const state = solved();
  [state[idx("c")], state[idx("i")]] = [state[idx("i")], state[idx("c")]];
  [state[idx("d")], state[idx("e")]] = [state[idx("e")], state[idx("d")]];
  const result = memo(state, "edge");
  assert.deepEqual(result.letters, ["c", "i", "d", "e"]);
  assert.deepEqual(result.breaks, [0, 2]);
});

test("random scrambles: chains terminate and parities agree", () => {
  for (let n = 0; n < 200; n++) {
    const { state } = scramble();
    const edges = memo(state, "edge").letters;
    const corners = memo(state, "corner").letters;
    assert.equal(edges.length % 2, corners.length % 2);
    assert.ok(!edges.some((l) => "bm".includes(l)), "no edge buffer letters");
    assert.ok(!corners.some((l) => "AER".includes(l)), "no corner buffer letters");
  }
});
