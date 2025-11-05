import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// ✅ React-PDF worker config
import { pdfjs } from "react-pdf";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.js?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

createRoot(document.getElementById("root")).render(<App />);
