import { useState } from "react";
import { NavLink } from "react-router-dom";

import { formatWordList, lettersFor, pairsFor, parseWordList } from "@/support/pairs";
import { PieceType } from "@/support/stickers";
import { useWords } from "@/support/words";

const toggleClass = (active: boolean) =>
  `px-3 py-1 rounded-md border-2 border-black ${active ? "bg-green-500" : "bg-slate-200"}`;

const sets: [PieceType, string][] = [
  ["edge", "Zijdes"],
  ["corner", "Hoeken"],
];

export const Component: React.FC = () => {
  const [words, saveWords] = useWords();
  const [set, setSet] = useState<PieceType>("edge");
  const [first, setFirst] = useState("A");
  const [importText, setImportText] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const pairs = pairsFor(set);
  const letters = lettersFor(set);
  const letter = letters.includes(first) ? first : letters[0];
  const shown = pairs.filter((p) => p[0] === letter);
  const filled = (prefix: string) =>
    pairs.filter((p) => p.startsWith(prefix) && words[p]).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatWordList(words));
      setMessage("Lijst gekopieerd. Bewaar hem in je notities.");
    } catch {
      setMessage("Kopiëren lukte niet.");
    }
  };

  return (
    <div className="py-6 px-4 flex flex-col items-center gap-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Woorden</h1>
      <p className="text-sm text-center">
        Vastgelopen? Denk aan initialen van een persoon (BM = Bob Marley), een
        merk, of een woord dat met die klanken begint (BM = BooM). Hoe gekker
        het beeld, hoe beter het blijft hangen.
      </p>
      <div className="flex gap-2">
        {sets.map(([value, label]) => (
          <button key={value} className={toggleClass(set === value)} onClick={() => setSet(value)}>
            {label} ({pairsFor(value).filter((p) => words[p]).length}/{pairsFor(value).length})
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setFirst(l)}
            className={`w-10 py-1 rounded-md border-2 border-black text-center ${
              l === letter ? "bg-green-500" : filled(l) === letters.length - 1 ? "bg-green-200" : "bg-slate-200"
            }`}
          >
            {l}
            <span className="block text-[10px]">
              {filled(l)}/{letters.length - 1}
            </span>
          </button>
        ))}
      </div>
      <ul className="w-full flex flex-col gap-1">
        {shown.map((pair) => (
          <li key={pair} className="flex items-center gap-3">
            <span className="w-10 font-mono font-bold text-xl">{pair}</span>
            <input
              value={words[pair] ?? ""}
              onChange={(e) => saveWords({ ...words, [pair]: e.target.value })}
              className="flex-1 px-2 py-1 rounded-md border-2 border-black"
              placeholder="woord of beeld"
            />
          </li>
        ))}
      </ul>
      <NavLink to="/words/drill" className="px-4 py-2 rounded-md border-2 border-black bg-green-500 text-xl">
        Woorden oefenen
      </NavLink>
      <div className="flex gap-2">
        <button className={toggleClass(false)} onClick={copy}>
          Kopieer lijst
        </button>
        <button className={toggleClass(false)} onClick={() => setImportText("")}>
          Lijst plakken
        </button>
      </div>
      {message && <p className="text-sm">{message}</p>}
      {importText !== null && (
        <div className="w-full flex flex-col gap-2">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            className="w-full p-2 rounded-md border-2 border-black font-mono"
            placeholder={"AC: Ace\nAD: Adidas"}
          />
          <button
            className={toggleClass(true)}
            onClick={() => {
              const imported = parseWordList(importText);
              saveWords({ ...words, ...imported });
              setMessage(`${Object.keys(imported).length} woorden toegevoegd.`);
              setImportText(null);
            }}
          >
            Toevoegen
          </button>
        </div>
      )}
      <NavLink to="/" className="underline">
        Terug
      </NavLink>
    </div>
  );
};
