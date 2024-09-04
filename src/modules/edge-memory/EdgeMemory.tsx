import { useState } from "react";
import { pick } from "@/support/pick";
import { shuffle } from "@/support/shuffle";
import { Question } from "./Question";
import { EdgePiece, edges } from "@/support/edges";

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

export const Component = () => {
  const amountAnswers = 3;
  const [location, setLocation] = useState(() => pick(locations));
  const [answers, setAnswers] = useState(() =>
    createAnswerSet(location, amountAnswers)
  );

  const [amountPlayed, setAmountPlayed] = useState(0);
  const [amountCorrect, setAmountCorrect] = useState(0);
  const [isPreviousCorrect, setPreviousCorrect] = useState<boolean | null>(
    null
  );

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center">Edge memory</h1>
      <p>Played: {amountPlayed}</p>
      <p>Correct: {amountCorrect}</p>
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
      <Question
        correctAnswer={location}
        answers={answers}
        onRespond={(data) => {
          setAmountPlayed((a) => a + 1);
          setPreviousCorrect(data.correct);
          if (data.correct) {
            setAmountCorrect((b) => b + 1);
          }

          const newLocation = pick(locations);
          setLocation(newLocation);
          setAnswers(createAnswerSet(newLocation, amountAnswers));
        }}
      />
    </div>
  );
};
