import { useState } from "react";
import { pick } from "../../helpers/pick";
import { shuffle } from "../../helpers/shuffle";
import { EdgePiece, edges } from "./dataset";
import { Question } from "./Question";

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
  const amountAnswers = 5;
  const [location, setLocation] = useState(() => pick(locations));
  const [answers, setAnswers] = useState(() =>
    createAnswerSet(location, amountAnswers)
  );

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Edge memory</h1>
      <Question
        correctAnswer={location}
        answers={answers}
        onRespond={(data) => {
          console.log(data);

          const newLocation = pick(locations);
          setLocation(newLocation);
          setAnswers(createAnswerSet(newLocation, amountAnswers));
        }}
      />
    </div>
  );
};
