import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./main";

const container = document.getElementById("root");
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
