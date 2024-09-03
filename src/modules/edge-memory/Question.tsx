import { Button } from "@/components/Button";
import { Edge } from "@/components/Edge";
import { colorNameMap, CubeColor, edges } from "@/support/edges";

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
    <div>
      <div className="flex justify-center">
        <Edge main={main} sub={sub} />
      </div>
      <p className="text-center">
        {colorNameMap[main]} - {colorNameMap[sub]}
      </p>
      <ul className="flex justify-center flex-wrap">
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
    </div>
  );
};
