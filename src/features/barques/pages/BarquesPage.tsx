import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';

// Redux imports from centralized store
import {
  useAppDispatch,
  useAppSelector,
  selectFilteredBarques,
  selectBarquesLoading,
  selectBarquesError,
  selectPorts,
  fetchBarques,
  setFilter,
  createBarque,
  updateBarque,
  removeBarque
} from '@/store';

// Components
import { BarqueTable } from '../components/BarqueTable';
import { BarqueFilters } from '../components/BarqueFilters';
import { BarqueDialog } from '../components/dialogs';
import { BarquesHeader } from '../components/BarquesHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/common';
import { BulkBarqueImport } from '../components/BulkBarqueImport';

// Hooks
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

// Types
import type { Barque, CreateBarquePayload } from '@/types/Barque';

// Styles
import { barquesStyles } from '../styles/Barques.styles';

export const BarquesPageContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { user } = useAuth();
  const isGerant = user?.role === 'gérant';
  const gerantUser = isGerant && user ? (user as any) : null;
  const assignedBarques = gerantUser?.assignedBarques || [];
  
  // Redux selectors
  const barques = useAppSelector(selectFilteredBarques);
  const loading = useAppSelector(selectBarquesLoading);
  const error = useAppSelector(selectBarquesError);
  const ports = useAppSelector(selectPorts);
  
  // Local state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedBarques, setSelectedBarques] = useState<string[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [portFilter, setPortFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch barques on mount
  useEffect(() => {
    dispatch(fetchBarques());
  }, [dispatch]);
  
  // Memoized handlers
  const handleRefresh = useCallback(() => {
    dispatch(fetchBarques());
  }, [dispatch]);
  
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    const filters = { searchTerm: newSearchTerm };
    dispatch(setFilter(filters));
  }, [dispatch]);

  const handlePortFilterChange = useCallback((newPortFilter: string) => {
    setPortFilter(newPortFilter);
    const filters = { port: newPortFilter };
    dispatch(setFilter(filters));
  }, [dispatch]);

  const handleStatusFilterChange = useCallback((newStatusFilter: string) => {
    setStatusFilter(newStatusFilter);
    const filters = { status: newStatusFilter };
    dispatch(setFilter(filters));
  }, [dispatch]);
  
  const handleCreateBarque = useCallback(async (barque: CreateBarquePayload) => {
    try {
      await dispatch(createBarque(barque)).unwrap();
      setOpenAddDialog(false);
    } catch (error) {
      console.error('Failed to create barque:', error);
    }
  }, [dispatch]);
  
  const handleUpdateBarque = useCallback(async (barque: Barque) => {
    try {
      await dispatch(updateBarque({ id: barque.id, updates: barque })).unwrap();
    } catch (error) {
      console.error('Failed to update barque:', error);
    }
  }, [dispatch]);
  
  const handleDeleteBarque = useCallback(async (barqueId: string) => {
    try {
      await dispatch(removeBarque(barqueId)).unwrap();
      setSelectedBarques(prev => prev.filter(id => id !== barqueId));
    } catch (error) {
      console.error('Failed to delete barque:', error);
    }
  }, [dispatch]);

  const handleBulkImport = async (barques: Partial<Barque>[]) => {
    try {
      const validBarques = barques.filter((barque): barque is CreateBarquePayload => 
        typeof barque.nomBarque === 'string' && barque.nomBarque.length > 0
      );
      
      await Promise.all(validBarques.map(barque => dispatch(createBarque(barque))));
      setShowImport(false);
      dispatch(fetchBarques());
    } catch (error) {
      console.error('Failed to import barques:', error);
    }
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleImportClick = () => {
    setShowImport(true);
  };

  const onAddClick = () => {
    // Logic for adding a new barque
  };

  const onImportClick = () => {
    // Logic for importing barques
  };

  return (
    <Box sx={barquesStyles(theme).container}>
      <ErrorBoundary>
        <Box>
          <BarquesHeader
            onAddClick={onAddClick}
            onImportClick={onImportClick}
            selectedCount={selectedBarques.length}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Barques</Typography>
            {isGerant && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddClick}
                >
                  Ajouter
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleImportClick}
                >
                  Importer
                </Button>
                <Button onClick={handleRefresh} variant="contained" color="primary" startIcon={<CloudUploadIcon />}>Refresh</Button>
              </Box>
            )}
          </Box>
          
          {loading && <LoadingState />}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <BarqueFilters
            ports={ports}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            portFilter={portFilter}
            onPortFilterChange={handlePortFilterChange}
            statusFilter={statusFilter}
            onStatusFilter={handleStatusFilterChange}
            isGerant={isGerant}
          />
          
          <BarqueTable
            barques={barques}
            onDeleteBarque={handleDeleteBarque}
            onUpdateBarque={handleUpdateBarque}
            selectedBarques={selectedBarques}
            isGerant={isGerant}
          />

          {openAddDialog && (
            <BarqueDialog
              open={openAddDialog}
              onClose={() => setOpenAddDialog(false)}
              onSubmit={handleCreateBarque}
              ports={ports}
            />
          )}

          {showImport && (
            <BulkBarqueImport
              onImport={handleBulkImport}
              onClose={() => setShowImport(false)}
            />
          )}
        </Box>
      </ErrorBoundary>
    </Box>
  );
};

const BarquesPage: React.FC = () => (
  <ErrorBoundary>
    <BarquesPageContent />
  </ErrorBoundary>
);

export default BarquesPage;
