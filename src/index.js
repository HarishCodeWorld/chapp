import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SocketProvider } from "./socket-connection-hook";
// import eruda from "eruda";

// const erudaScript = document.createElement("script");
// erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
// erudaScript.onload = () => {
//   eruda.init();
// };
// document.body.appendChild(erudaScript);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  // <SocketProvider>
  <App />
  // </SocketProvider>
  // </React.StrictMode>
);

reportWebVitals();
