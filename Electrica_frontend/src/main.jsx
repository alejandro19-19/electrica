import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./context/Context";
import { ProSidebarProvider } from "./components/mainSidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProSidebarProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ProSidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
