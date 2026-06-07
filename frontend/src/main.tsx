import ReactDOM from "react-dom/client";
import App from "./App";
import { queryClient } from "./api/queryClient";
import "./styles/index.css";

import { QueryClientProvider } from "@tanstack/react-query";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
