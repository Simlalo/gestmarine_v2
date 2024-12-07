import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { BarqueState, Barque } from '@/types/Barque';

// Base selector
const selectBarquesState = (state: RootState): BarqueState => state.barques;

// Memoized selectors with proper type safety
export const selectBarquesItems = createSelector(
  [selectBarquesState],
  (state): Barque[] => state.items
);

export const selectBarquesLoading = createSelector(
  [selectBarquesState],
  (state): boolean => state.loading
);

export const selectBarquesError = createSelector(
  [selectBarquesState],
  (state): string | null => state.error
);

export const selectBarquesFilters = createSelector(
  [selectBarquesState],
  (state): BarqueState['filters'] => state.filters
);

export const selectPorts = createSelector(
  [selectBarquesState],
  (state): string[] => state.ports
);

// Helper functions for filtering
const matchesSearchTerm = (barque: Barque, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return [
    barque.nomBarque,
    barque.immatriculation,
    barque.portAttache
  ].some(field => field?.toLowerCase().includes(term));
};

const matchesPort = (barque: Barque, port: string): boolean => {
  if (!port) return true;
  return barque.portAttache === port;
};

const matchesStatus = (barque: Barque, status: string | undefined): boolean => {
  if (status === undefined) return true;
  return barque.status === status;
};

const matchesGerant = (barque: Barque, gerantId: string | undefined): boolean => {
  if (gerantId === undefined) return true;
  return barque.gerantId === gerantId;
};

// Optimized filtered barques selector
export const selectFilteredBarques = createSelector(
  [selectBarquesItems, selectBarquesFilters],
  (barques, filters): Barque[] => {
    const { searchTerm, port, status, gerantId } = filters;
    
    return barques.filter(barque => 
      matchesSearchTerm(barque, searchTerm) &&
      matchesPort(barque, port) &&
      matchesStatus(barque, status) &&
      matchesGerant(barque, gerantId)
    );
  }
);

// Additional derived selectors
export const selectBarqueById = createSelector(
  [selectBarquesItems, (_state: RootState, barqueId: string) => barqueId],
  (barques, barqueId): Barque | undefined => 
    barques.find(barque => barque.id === barqueId)
);

export const selectBarquesCount = createSelector(
  [selectBarquesItems],
  (barques): number => barques.length
);

export const selectFilteredBarquesCount = createSelector(
  [selectFilteredBarques],
  (barques): number => barques.length
);
