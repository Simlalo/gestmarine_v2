import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Barque, BarqueFilters } from '@/types/Barque';

// Base selectors
const selectBarquesState = (state: RootState) => state.barques;
const selectFilters = (state: RootState): BarqueFilters => state.barques?.filters || {
  searchTerm: '',
  port: '',
  status: '',
  gerantId: ''
};

// Memoized selectors
export const selectAllBarques = createSelector(
  [selectBarquesState],
  (barquesState) => barquesState?.items || []
);

export const selectBarquesLoading = createSelector(
  [selectBarquesState],
  (barquesState) => barquesState?.loading || false
);

export const selectBarquesError = createSelector(
  [selectBarquesState],
  (barquesState) => barquesState?.error || null
);

export const selectBarquesPorts = createSelector(
  [selectBarquesState],
  (barquesState) => barquesState?.ports || []
);

// Filtered barques selector with memoization
export const selectFilteredBarques = createSelector(
  [selectAllBarques, selectFilters],
  (barques, filters) => {
    if (!barques) return [];
    
    return barques.filter((barque: Barque) => {
      const matchesSearch = !filters.searchTerm || 
        barque.nomBarque.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        barque.immatriculation.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesPort = !filters.port || barque.portAttache === filters.port;
      
      const matchesStatus = !filters.status || barque.status === filters.status;
      
      const matchesGerant = !filters.gerantId || barque.gerantId === filters.gerantId;

      return matchesSearch && matchesPort && matchesStatus && matchesGerant;
    });
  }
);

// Individual barque selector
export const selectBarqueById = createSelector(
  [selectAllBarques, (_state: RootState, barqueId: string) => barqueId],
  (barques, barqueId) => barques.find((barque) => barque.id === barqueId) || null
);

// Current filters selector
export const selectCurrentFilters = createSelector(
  [selectFilters],
  (filters) => filters
);
