import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { CubeNet } from "@/components/CubeNet";
import { shuffle } from "@/support/shuffle";
import { PieceType, Sticker, stickers } from "@/support/stickers";

type Mode = PieceType | "mixed";

const modes: [Mode, string][] = [
  ["edge", "Zijdes"],
  ["corner", "Hoeken"],
  ["mixed", "Gemengd"],
];

const FEEDBACK_MS = 1500;

const msFormatter = new Intl.NumberFormat("nl-NL", {
  maximumFractionDigits: 1,
});

const buttonClass =
  "px-4 py-2 rounded-md border-2 border-black bg-green-500 text-xl";

const newQueue = (mode: Mode): Sticker[] => {
  const queue = stickers.filter((s) => mode === "mixed" || s.type === mode);
  shuffle(queue);
  return queue;
};

export const Component: React.FC = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [queue, setQueue] = useState<Sticker[]>([]);
  const [total, setTotal] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState(false);
  const [input, setInput] = useState("");
  const askedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = queue[0];

  // Restart the clock and keyboard focus whenever a new sticker is asked.
  useEffect(() => {
    if (!current || feedback) return;
    askedAt.current = Date.now();
    inputRef.current?.focus();
  }, [current, feedback]);

  const start = (m: Mode) => {
    const q = newQueue(m);
    setMode(m);
    setQueue(q);
    setTotal(q.length);
    setMissed([]);
    setTimes([]);
  };

  const answer = (value: string) => {
    const char = value.slice(-1);
    if (!/^[a-x]$/i.test(char) || feedback || !current) return;
    setTimes((t) => t.concat(Date.now() - askedAt.current));

    if (char.toLowerCase() === current.letter.toLowerCase()) {
      setQueue((q) => q.slice(1));
      return;
    }
    setMissed((m) => (m.includes(current.letter) ? m : m.concat(current.letter)));
    setFeedback(true);
    setTimeout(() => {
      setQueue((q) => q.slice(1).concat(q[0]));
      setFeedback(false);
    }, FEEDBACK_MS);
  };

  if (mode === null) {
    return (
      <div className="py-10 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Wat wil je oefenen?</h1>
        {modes.map(([m, label]) => (
          <button key={m} className={`${buttonClass} w-48`} onClick={() => start(m)}>
            {label}
          </button>
        ))}
        <NavLink to=".." className="underline">
          Terug
        </NavLink>
      </div>
    );
  }

  if (!current) {
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    return (
      <div className="py-10 flex flex-col items-center gap-3 text-xl px-4">
        <h1 className="text-3xl font-bold">Klaar!</h1>
        <p>
          In één keer goed: {total - missed.length}/{total}
        </p>
        <p>Gemiddelde tijd: {msFormatter.format(average)} ms</p>
        {missed.length > 0 && <p>Gemist: {missed.join(" ")}</p>}
        <div className="flex gap-3 mt-4">
          <button className={buttonClass} onClick={() => start(mode)}>
            Opnieuw
          </button>
          <button className={buttonClass} onClick={() => setMode(null)}>
            Andere set
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col items-center gap-4">
      <p className="text-lg">
        {total - queue.length + 1} / {total}
        {missed.length > 0 && ` · ${missed.length} fout`}
      </p>
      <CubeNet show={feedback ? current.type : "none"} highlight={current} />
      <label className="flex flex-col items-center gap-2 text-xl">
        Welke letter? ({current.type === "edge" ? "zijde" : "hoek"})
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            answer(e.target.value);
            setInput("");
          }}
          disabled={feedback}
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="w-16 h-16 text-center text-3xl rounded-md border-2 border-black uppercase"
        />
      </label>
      {feedback && (
        <p className="text-xl font-bold text-red-200">
          Het was {current.letter.toUpperCase()}
        </p>
      )}
      <button className="underline" onClick={() => setMode(null)}>
        Stoppen
      </button>
    </div>
  );
};
