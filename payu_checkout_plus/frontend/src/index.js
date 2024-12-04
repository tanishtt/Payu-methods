import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Success from "./Success";
import Failure from "./Failure";
import PayUCheckout from "./PayUCheckout ";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <PayUCheckout />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "failure",
        element: <Failure />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
