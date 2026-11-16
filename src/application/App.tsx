import { Menu } from "@/components/Menu";

export const App = () => {
  return (
    <Menu
      menuEntries={[
        { path: "/edge-memory", name: "Cube edge memory" },
        { path: "/corner-memory", name: "Cube corner memory" },
      ]}
    />
  );
};
