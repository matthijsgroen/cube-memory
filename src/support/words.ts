import { useState } from "react";

import type { Words } from "./pairs";

const KEY = "cube-memory:words";

const load = (): Words => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};

/** Letter pair words, stored on this device. */
export const useWords = () => {
  const [words, setWords] = useState<Words>(load);
  const save = (next: Words) => {
    setWords(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      // Ask the browser not to evict the list when storage runs low.
      navigator.storage?.persist?.();
    } catch {
      // Storage blocked: words live until the page closes; backup copy still works.
    }
  };
  return [words, save] as const;
};
