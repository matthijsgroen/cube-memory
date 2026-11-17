import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { CubeNet } from "@/components/CubeNet";
import { Piece } from "@/components/Piece";
import { answerCard, Card, DeckOptions, newDeck } from "@/support/deck";
import {
  Face,
  faceColor,
  faceName,
  faceRange,
  faces,
  inFaceRange,
  PieceType,
  Sticker,
  stickers,
} from "@/support/stickers";

type Mode = PieceType | "mixed";
type Level = "range" | "exact" | "piece";
// Level 3 practises one top colour at a time (4 or 8 stickers), or everything.
type Group = Face | "all";

const levels: [Level, string][] = [
  ["range", "1 · Reeks"],
  ["exact", "2 · Op de kubus"],
  ["piece", "3 · Los blokje"],
];

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

// Small set: every sticker right 3× in a row, a miss returns after 2 others.
// Full set: one pass, a miss goes to the back.
const smallSet: DeckOptions = { target: 3, retryGap: 2 };
const fullSet: DeckOptions = { target: 1, retryGap: Infinity };

const setStickers = (mode: Mode, set: Group): Sticker[] =>
  stickers.filter(
    (s) => (mode === "mixed" || s.type === mode) && (set === "all" || s.face === set),
  );

const nextSet = (set: Group): Group =>
  set === "all" ? "all" : faces[(faces.indexOf(set) + 1) % faces.length];

export const Component: React.FC = () => {
  const [level, setLevel] = useState<Level>("range");
  const [set, setSet] = useState<Group>("U");
  const [mode, setMode] = useState<Mode | null>(null);
  const [queue, setQueue] = useState<Card<Sticker>[]>([]);
  const [total, setTotal] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState(false);
  const [input, setInput] = useState("");
  const askedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSet: Group = level === "piece" ? set : "all";
  const options = activeSet === "all" ? fullSet : smallSet;
  const current = queue[0]?.item;
  const learned = total - new Set(queue.map((c) => c.item.letter)).size;

  // Restart the clock and keyboard focus whenever a new sticker is asked.
  useEffect(() => {
    if (!current || feedback) return;
    askedAt.current = Date.now();
    inputRef.current?.focus();
  }, [current, feedback]);

  const start = (m: Mode, s: Group = activeSet) => {
    const q = newDeck(setStickers(m, s));
    if (level === "piece") setSet(s);
    setMode(m);
    setQueue(q);
    setTotal(q.length);
    setMissed([]);
    setTimes([]);
    setFeedback(false);
  };

  // `typed` is the inserted text of one input event: null for paste/delete,
  // so only a single typed letter counts as an answer.
  const answer = (typed: string | null) => {
    const char = typed ?? "";
    if (!/^[a-x]$/i.test(char) || feedback || !current) return;
    setTimes((t) => t.concat(Date.now() - askedAt.current));

    const correct =
      level === "range"
        ? inFaceRange(current, char)
        : char.toLowerCase() === current.letter.toLowerCase();
    if (correct) {
      setQueue((q) => answerCard(q, true, options));
      return;
    }
    setMissed((m) => (m.includes(current.letter) ? m : m.concat(current.letter)));
    setFeedback(true);
  };

  // After a wrong answer: show the letter, then put the sticker back in the
  // deck. Cleanup cancels it when the round is stopped mid-feedback.
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setQueue((q) => answerCard(q, false, options));
      setFeedback(false);
    }, FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [feedback, options]);

  if (mode === null) {
    return (
      <div className="py-10 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Wat wil je oefenen?</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-2 px-4">
          {levels.map(([l, label]) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1 rounded-md border-2 border-black ${
                level === l ? "bg-green-500" : "bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {level === "piece" && (
          <div className="flex flex-col items-center gap-2 mb-2 px-4">
            <p>Kleur bovenop</p>
            <div className="flex flex-wrap justify-center gap-2">
              {faces.map((f) => (
                <button
                  key={f}
                  onClick={() => setSet(f)}
                  className={`px-2 py-1 rounded-md border-2 text-black ${faceColor[f]} ${
                    set === f ? "border-black ring-2 ring-white" : "border-black/30"
                  }`}
                >
                  {faceRange(f)}
                </button>
              ))}
              <button
                onClick={() => setSet("all")}
                className={`px-2 py-1 rounded-md border-2 border-black ${
                  set === "all" ? "bg-green-500" : "bg-slate-200"
                }`}
              >
                Alles
              </button>
            </div>
            <p className="text-sm max-w-xs text-center">
              {set === "all"
                ? "Alle blokjes, één keer."
                : `Alleen ${faceName[set].toLowerCase()} bovenop: elk blokje ${smallSet.target}× achter elkaar goed.`}
            </p>
          </div>
        )}
        {modes.map(([m, label]) => (
          <button key={m} className={`${buttonClass} w-48`} onClick={() => start(m)}>
            {label}
          </button>
        ))}
        <NavLink to="/" className="underline">
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
          {activeSet !== "all" && (
            <button className={buttonClass} onClick={() => start(mode, nextSet(activeSet))}>
              Volgende set
            </button>
          )}
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
        {activeSet === "all"
          ? `${total - queue.length + 1} / ${total}`
          : `${faceName[activeSet]} · ${learned} / ${total} geleerd`}
        {missed.length > 0 && ` · ${missed.length} fout`}
      </p>
      {level === "piece" ? (
        <Piece sticker={current} letter={feedback ? current.letter : undefined} />
      ) : (
        <CubeNet show={feedback ? current.type : "none"} highlight={current} />
      )}
      <label className="flex flex-col items-center gap-2 text-xl">
        {level === "range" ? "Letter uit welke reeks?" : "Welke letter?"} (
        {current.type === "edge" ? "zijde" : "hoek"})
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            answer((e.nativeEvent as InputEvent).data);
            setInput("");
          }}
          // readOnly, not disabled: keeps focus so the phone keyboard stays open
          readOnly={feedback}
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="w-16 h-16 text-center text-3xl rounded-md border-2 border-black uppercase"
        />
      </label>
      {feedback && (
        <p className="text-xl font-bold text-red-200">
          {level === "range"
            ? `${faceName[current.face]} = ${faceRange(current.face)}`
            : `Het was ${current.letter.toUpperCase()}`}
        </p>
      )}
      <button
        className="underline"
        onClick={() => {
          setFeedback(false);
          setMode(null);
        }}
      >
        Stoppen
      </button>
    </div>
  );
};
