import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    console.log("App mounted successfully");
  } catch (e) {
    console.error("Failed to mount app", e);
    container.innerText = "Error loading app. Please check console.";
  }
} else {
  console.error("Failed to find the root element");
}