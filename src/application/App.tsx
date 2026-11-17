import { Menu } from "@/components/Menu";

export const App = () => (
  <div className="py-10 px-4 flex flex-col items-center gap-6">
    <h1 className="text-3xl font-bold">Cube Memory</h1>
    <p className="text-center max-w-sm">
      Train de Speffz-letters voor blind oplossen: eerst leren, dan oefenen, dan woorden voor letterparen.
    </p>
    <Menu
      menuEntries={[
        { path: "/letters/learn", name: "Leren" },
        { path: "/letters/drill", name: "Oefenen" },
        { path: "/words", name: "Woorden" },
      ]}
    />
  </div>
);
