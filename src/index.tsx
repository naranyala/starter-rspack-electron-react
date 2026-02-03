import { setup } from 'goober';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyGlobalStyles } from './frontend/styles/redesigned-styles';

setup(React.createElement);
applyGlobalStyles();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
