import React from 'react';
import ReactDOM from 'react-dom/client';
import { WeatherProvider } from './context/WeatherContext';
import App from './App';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </React.StrictMode>
);