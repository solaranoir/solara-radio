import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GeolocationProvider } from './context/GeolocationProvider';
import App from './App';
import './index.css';
import './App.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Solara Radio could not find the #root element.');
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GeolocationProvider>
        <App />
      </GeolocationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
