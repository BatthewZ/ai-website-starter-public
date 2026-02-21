import "./style/app.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { STORAGE_KEY, THEMES } from "./hooks/use-theme";

// Restore saved theme before first render
(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && THEMES.includes(saved as (typeof THEMES)[number])) {
    document.documentElement.setAttribute("data-theme", saved);
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
