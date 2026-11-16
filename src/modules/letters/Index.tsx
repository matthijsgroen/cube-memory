import { Menu } from "@/components/Menu";

export const Component = () => (
  <Menu
    menuEntries={[
      { path: "./learn", name: "Leren" },
      { path: "./drill", name: "Oefenen" },
      { path: "/", name: "Terug" },
    ]}
  />
);
