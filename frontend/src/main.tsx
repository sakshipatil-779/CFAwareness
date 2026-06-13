/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// PWA registration (handled by vite-plugin-pwa via autoUpdate)

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in DOM');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
