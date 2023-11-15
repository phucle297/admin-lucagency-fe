import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "./index.scss";
import { ConfigProvider } from "antd";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
        },
      }}
    >
      <MantineProvider>
        <App />
      </MantineProvider>
    </ConfigProvider>
  </React.StrictMode>
);
