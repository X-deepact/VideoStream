// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/400-italic.css';
import './index.css';
import App from './App.tsx';

// disabled strict mode to prevent double-api-calling (mandatory for 2fa)
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
