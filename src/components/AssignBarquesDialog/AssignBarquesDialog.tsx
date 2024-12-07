import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography,
  Chip,
  TablePagination,
} from '@mui/material';
import { Barque } from '../../types/Barque';
import { Gerant } from '../../types/User';

interface AssignBarquesDialogProps {
  open: boolean;
  onClose: () => void;
  gerant: Gerant;
  onAssign: (gerantId: string, barqueIds: string[]) => void;
  availableBarques: Barque[];
}

export const AssignBarquesDialog: React.FC<AssignBarquesDialogProps> = ({
  open,
  onClose,
  gerant,
  onAssign,
  availableBarques,
}) => {
  const [selectedBarques, setSelectedBarques] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active'>('active');
  const [filterPort, setFilterPort] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setSelectedBarques(gerant.assignedBarques || []);
  }, [gerant]);

  const filteredBarques = useMemo(() => {
    return availableBarques.filter(barque => {
      const matchesSearch = 
        barque.nomBarque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barque.immatriculation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || barque.isActive;
      const matchesPort = filterPort === 'all' || barque.portAttache === filterPort;
      return matchesSearch && matchesStatus && matchesPort;
    });
  }, [availableBarques, searchTerm, filterStatus, filterPort]);

  const handleToggleBarque = (barqueId: string) => {
    setSelectedBarques(prev => 
      prev.includes(barqueId)
        ? prev.filter(id => id !== barqueId)
        : [...prev, barqueId]
    );
  };

  const handleSelectAllInPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentPageBarques = filteredBarques
      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
      .map(barque => barque.id);

    if (event.target.checked) {
      const newSelected = Array.from(new Set([
        ...selectedBarques.filter((id): id is string => id !== undefined && id !== null),
        ...currentPageBarques
      ]));
      setSelectedBarques(newSelected);
    } else {
      const newSelected = selectedBarques.filter(id => !currentPageBarques.includes(id));
      setSelectedBarques(newSelected);
    }
  };

  const handleSave = () => {
    onAssign(gerant.id, selectedBarques);
    onClose();
  };

  const ports = Array.from(new Set(availableBarques.map(barque => barque.portAttache))).sort();

  // Calculate if all barques in current page are selected
  const currentPageBarques = filteredBarques
    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
    .map(barque => barque.id);
  const isAllCurrentPageSelected = currentPageBarques.length > 0 && 
    currentPageBarques.every(id => selectedBarques.includes(id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>
            Assigner des barques à {gerant.nom} {gerant.prenom}
          </Typography>
          {selectedBarques.length > 0 && (
            <Chip
              label={`${selectedBarques.length} barque${selectedBarques.length > 1 ? 's' : ''} sélectionnée${selectedBarques.length > 1 ? 's' : ''}`}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Rechercher"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Port</InputLabel>
            <Select
              value={filterPort}
              label="Port"
              onChange={(e) => setFilterPort(e.target.value)}
            >
              <MenuItem value="all">Tous les ports</MenuItem>
              {ports.map(port => (
                <MenuItem key={port} value={port}>{port}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filterStatus}
              label="Statut"
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active')}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="active">Actifs</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Tooltip title={`Sélectionner les ${Math.min(rowsPerPage, filteredBarques.length - (page - 1) * rowsPerPage)} barques de cette page`}>
                    <Checkbox
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAllInPage}
                      indeterminate={
                        currentPageBarques.some(id => selectedBarques.includes(id)) &&
                        !isAllCurrentPageSelected
                      }
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Immatriculation</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBarques
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((barque) => (
                  <TableRow
                    key={barque.id}
                    sx={{
                      '&.Mui-disabled': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedBarques.includes(barque.id)}
                        onChange={() => handleToggleBarque(barque.id)}
                      />
                    </TableCell>
                    <TableCell>{barque.nomBarque}</TableCell>
                    <TableCell>{barque.immatriculation}</TableCell>
                    <TableCell>{barque.portAttache}</TableCell>
                    <TableCell>{barque.isActive ? 'Actif' : 'Inactif'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small">
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={5}>5 par page</MenuItem>
                <MenuItem value={10}>10 par page</MenuItem>
                <MenuItem value={25}>25 par page</MenuItem>
              </Select>
            </FormControl>
            {selectedBarques.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {selectedBarques.length} sur {filteredBarques.length} barques sélectionnées
              </Typography>
            )}
          </Box>
          <TablePagination
            component="div"
            count={filteredBarques.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
