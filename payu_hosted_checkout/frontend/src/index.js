import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Success from "./components/Success";
import Failure from "./components/Failure";
import Main from "./Outlet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/failure",
        element: <Failure />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
