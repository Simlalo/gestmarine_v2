import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Barque } from '../../types/Barque';

interface BarqueSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedBarqueIds: string[]) => void;
  availableBarques: Barque[];
  title?: string;
}

export const BarqueSelectionDialog: React.FC<BarqueSelectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  availableBarques,
  title = 'Sélectionner des barques'
}) => {
  const [selectedBarques, setSelectedBarques] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Barque>('nomBarque');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setSelectedBarques([]);
    setSearchTerm('');
    setPage(1);
  }, [open]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = filteredBarques.map(barque => barque.id!);
      setSelectedBarques(allIds);
    } else {
      setSelectedBarques([]);
    }
  };

  const handleSelect = (barqueId: string) => {
    setSelectedBarques(prev => {
      if (prev.includes(barqueId)) {
        return prev.filter(id => id !== barqueId);
      } else {
        return [...prev, barqueId];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedBarques);
    onClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortField(event.target.value as keyof Barque);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredBarques = useMemo(() => {
    return availableBarques
      .filter(barque =>
        Object.values(barque).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        const aValue = String(a[sortField]);
        const bValue = String(b[sortField]);
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [availableBarques, searchTerm, sortField, sortDirection]);

  const paginatedBarques = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredBarques.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredBarques, page, rowsPerPage]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Trier par</InputLabel>
            <Select
              value={sortField}
              label="Trier par"
              onChange={handleSortChange}
              onClick={toggleSortDirection}
            >
              <MenuItem value="nomBarque">Nom</MenuItem>
              <MenuItem value="affiliation">Affiliation</MenuItem>
              <MenuItem value="immatriculation">Immatriculation</MenuItem>
              <MenuItem value="portAttache">Port d'attache</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedBarques.length > 0 &&
                      selectedBarques.length < filteredBarques.length
                    }
                    checked={
                      filteredBarques.length > 0 &&
                      selectedBarques.length === filteredBarques.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Affiliation</TableCell>
                <TableCell>Immatriculation</TableCell>
                <TableCell>Port d'attache</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBarques.map((barque) => (
                <TableRow
                  key={barque.id}
                  hover
                  onClick={() => handleSelect(barque.id!)}
                  role="checkbox"
                  selected={selectedBarques.includes(barque.id!)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedBarques.includes(barque.id!)} />
                  </TableCell>
                  <TableCell>{barque.nomBarque}</TableCell>
                  <TableCell>{barque.affiliation}</TableCell>
                  <TableCell>{barque.immatriculation}</TableCell>
                  <TableCell>{barque.portAttache}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredBarques.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
