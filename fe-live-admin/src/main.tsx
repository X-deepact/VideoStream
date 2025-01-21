import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'
import { Toaster } from './components/ui/toaster'
import { ErrorProvider } from "@/components/auth/ErrorProvider.tsx";
import ErrorBoundary from "@/components/auth/ErrorBoundary.tsx";
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorProvider>
      <ErrorBoundary>
        <App />
        <Toaster />
      </ErrorBoundary>
    </ErrorProvider>
  </React.StrictMode>,
)
