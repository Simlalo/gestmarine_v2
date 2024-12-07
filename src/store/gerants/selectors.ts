import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { Gerant } from '../../types/User';

export const selectGerantsState = (state: RootState) => state.gerants;

export const selectAllGerants = createSelector(
  selectGerantsState,
  (state) => state.items
);

export const selectGerantsLoading = createSelector(
  selectGerantsState,
  (state) => state.loading
);

export const selectGerantsError = createSelector(
  selectGerantsState,
  (state) => state.error
);

export const selectSelectedGerantId = createSelector(
  selectGerantsState,
  (state) => state.selectedGerantId
);

export const selectSelectedGerant = createSelector(
  selectAllGerants,
  selectSelectedGerantId,
  (gerants, selectedId) => gerants.find(g => g.id === selectedId) || null
);

export const selectGerantsFilters = createSelector(
  selectGerantsState,
  (state) => state.filters
);

export const selectFilteredGerants = createSelector(
  selectAllGerants,
  selectGerantsFilters,
  (gerants, filters) => {
    return gerants.filter(gerant => {
      const matchesSearch = !filters.search || 
        gerant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        gerant.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || gerant.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }
);

export const selectGerantsByBarque = createSelector(
  [selectAllGerants, (state: RootState, barqueId: string) => barqueId],
  (gerants, barqueId) => gerants.filter(g => g.assignedBarques?.includes(barqueId))
);

export const selectGerantStatuses = createSelector(
  selectAllGerants,
  (gerants) => Array.from(new Set(gerants.map(g => g.status))).sort()
);

export const selectGerantStats = createSelector(
  selectAllGerants,
  (gerants) => ({
    total: gerants.length,
    active: gerants.filter(g => g.status === 'active').length,
    inactive: gerants.filter(g => g.status === 'inactive').length,
    withBarques: gerants.filter(g => g.assignedBarques && g.assignedBarques.length > 0).length,
  })
);
