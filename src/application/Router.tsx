import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/letters",
    children: [
      { index: true, lazy: () => import("../modules/letters/Index") },
      { path: "learn", lazy: () => import("../modules/letters/Learn") },
      { path: "drill", lazy: () => import("../modules/letters/Drill") },
    ],
  },
], { basename: import.meta.env.BASE_URL });

export default router;
