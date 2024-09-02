import { Button } from "../../components/Button";
import { colorMap, CubeColor, edges } from "./dataset";

export type Props = {
  correctAnswer: string;
  answers: string[];
  onRespond?: (response: {
    time: number;
    answer: string;
    correct: boolean;
  }) => void;
};

export const Question: React.FC<Props> = ({
  correctAnswer,
  answers,
  onRespond,
}) => {
  const [main, sub] = edges[correctAnswer] as unknown as [CubeColor, CubeColor];
  const start = Date.now() * 1;

  return (
    <>
      <p>
        {colorMap[main]} - {colorMap[sub]}
      </p>
      <ul>
        {answers.map((a) => (
          <li key={a}>
            <Button
              onClick={() => {
                onRespond?.({
                  time: Date.now() - start,
                  answer: a,
                  correct: a === correctAnswer,
                });
              }}
            >
              {a.toUpperCase()}
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};
