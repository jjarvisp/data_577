import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Amplify } from "aws-amplify";

import "./index.css";
import App from "./App.tsx";

import amplifyOutputs from "../amplify_outputs.json";

Amplify.configure(amplifyOutputs);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
