import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './store/AppContext.jsx';
import { DataProvider } from './store/DataContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* DataProvider charge le contenu depuis l'API avant de monter l'app. */}
    <DataProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </DataProvider>
  </React.StrictMode>,
);
