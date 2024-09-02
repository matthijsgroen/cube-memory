import { NavLink } from "react-router-dom";

export const App = () => {
  return (
    <ol className="text-2xl text-center h-1/2 justify-center flex flex-col gap-4">
      <li>
        <NavLink to="/edge-memory">Cube edge memory</NavLink>
      </li>
      <li>Cube corner memory</li>
    </ol>
  );
};
