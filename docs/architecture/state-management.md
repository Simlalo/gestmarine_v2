# State Management Architecture

## Store Structure

The GestMarine application uses Redux Toolkit for state management, following a feature-based slice architecture combined with React Query for server state management.

### Feature-based Slices

```typescript
/src/store/
├── index.ts           # Store configuration
├── middleware/        # Custom middleware
└── slices/           # Feature slices
    ├── barques/      # Boat management state
    ├── gerants/      # Manager management state
    └── ui/           # UI state (dialogs, notifications)
```

#### Slice Organization
```typescript
// store/slices/barques/index.ts
import { createSlice } from '@reduxjs/toolkit';

export const barquesSlice = createSlice({
  name: 'barques',
  initialState: {
    selectedIds: [],
    filters: {},
    sortModel: null,
  },
  reducers: {
    setSelectedBarques: (state, action) => {
      state.selectedIds = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setSortModel: (state, action) => {
      state.sortModel = action.payload;
    },
  },
});
```

### Action Creators

Actions are defined using Redux Toolkit's createSlice API, which automatically generates action creators and action types.

```typescript
// store/slices/barques/actions.ts
export const {
  setSelectedBarques,
  setFilters,
  setSortModel,
} = barquesSlice.actions;

// Thunk actions for async operations
export const fetchBarques = createAsyncThunk(
  'barques/fetchBarques',
  async (params: FetchBarquesParams) => {
    const response = await api.barques.fetch(params);
    return response.data;
  }
);
```

### Selectors

Selectors are memoized using createSelector for optimal performance.

```typescript
// store/slices/barques/selectors.ts
import { createSelector } from '@reduxjs/toolkit';

export const selectBarquesState = (state: RootState) => state.barques;

export const selectSelectedBarques = createSelector(
  selectBarquesState,
  (state) => state.selectedIds
);

export const selectBarquesFilters = createSelector(
  selectBarquesState,
  (state) => state.filters
);
```

### Middleware Configuration

```typescript
// store/middleware/logger.ts
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

// store/index.ts
export const store = configureStore({
  reducer: {
    barques: barquesSlice.reducer,
    gerants: gerantsSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});
```

## Data Flow

### Action Dispatch

Actions flow through the application in a unidirectional pattern:

1. User interaction or system event
2. Action dispatch
3. Middleware processing
4. Reducer updates
5. State changes
6. Component re-renders

```typescript
// Example component
function BarquesList() {
  const dispatch = useDispatch();
  const selectedIds = useSelector(selectSelectedBarques);

  const handleSelect = (ids: string[]) => {
    dispatch(setSelectedBarques(ids));
  };

  return (
    <BaseTable
      onSelectionChange={handleSelect}
      selectedIds={selectedIds}
    />
  );
}
```

### State Updates

State updates are handled immutably through Redux Toolkit's createSlice API:

```typescript
// Reducer example
reducers: {
  updateBarque: (state, action: PayloadAction<Barque>) => {
    const index = state.items.findIndex(b => b.id === action.payload.id);
    if (index !== -1) {
      state.items[index] = action.payload;
    }
  },
}
```

### Side Effects

Side effects are managed through Redux Thunk and React Query:

```typescript
// Async action with side effects
export const assignBarque = createAsyncThunk(
  'barques/assign',
  async ({ barqueId, gerantId }: AssignBarqueParams, { dispatch }) => {
    try {
      const response = await api.barques.assign(barqueId, gerantId);
      dispatch(showNotification({ message: 'Barque assigned successfully' }));
      return response.data;
    } catch (error) {
      dispatch(showNotification({ message: error.message, type: 'error' }));
      throw error;
    }
  }
);
```

### Error Handling

Comprehensive error handling strategy:

```typescript
// Error handling in reducers
extraReducers: (builder) => {
  builder
    .addCase(fetchBarques.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBarques.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchBarques.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}
```

## Performance Optimization

### Memoization Strategies

1. **Selector Memoization**
```typescript
export const selectFilteredBarques = createSelector(
  [selectBarques, selectFilters],
  (barques, filters) => {
    return barques.filter(barque => 
      Object.entries(filters).every(([key, value]) => 
        barque[key] === value
      )
    );
  }
);
```

2. **Component Memoization**
```typescript
const MemoizedBarqueCard = memo(BarqueCard, (prev, next) => {
  return prev.id === next.id && prev.status === next.status;
});
```

### State Normalization

```typescript
// Normalized state shape
interface BarquesState {
  entities: {
    [id: string]: Barque;
  };
  ids: string[];
  selectedIds: string[];
}

// Normalization adapter
const barquesAdapter = createEntityAdapter<Barque>({
  selectId: (barque) => barque.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
```

### Update Batching

```typescript
// Batch multiple updates
const handleBulkUpdate = () => {
  batch(() => {
    dispatch(updateBarques(updatedBarques));
    dispatch(clearSelection());
    dispatch(updateFilters(newFilters));
  });
};
```

### Cache Management

Integration with React Query for server state management:

```typescript
// Query configuration
export const useBarques = (params: BarqueParams) => {
  return useQuery({
    queryKey: ['barques', params],
    queryFn: () => fetchBarques(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Mutation with cache updates
export const useAssignBarque = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: assignBarque,
    onSuccess: (data) => {
      queryClient.setQueryData(['barques'], (old: Barque[]) =>
        old.map(b => b.id === data.id ? data : b)
      );
    },
  });
};
```
