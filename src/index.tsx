import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setup } from 'goober';
import { applyGlobalStyles } from './renderer/styles/goober';

setup(React.createElement);
applyGlobalStyles();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
