import assert from "node:assert/strict";
import { test } from "node:test";

import { formatWordList, pairsFor, parseWordList } from "./pairs.ts";

test("pairs skip Old Pochmann buffer stickers", () => {
  const edges = pairsFor("edge");
  assert.equal(edges.length, 22 * 21);
  assert.ok(edges.includes("AC"));
  assert.ok(!edges.some((p) => p.includes("B") || p.includes("M")));
  assert.ok(!edges.includes("AA"));
  // flipped edge in place can produce a same-piece pair, keep it
  assert.ok(edges.includes("CI"));

  const corners = pairsFor("corner");
  assert.equal(corners.length, 21 * 20);
  assert.ok(!corners.some((p) => /[AER]/.test(p)));
  assert.ok(corners.includes("BM"));
});

test("word list round trip", () => {
  const words = { AC: "Ace", BM: "BMW" };
  const text = formatWordList(words);
  assert.equal(text, "AC: Ace\nBM: BMW");
  assert.deepEqual(parseWordList(text), words);
  assert.deepEqual(parseWordList("ac:  aap \n\nnonsense\nWX: x: y"), { AC: "aap", WX: "x: y" });
});
