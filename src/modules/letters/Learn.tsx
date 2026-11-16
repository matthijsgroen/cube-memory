import { useState } from "react";
import { NavLink } from "react-router-dom";

import { CubeNet, Props as NetProps } from "@/components/CubeNet";

const options: [NetProps["show"], string][] = [
  ["edge", "Zijdes"],
  ["corner", "Hoeken"],
  ["both", "Beide"],
];

export const Component: React.FC = () => {
  const [show, setShow] = useState<NetProps["show"]>("edge");
  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex justify-center gap-2">
        {options.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setShow(value)}
            className={`px-3 py-1 rounded-md border-2 border-black ${
              show === value ? "bg-green-500" : "bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <CubeNet show={show} />
      <NavLink to=".." className="text-center underline">
        Terug
      </NavLink>
    </div>
  );
};
