import { useState } from "react";
import { pick } from "@/support/pick";
import { shuffle } from "@/support/shuffle";
import { Question } from "./Question";
import { EdgePiece, edges } from "@/support/edges";
import { NavLink } from "react-router-dom";
import { Menu } from "@/components/Menu";

const elements: [location: string, piece: EdgePiece][] = Object.entries(edges);
const locations: string[] = elements.map((e) => e[0]);

const createAnswerSet = (correctAnswer: string, amount: number): string[] => {
  const wrongLocations = locations.filter((e) => e !== correctAnswer);
  const answers = [correctAnswer];

  while (answers.length < amount) {
    const item = pick(wrongLocations);
    if (answers.every((e) => e !== item)) {
      answers.push(item);
    }
  }

  shuffle(answers);
  return answers;
};

export type Props = {
  amountAnswers?: number;
  amountQuestions?: number;
  timePerQuestion?: number;
};

export type Result = {
  asked: string;
  returned: string | null;
  responseTimeMs: number;
  timeLimit: number;
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 1,
});

export const EdgeMemory: React.FC<Props> = ({
  amountAnswers = 3,
  amountQuestions = 12,
  timePerQuestion = Infinity,
}) => {
  const [location, setLocation] = useState(() => pick(locations));
  const [answers, setAnswers] = useState(() =>
    createAnswerSet(location, amountAnswers)
  );

  const [results, setResults] = useState<Result[]>([]);

  const amountPlayed = results.length;
  const amountCorrect = results.reduce((result, value) => {
    return result + (value.asked === value.returned ? 1 : 0);
  }, 0);
  const previous = results.at(-1);
  const isPreviousCorrect =
    previous === undefined ? null : previous.asked === previous.returned;

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center">Edge memory</h1>
      <div className="text-center text-white font-bold">
        {isPreviousCorrect === true && (
          <p className="animate-result" key={amountPlayed}>
            ✅ Correct!
          </p>
        )}
        {isPreviousCorrect === false && (
          <p className="animate-result" key={amountPlayed}>
            ❌ Wrong
          </p>
        )}
      </div>
      {amountPlayed < amountQuestions && (
        <Question
          correctAnswer={location}
          answers={answers}
          onRespond={(data) => {
            setResults((results) =>
              results.concat({
                asked: location,
                returned: data.answer,
                responseTimeMs: data.time,
                timeLimit: timePerQuestion,
              })
            );

            const newLocation = pick(locations);
            setLocation(newLocation);
            setAnswers(createAnswerSet(newLocation, amountAnswers));
          }}
        />
      )}
      {amountPlayed >= amountQuestions && (
        <div className="w-1/3 mx-auto">
          <h1 className="text-3xl">Well done!</h1>
          <p className="text-xl my-3">
            Result: {amountCorrect}/{amountPlayed}
          </p>
          <p className="text-xl my-3">
            Average respond time:{" "}
            {numberFormatter.format(
              results.reduce((r, v) => r + v.responseTimeMs, 0) / amountPlayed
            )}
            ms
          </p>
          <Menu
            menuEntries={[
              { name: "Back", path: "../" },
              { name: "Play again", path: "." },
            ]}
          />
        </div>
      )}
    </div>
  );
};
