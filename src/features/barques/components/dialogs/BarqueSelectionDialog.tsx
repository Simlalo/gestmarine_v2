import React, { useState, useMemo } from 'react';
import {
  Button,
  Checkbox,
  TableCell,
  FormControlLabel,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Barque } from '../../../../types/Barque';
import { BaseDialog } from '../../../../components/ui/Dialog/BaseDialog';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '../../../../components/ui/Table';

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
  title = 'Sélectionner des barques',
}) => {
  const [selectedBarques, setSelectedBarques] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [portFilter, setPortFilter] = useState<string>('');

  const ports = useMemo(() => {
    return Array.from(new Set(availableBarques.map(barque => barque.portAttache))).sort();
  }, [availableBarques]);

  const filteredBarques = useMemo(() => {
    return availableBarques.filter(barque => {
      const matchesSearch = searchTerm === '' || 
        barque.nomBarque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barque.immatriculation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPort = portFilter === '' || barque.portAttache === portFilter;
      
      return matchesSearch && matchesPort;
    });
  }, [availableBarques, searchTerm, portFilter]);

  const handleToggleAll = () => {
    if (selectedBarques.length === filteredBarques.length) {
      setSelectedBarques([]);
    } else {
      setSelectedBarques(filteredBarques.map(barque => barque.id));
    }
  };

  const handleToggle = (barqueId: string) => {
    setSelectedBarques(prev =>
      prev.includes(barqueId)
        ? prev.filter(id => id !== barqueId)
        : [...prev, barqueId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedBarques);
    onClose();
  };

  const dialogActions = (
    <>
      <Button onClick={onClose}>Annuler</Button>
      <Button
        onClick={handleConfirm}
        variant="contained"
        color="primary"
        disabled={selectedBarques.length === 0}
      >
        Confirmer
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={dialogActions}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par nom ou immatriculation"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel>Port d'attache</InputLabel>
          <Select
            value={portFilter}
            label="Port d'attache"
            onChange={(e) => setPortFilter(e.target.value)}
          >
            <MenuItem value="">Tous les ports</MenuItem>
            {ports.map((port) => (
              <MenuItem key={port} value={port}>
                {port}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <FormControlLabel
                  control={
                    <Checkbox
                      indeterminate={
                        selectedBarques.length > 0 &&
                        selectedBarques.length < filteredBarques.length
                      }
                      checked={
                        filteredBarques.length > 0 &&
                        selectedBarques.length === filteredBarques.length
                      }
                      onChange={handleToggleAll}
                    />
                  }
                  label="Tout sélectionner"
                />
              </TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Immatriculation</TableCell>
              <TableCell>Port d'attache</TableCell>
              <TableCell>Affiliation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBarques.map((barque) => (
              <TableRow
                key={barque.id}
                hover
                onClick={() => handleToggle(barque.id)}
                role="checkbox"
                aria-checked={selectedBarques.includes(barque.id)}
                selected={selectedBarques.includes(barque.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedBarques.includes(barque.id)} />
                </TableCell>
                <TableCell>{barque.nomBarque}</TableCell>
                <TableCell>{barque.immatriculation}</TableCell>
                <TableCell>{barque.portAttache}</TableCell>
                <TableCell>{barque.affiliation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseDialog>
  );
};
