import { colorMap, CubeColor } from "@/support/edges";

export type Props = {
  main: CubeColor;
  sub: CubeColor;
};

export const Edge: React.FC<Props> = ({ main, sub }) => {
  return (
    <div className="flex align-bottom p-2 w-24 h-20">
      <div
        className={`skew-y-[20deg] mt-4 w-10 h-10 ${colorMap[main]} rounded-md border`}
      ></div>
      <div
        className={`skew-y-[-50deg] mt-2 w-6 h-10 ${colorMap[sub]} rounded-md border`}
      ></div>
    </div>
  );
};
