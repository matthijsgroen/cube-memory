export const pick = <T>(elements: T[]): T =>
  elements[Math.floor(Math.random() * elements.length)];
