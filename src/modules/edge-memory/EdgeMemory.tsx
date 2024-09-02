import { colorMap, CubeColor, EdgePiece, edges } from "./dataset";

const elements: [location: string, piece: EdgePiece][] = Object.entries(edges);

export const Component = () => {
  const [location, piece] =
    elements[Math.floor(Math.random() * elements.length)];

  const [mainColor, subColor] = piece as unknown as [CubeColor, CubeColor];

  const answers = [location];

  return (
    <div>
      <h1>Edge memory</h1>
      <p>
        {colorMap[mainColor]} - {colorMap[subColor]}
      </p>
      <ul>
        {answers.map((a) => (
          <li key={a}>{a.toUpperCase()}</li>
        ))}
      </ul>
    </div>
  );
};
