import { CssBaseline, GlobalStyles as MuiGlobalStyles } from '@mui/material';
import { 
  RouterProvider, 
  createBrowserRouter,
  createRoutesFromElements,
  Route 
} from 'react-router-dom';
import { AppThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';

// Configure future flags for React Router v7
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<AppRoutes />} />
  ),
  {
    future: {
      v7_startTransition: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_fetcherPersist: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <MuiGlobalStyles 
          styles={{
            '*': {
              boxSizing: 'border-box',
              margin: 0,
              padding: 0,
            },
            html: {
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              height: '100%',
              width: '100%',
            },
            body: {
              height: '100%',
              width: '100%',
            },
            '#root': {
              height: '100%',
              width: '100%',
            }
          }}
        />
        <div id="root-container" className="app-root">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;