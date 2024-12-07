import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './features/theme'

// Initialize MSW in development
async function initApp() {
  if (process.env.NODE_ENV === 'development') {
    // Import MSW worker but don't start it (already started in setup.ts)
    await import('./mocks/setup')
  }

  // Détection initiale du thème système
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  document.documentElement.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
  )
}

initApp().catch(console.error)
