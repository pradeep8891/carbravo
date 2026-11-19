import { App } from "@/app/App";
import { AppProviders } from "@/providers/AppProviders";
import "@/theme/global.css";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
