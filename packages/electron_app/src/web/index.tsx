import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";

import Home from "./pages/home";
import Edit from "./pages/edit";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "edit/:todoId",
    element: <Edit />,
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  // <StrictMode>
  <RouterProvider router={router} />,
  // </StrictMode>,
);
