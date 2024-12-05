import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import BarquesPage from './pages/BarquesPage';
import GerantsPage from './pages/GerantsPage';
import ResponsablesPage from './pages/ResponsablesPage';
import PaiementsPage from './pages/PaiementsPage';
import { MainLayout } from './components/Layout/MainLayout';

export function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/barques" replace />} />
        <Route path="/barques" element={<BarquesPage />} />
        {user.role === 'administrateur' && (
          <Route path="/gerants" element={<GerantsPage />} />
        )}
        <Route path="/responsables" element={<ResponsablesPage />} />
        <Route path="/paiements" element={<PaiementsPage />} />
        <Route path="*" element={<Navigate to="/barques" replace />} />
      </Route>
    </Routes>
  );
}
