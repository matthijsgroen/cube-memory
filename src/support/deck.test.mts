import assert from "node:assert/strict";
import { test } from "node:test";

import { answerCard, type Card, newDeck } from "./deck.ts";

const deck = (...items: string[]): Card<string>[] =>
  items.map((item) => ({ item, streak: 0 }));
const order = (d: Card<string>[]) => d.map((c) => c.item).join("");

test("new deck holds every item once", () => {
  assert.deepEqual(newDeck(["a", "b", "c"]).map((c) => c.item).sort(), ["a", "b", "c"]);
});

test("a card leaves after `target` correct answers in a row", () => {
  const opts = { target: 3, retryGap: 2 };
  let d = deck("a");
  d = answerCard(d, true, opts);
  d = answerCard(d, true, opts);
  assert.equal(d[0].streak, 2);
  d = answerCard(d, false, opts);
  assert.equal(d[0].streak, 0);
  d = answerCard(d, true, opts);
  d = answerCard(d, true, opts);
  d = answerCard(d, true, opts);
  assert.equal(d.length, 0);
});

test("a missed card returns after `retryGap` other cards", () => {
  const opts = { target: 3, retryGap: 2 };
  assert.equal(order(answerCard(deck("a", "b", "c", "d"), false, opts)), "bcad");
  assert.equal(order(answerCard(deck("a", "b"), false, opts)), "ba");
  // retryGap past the end: back of the deck
  assert.equal(order(answerCard(deck("a", "b", "c"), false, { target: 1, retryGap: Infinity })), "bca");
});

test("a correct repeat never comes straight back", () => {
  const opts = { target: 3, retryGap: 2 };
  assert.equal(order(answerCard(deck("a", "b", "c"), true, opts, () => 0)), "bac");
  assert.equal(order(answerCard(deck("a", "b", "c"), true, opts, () => 0.99)), "bca");
});

test("target 1 is a single pass", () => {
  assert.equal(order(answerCard(deck("a", "b"), true, { target: 1, retryGap: 2 })), "b");
});
