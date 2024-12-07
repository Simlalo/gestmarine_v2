// Core exports
export * from './hooks';
export * from './provider';

import { configureStore } from '@reduxjs/toolkit';
import barquesReducer, {
  setFilter,
  setPorts
} from './barques/slice';
import {
  fetchBarques,
  createBarque,
  updateBarque,
  removeBarque,
  assignGerantToBarque,
  bulkImportBarques
} from './barques/actions';
import {
  selectFilteredBarques,
  selectBarquesLoading,
  selectBarquesError,
  selectPorts,
  selectBarquesCount,
  selectFilteredBarquesCount,
  selectBarqueById
} from './barques/selectors';
import barquesImportReducer, {
  startImport,
  updateImportProgress,
  addImportedBarque,
  importSuccess,
  importError,
  resetImport,
  selectImportLoading,
  selectImportError,
  selectImportProgress,
  selectImportedBarques,
  selectTotalBarques,
  selectProcessedBarques
} from './barques/importSlice';

export const store = configureStore({
  reducer: {
    barques: barquesReducer,
    barquesImport: barquesImportReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['barques/bulkImport/pending'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { AppThunk } from './store';
export type { AppThunk };

// Export all barques-related functionality
export {
  // Actions from slice
  setFilter,
  setPorts,
  
  // Async actions
  fetchBarques,
  createBarque,
  updateBarque,
  removeBarque,
  assignGerantToBarque,
  bulkImportBarques,
  
  // Selectors
  selectFilteredBarques,
  selectBarquesLoading,
  selectBarquesError,
  selectPorts,
  selectBarquesCount,
  selectFilteredBarquesCount,
  selectBarqueById,
  
  // Import-related actions and selectors
  startImport,
  updateImportProgress,
  addImportedBarque,
  importSuccess,
  importError,
  resetImport,
  selectImportLoading,
  selectImportError,
  selectImportProgress,
  selectImportedBarques,
  selectTotalBarques,
  selectProcessedBarques
};

// Feature modules
export * from './barques/actions';
export * from './barques/selectors';
export * from './barques/slice';

// Types
export * from './types';
