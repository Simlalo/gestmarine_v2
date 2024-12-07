import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Checkbox,
  TextField,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  Select,
} from '@mui/material';
import type { Barque } from '@/types/Barque';
import type { Gerant } from '@/types/User';
import { BaseDialog } from '@/components/ui/Dialog/BaseDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@/components/ui/Table';
import {
  useAppDispatch,
  useAppSelector,
  selectPorts,
  selectBarquesLoading,
} from '@/store';
import { setFilter } from '@/store/barques/slice';
import { API_ENDPOINTS } from '@/api/constants';
import { apiClient } from '@/api/client';

interface AssignBarquesDialogProps {
  open: boolean;
  onClose: () => void;
  gerant: Gerant;
  onAssign: (gerantId: string, barqueIds: string[]) => Promise<void>;
  barques: Barque[];
}

export const AssignBarquesDialog: React.FC<AssignBarquesDialogProps> = ({
  open,
  onClose,
  gerant,
  onAssign,
  barques,
}) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectBarquesLoading);
  const ports = useAppSelector(selectPorts);
  
  const [selectedBarques, setSelectedBarques] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [portFilter, setPortFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedBarques([]);
      setSearchTerm('');
      setPortFilter('');
      setError(null);
      setPage(0);
    }
  }, [open]);

  // Update filters in Redux store
  useEffect(() => {
    dispatch(setFilter({
      searchTerm,
      port: portFilter,
    }));
  }, [dispatch, searchTerm, portFilter]);

  const filteredBarques = useMemo(() => {
    return barques.filter(barque => {
      const matchesSearch = searchTerm === '' || 
        barque.nomBarque.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPort = portFilter === '' || barque.portAttache === portFilter;
      return matchesSearch && matchesPort;
    });
  }, [barques, searchTerm, portFilter]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedBarques(filteredBarques.map(b => b.id));
    } else {
      setSelectedBarques([]);
    }
  };

  const handleSelect = (barqueId: string) => {
    setSelectedBarques(prev => 
      prev.includes(barqueId)
        ? prev.filter(id => id !== barqueId)
        : [...prev, barqueId]
    );
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async () => {
    if (selectedBarques.length === 0) {
      setError('Veuillez sélectionner au moins une barque');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Make API request to assign barques
      await Promise.all(selectedBarques.map(barqueId => 
        apiClient.post(API_ENDPOINTS.BARQUES.ASSIGNMENTS(barqueId), {
          gerantId: gerant.id
        })
      ));
      
      // Call the onAssign callback to update local state if needed
      await onAssign(gerant.id, selectedBarques);
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'assignation des barques');
      console.error('Failed to assign barques:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const paginatedBarques = filteredBarques.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`Assigner des barques à ${gerant.nom} ${gerant.prenom}`}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Rechercher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Port</InputLabel>
            <Select
              value={portFilter}
              onChange={(e) => setPortFilter(e.target.value)}
              label="Port"
            >
              <MenuItem value="">Tous</MenuItem>
              {ports.map((port) => (
                <MenuItem key={port} value={port}>
                  {port}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Box sx={{ color: 'error.main', mb: 2 }}>
            {error}
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBarques.length === filteredBarques.length}
                    indeterminate={
                      selectedBarques.length > 0 &&
                      selectedBarques.length < filteredBarques.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : paginatedBarques.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune barque trouvée
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBarques.map((barque) => (
                  <TableRow key={barque.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedBarques.includes(barque.id)}
                        onChange={() => handleSelect(barque.id)}
                      />
                    </TableCell>
                    <TableCell>{barque.nomBarque}</TableCell>
                    <TableCell>{barque.portAttache}</TableCell>
                    <TableCell>{barque.isActive ? 'Actif' : 'Inactif'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          count={filteredBarques.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || selectedBarques.length === 0}
          >
            {submitting ? <CircularProgress size={24} /> : 'Assigner'}
          </Button>
        </Box>
      </Box>
    </BaseDialog>
  );
};
