import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./application/Router";
import { enableAutoUpdate } from "./support/autoUpdate";

enableAutoUpdate();

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
