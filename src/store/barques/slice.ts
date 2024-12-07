import { createSlice } from '@reduxjs/toolkit';
import type { BarqueState, Barque } from '@/types/Barque';
import { 
  fetchBarques,
  createBarque,
  updateBarque,
  removeBarque,
  assignGerantToBarque,
  updateBarqueStatus,
  bulkImportBarques
} from './actions';

const initialState: BarqueState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    port: '',
    status: '',
    gerantId: ''
  },
  ports: [],
  lastUpdated: null
};

const barquesSlice = createSlice({
  name: 'barques',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPorts: (state, action) => {
      state.ports = action.payload || [];
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Barques
    builder
      .addCase(fetchBarques.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBarques.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        // Safely extract ports from payload
        state.ports = action.payload ? [...new Set((action.payload as Barque[]).filter((b) => b?.portAttache).map((b) => b.portAttache as string))] : [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchBarques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch barques';
        state.items = []; // Reset items on error
      });

    // Create Barque
    builder
      .addCase(createBarque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBarque.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.push(action.payload);
          if (action.payload.portAttache && !state.ports.includes(action.payload.portAttache as string)) {
            state.ports.push(action.payload.portAttache as string);
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createBarque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create barque';
      });

    // Update Barque
    builder
      .addCase(updateBarque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBarque.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.items.findIndex(b => b.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateBarque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update barque';
      });

    // Remove Barque
    builder
      .addCase(removeBarque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBarque.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg) {
          state.items = state.items.filter(b => b.id !== action.meta.arg);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeBarque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove barque';
      });

    // Assign Gerant to Barque
    builder
      .addCase(assignGerantToBarque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignGerantToBarque.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.items.findIndex(b => b.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(assignGerantToBarque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to assign gerant to barque';
      });

    // Update Barque Status
    builder
      .addCase(updateBarqueStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBarqueStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.items.findIndex(b => b.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateBarqueStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update barque status';
      });

    // Bulk Import
    builder
      .addCase(bulkImportBarques.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkImportBarques.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = [...state.items, ...action.payload];
          // Update ports list with new unique ports
          const newPorts = action.payload
            .filter((b: Barque) => b?.portAttache)
            .map((b: Barque) => b.portAttache as string);
          state.ports = [...new Set([...state.ports, ...newPorts])];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(bulkImportBarques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to import barques';
      });
  }
});

export const { setFilter, clearFilters, setPorts, resetState } = barquesSlice.actions;
export default barquesSlice.reducer;
