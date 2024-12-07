import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Gerant } from '../../types/User';

interface GerantsState {
  items: Gerant[];
  loading: boolean;
  error: string | null;
  selectedGerantId: string | null;
  filters: {
    search: string;
    status: string;
  };
}

const initialState: GerantsState = {
  items: [],
  loading: false,
  error: null,
  selectedGerantId: null,
  filters: {
    search: '',
    status: '',
  },
};

const gerantsSlice = createSlice({
  name: 'gerants',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setGerants: (state, action: PayloadAction<Gerant[]>) => {
      state.items = action.payload;
    },
    addGerant: (state, action: PayloadAction<Gerant>) => {
      state.items.push(action.payload);
    },
    updateGerant: (state, action: PayloadAction<Gerant>) => {
      const index = state.items.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteGerant: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(g => g.id !== action.payload);
    },
    setSelectedGerantId: (state, action: PayloadAction<string | null>) => {
      state.selectedGerantId = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<GerantsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    assignBarques: (state, action: PayloadAction<{ gerantId: string; barqueIds: string[] }>) => {
      const gerant = state.items.find(g => g.id === action.payload.gerantId);
      if (gerant) {
        gerant.assignedBarques = action.payload.barqueIds;
      }
    },
    removeBarqueAssignment: (state, action: PayloadAction<{ gerantId: string; barqueId: string }>) => {
      const gerant = state.items.find(g => g.id === action.payload.gerantId);
      if (gerant && gerant.assignedBarques) {
        gerant.assignedBarques = gerant.assignedBarques.filter(id => id !== action.payload.barqueId);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setGerants,
  addGerant,
  updateGerant,
  deleteGerant,
  setSelectedGerantId,
  setFilters,
  resetFilters,
  assignBarques,
  removeBarqueAssignment,
} = gerantsSlice.actions;

export default gerantsSlice.reducer;
