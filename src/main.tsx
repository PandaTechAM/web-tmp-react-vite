import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "router/router.tsx";
import { RouterProvider } from "react-router-dom";
import { antTheme } from "utils/antTheme";
import { ConfigProvider } from "antd";
import { store } from "store/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antTheme}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
