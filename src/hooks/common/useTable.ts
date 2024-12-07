import { useState, useCallback, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface FilterConfig {
  field: string;
  value: any;
}

export interface TableState {
  page: number;
  rowsPerPage: number;
  sortConfig: SortConfig | null;
  filters: FilterConfig[];
  selectedRows: string[];
}

export interface UseTableOptions<T> {
  data: T[];
  initialState?: Partial<TableState>;
  getRowId: (row: T) => string;
}

export interface UseTableReturn<T> {
  // Data
  displayData: T[];
  totalRows: number;
  selectedRows: string[];
  
  // Pagination
  page: number;
  rowsPerPage: number;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (newRowsPerPage: number) => void;
  
  // Sorting
  sortConfig: SortConfig | null;
  handleSort: (field: string) => void;
  
  // Filtering
  filters: FilterConfig[];
  handleFilter: (field: string, value: any) => void;
  clearFilters: () => void;
  
  // Selection
  handleSelectRow: (rowId: string) => void;
  handleSelectAllRows: () => void;
  clearSelection: () => void;
  
  // State Management
  resetState: () => void;
}

export const useTable = <T extends Record<string, any>>({
  data,
  initialState = {},
  getRowId,
}: UseTableOptions<T>): UseTableReturn<T> => {
  // Initialize state with defaults and initial values
  const [state, setState] = useState<TableState>({
    page: 0,
    rowsPerPage: 10,
    sortConfig: null,
    filters: [],
    selectedRows: [],
    ...initialState,
  });

  // Sorting logic
  const handleSort = useCallback((field: string) => {
    setState(prev => {
      const newDirection: SortDirection = 
        prev.sortConfig?.field === field && prev.sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc';
      
      return {
        ...prev,
        sortConfig: { field, direction: newDirection },
      };
    });
  }, []);

  // Filtering logic
  const handleFilter = useCallback((field: string, value: any) => {
    setState(prev => ({
      ...prev,
      filters: [
        ...prev.filters.filter(f => f.field !== field),
        { field, value },
      ],
      page: 0, // Reset to first page when filtering
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: [],
      page: 0,
    }));
  }, []);

  // Selection logic
  const handleSelectRow = useCallback((rowId: string) => {
    setState(prev => ({
      ...prev,
      selectedRows: prev.selectedRows.includes(rowId)
        ? prev.selectedRows.filter(id => id !== rowId)
        : [...prev.selectedRows, rowId],
    }));
  }, []);

  const handleSelectAllRows = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRows: prev.selectedRows.length === data.length
        ? []
        : data.map(getRowId),
    }));
  }, [data, getRowId]);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRows: [],
    }));
  }, []);

  // Pagination logic
  const handleChangePage = useCallback((newPage: number) => {
    setState(prev => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const handleChangeRowsPerPage = useCallback((newRowsPerPage: number) => {
    setState(prev => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      page: 0, // Reset to first page when changing rows per page
    }));
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      page: 0,
      rowsPerPage: 10,
      sortConfig: null,
      filters: [],
      selectedRows: [],
      ...initialState,
    });
  }, [initialState]);

  // Process data with current state
  const displayData = useMemo(() => {
    let processed = [...data];

    // Apply filters
    state.filters.forEach(filter => {
      processed = processed.filter(row => {
        const value = row[filter.field];
        if (typeof filter.value === 'string') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return value === filter.value;
      });
    });

    // Apply sorting
    if (state.sortConfig) {
      const { field, direction } = state.sortConfig;
      processed.sort((a, b) => {
        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }, [data, state.filters, state.sortConfig]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const start = state.page * state.rowsPerPage;
    return displayData.slice(start, start + state.rowsPerPage);
  }, [displayData, state.page, state.rowsPerPage]);

  return {
    displayData: paginatedData,
    totalRows: displayData.length,
    selectedRows: state.selectedRows,
    
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    
    sortConfig: state.sortConfig,
    handleSort,
    
    filters: state.filters,
    handleFilter,
    clearFilters,
    
    handleSelectRow,
    handleSelectAllRows,
    clearSelection,
    
    resetState,
  };
};
