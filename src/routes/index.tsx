import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import { GerantsPage } from '../pages/GerantsPage';
import BarquesPage from '../pages/BarquesPage';
import SettingsPage from '../pages/SettingsPage';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes = () => {
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
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gerants" element={<GerantsPage />} />
        <Route path="/barques" element={<BarquesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {user?.role === 'administrateur' && (
        <Route path="/gerants" element={<GerantsPage />} />
      )}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
