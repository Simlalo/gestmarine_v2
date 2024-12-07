import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Barque } from '@/types/Barque';

interface ImportState {
  loading: boolean;
  error: string | null;
  progress: number;
  importedBarques: Partial<Barque>[];
  totalBarques: number;
  processedBarques: number;
}

const initialState: ImportState = {
  loading: false,
  error: null,
  progress: 0,
  importedBarques: [],
  totalBarques: 0,
  processedBarques: 0
};

const importSlice = createSlice({
  name: 'barquesImport',
  initialState,
  reducers: {
    startImport: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
      state.progress = 0;
      state.totalBarques = action.payload;
      state.processedBarques = 0;
      state.importedBarques = [];
    },
    updateImportProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    addImportedBarque: (state, action: PayloadAction<Partial<Barque>>) => {
      state.importedBarques.push(action.payload);
      state.processedBarques += 1;
      state.progress = Math.round((state.processedBarques / state.totalBarques) * 100);
    },
    importSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.progress = 100;
    },
    importError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.progress = 0;
    },
    resetImport: (state) => {
      return initialState;
    }
  }
});

// Actions
export const {
  startImport,
  updateImportProgress,
  addImportedBarque,
  importSuccess,
  importError,
  resetImport
} = importSlice.actions;

// Selectors
export const selectImportLoading = (state: RootState) => state.barquesImport.loading;
export const selectImportError = (state: RootState) => state.barquesImport.error;
export const selectImportProgress = (state: RootState) => state.barquesImport.progress;
export const selectImportedBarques = (state: RootState) => state.barquesImport.importedBarques;
export const selectTotalBarques = (state: RootState) => state.barquesImport.totalBarques;
export const selectProcessedBarques = (state: RootState) => state.barquesImport.processedBarques;

export default importSlice.reducer;
