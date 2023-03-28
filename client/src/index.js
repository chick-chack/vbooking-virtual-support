import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";

import App from "./App";

import "./styles/common.css";
import "./styles/layout.css";
import "./styles/overrides.css";
import "./styles/root.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#000",
        colorPrimaryText: "#2C2C2C",
        fontFamily: "'Poppins', sans-serif",
        borderRadius: "8px",
        colorBorder: "#dedede",
        controlOutlineWidth: "1px",
      },
      components: {
        Typography: {
          sizeMarginHeadingVerticalStart: 0,
          sizeMarginHeadingVerticalEnd: 0,
        },
        Button: {
          colorPrimary: "#3C7165",
          fontSize: "1rem",
          lineHeight: "1rem",
          controlHeight: "50px",
        },
        Select: {
          controlHeight: "50px",
          lineHeight: "45px",
        },
        Radio: {
          size: "24px",
        },
        Tabs: {
          colorPrimary: "linear-gradient(270deg, #960BCD 0%, #44C9FF 100%)",
        },
        Input: {
          controlHeight: "50px",
        },
        Checkbox: {
          borderRadiusSM: "4px",
          colorBgContainer: "transparent",
          colorPrimaryBorderHover: "#eee",
        },
      },
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
);
