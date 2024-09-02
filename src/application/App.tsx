import { NavLink } from "react-router-dom";

export const App = () => {
  return (
    <ol>
      <li>
        <NavLink to="/edge-memory">Cube side memory</NavLink>
      </li>
      <li>Cube edge memory</li>
    </ol>
  );
};
