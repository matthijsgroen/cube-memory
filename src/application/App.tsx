import { NavLink } from "react-router-dom";
import styles from "./menu.module.css";

export const App = () => {
  return (
    <ol className={styles.menu}>
      <li>
        <NavLink to="/edge-memory">Cube edge memory</NavLink>
      </li>
      <li>Cube corner memory</li>
    </ol>
  );
};
