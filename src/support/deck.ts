import { shuffle } from "./shuffle.ts";

export type Card<T> = { item: T; streak: number };

export type DeckOptions = {
  /** Correct answers in a row before a card leaves the deck. */
  target: number;
  /** Cards asked in between before a missed card returns. */
  retryGap: number;
};

export const newDeck = <T>(items: T[]): Card<T>[] => {
  const deck = items.map((item) => ({ item, streak: 0 }));
  shuffle(deck);
  return deck;
};

/**
 * Answers the first card. A card stays until it was right `target` times in a
 * row; a miss resets its streak and brings it back after `retryGap` others.
 * Never puts a card straight back in front when other cards are left.
 */
export const answerCard = <T>(
  deck: Card<T>[],
  correct: boolean,
  { target, retryGap }: DeckOptions,
  random = Math.random,
): Card<T>[] => {
  const [card, ...rest] = deck;
  if (!card) return deck;
  const streak = correct ? card.streak + 1 : 0;
  if (streak >= target) return rest;

  const min = Math.min(1, rest.length);
  const index = correct
    ? // spread the repeats: anywhere after at least one other card
      min + Math.floor(random() * (rest.length - min + 1))
    : Math.max(min, Math.min(retryGap, rest.length));
  return [...rest.slice(0, index), { ...card, streak }, ...rest.slice(index)];
};
