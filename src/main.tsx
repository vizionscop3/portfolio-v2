import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { logger } from './utils/logger';

// Log app initialization (forced deployment)
logger.info('Portfolio application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error('Root element not found');
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

logger.info('Portfolio application initialized successfully');
