import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Define tailwind extended theme colors for our codec interface
window.tailwind = {
  config: {
    theme: {
      extend: {
        colors: {
          'codec-dark': '#0f380f',
          'codec-mid': '#306230',
          'codec-light': '#8bac0f',
          'codec-highlight': '#c5e881'
        },
        fontFamily: {
          'codec': ['VT323', 'monospace']
        }
      }
    }
  }
};

createRoot(document.getElementById("root")!).render(<App />);
