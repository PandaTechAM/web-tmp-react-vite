import { createBrowserRouter } from "react-router-dom";
import { importPages } from "./lazyRouter";
import { RouterPaths } from "./constants";

export const router = createBrowserRouter([
  {
    path: RouterPaths.Home,
    element: importPages.Home,
  },
  {
    path: RouterPaths.Dashboard,
    element: importPages.Dashboard,
  },
]);
