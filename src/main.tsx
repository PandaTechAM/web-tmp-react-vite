import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "router/router.tsx";
import { RouterProvider } from "react-router-dom";
import { antTheme } from "utils/antTheme";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={antTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);
