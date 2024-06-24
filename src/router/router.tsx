import { createBrowserRouter } from "react-router-dom";
import { importPages } from "./lazyRouter";
import { RouterPaths } from "./constants";
import AdminLayout from "layout/AdminLayout/AdminLayout";

export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      {
        path: RouterPaths.Dashboard,
        element: importPages.Dashboard,
      },
    ],
  },
  {
    path: RouterPaths.Home,
    element: importPages.Home,
  },
]);
