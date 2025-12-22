import React from "react";
import { createRoot } from "react-dom/client";
import { MonitorApp } from "./MonitorApp";
import "../../style.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <MonitorApp />
  </React.StrictMode>
);
