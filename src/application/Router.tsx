import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/edge-memory",
    children: [
      {
        index: true,
        lazy: () => import("../modules/edge-memory/games/Index"),
      },
      {
        path: "practice",
        lazy: () => import("../modules/edge-memory/games/Practice"),
      },
      {
        path: "challenge",
        lazy: () => import("../modules/edge-memory/games/Challenge"),
      },
    ],
  },
]);

export default router;
