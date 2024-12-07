import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Feature-based imports
import { AUTH_ROUTES } from './features/auth';
import { ROUTES as GERANTS_ROUTES, GerantsPage } from './features/gerants';
import { RESPONSABLES_ROUTES } from './features/responsables';
import { PAIEMENTS_ROUTES, PaiementsPage } from './features/paiements';
import { BARQUES_ROUTES, BarquesPage } from './features/barques';
import { layoutRoutes } from './features/layout';

export function AppRoutes() {
  const { user } = useAuth();

  // Public routes (no auth required)
  if (!user) {
    return (
      <Routes>
        {AUTH_ROUTES}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Protected routes (auth required)
  return (
    <Routes>
      {layoutRoutes}
      {/* Default route */}
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* Feature routes */}
      <Route path={BARQUES_ROUTES.LIST} element={<BarquesPage />} />
      <Route path={BARQUES_ROUTES.CREATE} element={<BarquesPage />} />
      <Route path={BARQUES_ROUTES.DETAILS(':id')} element={<BarquesPage />} />
      <Route path={BARQUES_ROUTES.EDIT(':id')} element={<BarquesPage />} />
      
      {/* Admin-only routes */}
      {user.role === 'administrateur' && (
        <>
          <Route path={GERANTS_ROUTES.LIST} element={<GerantsPage />} />
          <Route path={GERANTS_ROUTES.CREATE} element={<GerantsPage />} />
          <Route path={GERANTS_ROUTES.DETAILS(':id')} element={<GerantsPage />} />
          <Route path={GERANTS_ROUTES.EDIT(':id')} element={<GerantsPage />} />
          {RESPONSABLES_ROUTES}
        </>
      )}
      
      {/* Common routes */}
      <Route path={PAIEMENTS_ROUTES.LIST} element={<PaiementsPage />} />
      <Route path={PAIEMENTS_ROUTES.CREATE} element={<PaiementsPage />} />
      <Route path={PAIEMENTS_ROUTES.DETAILS(':id')} element={<PaiementsPage />} />
      <Route path={PAIEMENTS_ROUTES.EDIT(':id')} element={<PaiementsPage />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
