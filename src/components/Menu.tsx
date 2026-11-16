import { NavLink } from "react-router-dom";

import styles from "./menu.module.css";

export type MenuEntry = {
  name: string;
  path: string;
};

export type Props = {
  menuEntries: MenuEntry[];
};

export const Menu: React.FC<Props> = ({ menuEntries }) => (
  <ol className={styles.menu}>
    {menuEntries.map((e) => (
      <li key={e.path}>
        <NavLink to={e.path}>{e.name}</NavLink>
      </li>
    ))}
  </ol>
);
