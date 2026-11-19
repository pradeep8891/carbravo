import { App } from "@/app/App";
import { AppProviders } from "@/providers/AppProviders";
import "@/theme/global.css";
import React from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" was not found in the HTML document.');
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
