import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import CommerceProCheckout from "./CommerceProCheckout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <CommerceProCheckout />,
      },
      {
        path: "success",
        element: <CommerceProCheckout />,
      },
      {
        path: "failure",
        element: <CommerceProCheckout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
