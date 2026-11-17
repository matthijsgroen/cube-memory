import { Fragment, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { CubeNet } from "@/components/CubeNet";
import { memo, scramble, State } from "@/support/cube";
import { PieceType } from "@/support/stickers";
import { useWords } from "@/support/words";

type Phase = "pick" | "build" | "memo" | "recall" | "result";

const buttonClass = "px-4 py-2 rounded-md border-2 border-black bg-green-500 text-xl";
const toggleClass = (active: boolean) =>
  `px-3 py-1 rounded-md border-2 border-black ${active ? "bg-green-500" : "bg-slate-200"}`;

const sets: [PieceType, string][] = [
  ["edge", "Zijdes"],
  ["corner", "Hoeken"],
];

const toPairs = (letters: string[]) => {
  const pairs: string[] = [];
  for (let i = 0; i < letters.length; i += 2) {
    pairs.push(letters.slice(i, i + 2).join("").toUpperCase());
  }
  return pairs;
};

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

export const Component: React.FC = () => {
  const [words] = useWords();
  const [type, setType] = useState<PieceType>("edge");
  const [phase, setPhase] = useState<Phase>("pick");
  const [cube, setCube] = useState<{ moves: string[]; state: State } | null>(null);
  const [chain, setChain] = useState<{ letters: string[]; breaks: number[] }>({
    letters: [],
    breaks: [],
  });
  const [built, setBuilt] = useState(0);
  const [buildMistakes, setBuildMistakes] = useState(0);
  const [hint, setHint] = useState("");
  const [memoStart, setMemoStart] = useState(0);
  const [memoMs, setMemoMs] = useState(0);
  const [recall, setRecall] = useState("");
  const [withBuild, setWithBuild] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [phase]);

  const start = (build: boolean) => {
    setWithBuild(build);
    const next = scramble();
    const result = memo(next.state, type);
    setCube(next);
    setChain(result);
    setBuilt(0);
    setBuildMistakes(0);
    setHint("");
    setRecall("");
    if (build && result.letters.length > 0) {
      setPhase("build");
    } else {
      setMemoStart(Date.now());
      setPhase("memo");
    }
  };

  const typeLetter = (char: string | null) => {
    if (!char || !/^[a-x]$/i.test(char) || built >= chain.letters.length) return;
    const expected = chain.letters[built];
    const isBreak = chain.breaks.includes(built);
    if (char.toLowerCase() === expected.toLowerCase()) {
      setHint("");
    } else {
      setBuildMistakes((m) => m + 1);
      setHint(
        `Het was ${expected.toUpperCase()}` +
          (isBreak ? ": cycle break, eerste vrije letter in het alfabet" : ""),
      );
    }
    setBuilt(built + 1);
  };

  const chainView = (count: number) => (
    <p className="font-mono text-2xl tracking-wider text-center">
      {chain.letters.slice(0, count).map((l, i) => (
        <Fragment key={i}>
          <span className={chain.breaks.includes(i) ? "underline decoration-4" : ""}>
            {l.toUpperCase()}
          </span>
          {i % 2 === 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );

  const parity = chain.letters.length % 2 === 1;

  if (phase === "pick" || !cube) {
    return (
      <div className="py-10 px-4 flex flex-col items-center gap-4 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold">Ketens</h1>
        <div className="flex gap-2">
          {sets.map(([value, label]) => (
            <button key={value} className={toggleClass(type === value)} onClick={() => setType(value)}>
              {label}
            </button>
          ))}
        </div>
        <button className={`${buttonClass} w-64`} onClick={() => start(true)}>
          Keten maken + onthouden
        </button>
        <button className={`${buttonClass} w-64`} onClick={() => start(false)}>
          Alleen onthouden
        </button>
        <p className="text-sm">
          Old Pochmann: buffer {type === "edge" ? "B (wit-rood)" : "A (wit-oranje-blauw)"}. Bij
          een cycle break kies je de eerste vrije letter in het alfabet.
        </p>
        <NavLink to="/" className="underline">
          Terug
        </NavLink>
      </div>
    );
  }

  if (phase === "build") {
    const done = built >= chain.letters.length;
    return (
      <div className="py-6 flex flex-col items-center gap-4">
        <p className="text-sm px-4 text-center font-mono">{cube.moves.join(" ")}</p>
        <CubeNet show="none" state={cube.state} />
        {chainView(built)}
        {!done && (
          <label className="flex flex-col items-center gap-2 text-xl">
            Volgende letter?
            <input
              ref={inputRef}
              value=""
              onChange={(e) => typeLetter((e.nativeEvent as InputEvent).data)}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="w-16 h-16 text-center text-3xl rounded-md border-2 border-black uppercase"
            />
          </label>
        )}
        {hint && <p className="text-lg font-bold text-red-200 px-4 text-center">{hint}</p>}
        {done && (
          <>
            <p className="text-xl">
              Keten klaar · {buildMistakes} fout · {parity ? "parity!" : "geen parity"}
            </p>
            <button
              className={buttonClass}
              onClick={() => {
                setMemoStart(Date.now());
                setPhase("memo");
              }}
            >
              Nu onthouden
            </button>
          </>
        )}
        <button className="underline" onClick={() => setPhase("pick")}>
          Stoppen
        </button>
      </div>
    );
  }

  if (phase === "memo") {
    return (
      <div className="py-6 px-4 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Onthoud de keten</h1>
        {chain.letters.length === 0 ? (
          <p>Deze kant is al opgelost, niets te onthouden.</p>
        ) : (
          <ol className="flex flex-wrap justify-center gap-3">
            {toPairs(chain.letters).map((pair, i) => (
              <li key={i} className="flex flex-col items-center min-w-16">
                <span className="font-mono font-bold text-3xl">{pair}</span>
                <span className="text-sm">{words[pair] ?? "—"}</span>
              </li>
            ))}
          </ol>
        )}
        {parity && <p>Oneven aantal letters: parity.</p>}
        <button
          className={buttonClass}
          onClick={() => {
            setMemoMs(Date.now() - memoStart);
            setPhase("recall");
          }}
        >
          Verbergen en terugtypen
        </button>
      </div>
    );
  }

  const expected = chain.letters.map((l) => l.toUpperCase());
  const typed = recall.toUpperCase().replace(/[^A-X]/g, "").split("");

  if (phase === "recall") {
    return (
      <div className="py-10 px-4 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Typ de keten</h1>
        <input
          ref={inputRef}
          value={recall}
          onChange={(e) => setRecall(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setPhase("result")}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          className="w-full max-w-md px-3 py-2 text-2xl font-mono rounded-md border-2 border-black uppercase"
          placeholder="bijv. CK SD UJ"
        />
        <button className={buttonClass} onClick={() => setPhase("result")}>
          Controleer
        </button>
      </div>
    );
  }

  const correct = expected.filter((l, i) => typed[i] === l).length;
  return (
    <div className="py-10 px-4 flex flex-col items-center gap-4 text-xl">
      <h1 className="text-3xl font-bold">
        {correct === expected.length && typed.length === expected.length ? "Perfect!" : "Resultaat"}
      </h1>
      <p>
        {correct}/{expected.length} letters goed · onthouden in {seconds(memoMs)}
      </p>
      <p className="font-mono text-2xl text-center">
        {expected.map((l, i) => (
          <Fragment key={i}>
            <span className={typed[i] === l ? "text-green-200" : "text-red-200 underline"}>
              {l}
            </span>
            {i % 2 === 1 ? " " : ""}
          </Fragment>
        ))}
      </p>
      {typed.length > 0 && (
        <p className="font-mono text-base">jij: {toPairs(typed).join(" ")}</p>
      )}
      <div className="flex gap-3 mt-4">
        <button className={buttonClass} onClick={() => start(withBuild)}>
          Nog een
        </button>
        <button className={buttonClass} onClick={() => setPhase("pick")}>
          Menu
        </button>
      </div>
    </div>
  );
};
