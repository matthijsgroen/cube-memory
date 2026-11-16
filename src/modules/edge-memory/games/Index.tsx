import { Menu } from "@/components/Menu";

export const Component = () => {
  return (
    <Menu
      menuEntries={[
        { path: "./practice", name: "Practice mode" },
        { path: "./challenge", name: "12 item challenge" },
        { path: "../", name: "Back" },
      ]}
    />
  );
};
