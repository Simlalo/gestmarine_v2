import { CssBaseline } from '@mui/material';
import { 
  RouterProvider, 
  createBrowserRouter,
  createRoutesFromElements,
  Route 
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@features/theme';
import { AuthProvider } from './contexts/AuthContext';
import { store } from './store';
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
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <CssBaseline />
          <div id="root-container" className="app-root">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;