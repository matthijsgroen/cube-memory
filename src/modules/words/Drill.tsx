import { useState } from "react";
import { NavLink } from "react-router-dom";

import { pairsFor } from "@/support/pairs";
import { shuffle } from "@/support/shuffle";
import { PieceType } from "@/support/stickers";
import { useWords } from "@/support/words";

const ROUND_SIZE = 20;

const buttonClass = "px-4 py-2 rounded-md border-2 border-black bg-green-500 text-xl";

const sets: [PieceType, string][] = [
  ["edge", "Zijdes"],
  ["corner", "Hoeken"],
];

export const Component: React.FC = () => {
  const [words] = useWords();
  const [set, setSet] = useState<PieceType | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const start = (s: PieceType) => {
    const known = pairsFor(s).filter((p) => words[p]);
    shuffle(known);
    const round = known.slice(0, ROUND_SIZE);
    setSet(s);
    setQueue(round);
    setTotal(round.length);
    setMissed([]);
    setRevealed(false);
  };

  const grade = (correct: boolean) => {
    const [pair, ...rest] = queue;
    if (!correct && !missed.includes(pair)) setMissed(missed.concat(pair));
    setQueue(correct ? rest : rest.concat(pair));
    setRevealed(false);
  };

  if (set === null) {
    return (
      <div className="py-10 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Woorden oefenen</h1>
        {sets.map(([s, label]) => (
          <button key={s} className={`${buttonClass} w-48`} onClick={() => start(s)}>
            {label}
          </button>
        ))}
        <NavLink to="/words" className="underline">
          Terug
        </NavLink>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="py-10 px-4 flex flex-col items-center gap-4 text-center">
        <p className="text-xl">Je hebt nog geen woorden voor deze set.</p>
        <NavLink to="/words" className={buttonClass}>
          Woorden invullen
        </NavLink>
      </div>
    );
  }

  const pair = queue[0];
  if (!pair) {
    return (
      <div className="py-10 px-4 flex flex-col items-center gap-3 text-xl">
        <h1 className="text-3xl font-bold">Klaar!</h1>
        <p>
          In één keer goed: {total - missed.length}/{total}
        </p>
        {missed.length > 0 && (
          <ul className="text-base">
            {missed.map((p) => (
              <li key={p}>
                <span className="font-mono font-bold">{p}</span>: {words[p]}
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-3 mt-4">
          <button className={buttonClass} onClick={() => start(set)}>
            Opnieuw
          </button>
          <button className={buttonClass} onClick={() => setSet(null)}>
            Andere set
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 flex flex-col items-center gap-6">
      <p className="text-lg">
        {total - queue.length + 1} / {total}
        {missed.length > 0 && ` · ${missed.length} fout`}
      </p>
      <p className="font-mono font-bold text-6xl">{pair}</p>
      {revealed ? (
        <>
          <p className="text-3xl">{words[pair]}</p>
          <div className="flex gap-3">
            <button className={buttonClass} onClick={() => grade(true)}>
              Goed
            </button>
            <button className={`${buttonClass} !bg-red-400`} onClick={() => grade(false)}>
              Fout
            </button>
          </div>
        </>
      ) : (
        <button className={buttonClass} onClick={() => setRevealed(true)}>
          Toon woord
        </button>
      )}
      <button className="underline" onClick={() => setSet(null)}>
        Stoppen
      </button>
    </div>
  );
};
