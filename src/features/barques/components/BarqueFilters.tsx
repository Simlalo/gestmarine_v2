import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface BarqueFiltersProps {
  ports: string[];
  searchTerm: string;
  onSearchChange: (newSearchTerm: string) => void;
  portFilter: string;
  onPortFilterChange: (newPortFilter: string) => void;
  statusFilter: string;
  onStatusFilter: (newStatusFilter: string) => void;
  isGerant: boolean;
}

export const BarqueFilters: React.FC<BarqueFiltersProps> = ({
  searchTerm,
  onSearchChange,
  portFilter,
  onPortFilterChange,
  ports,
  statusFilter,
  onStatusFilter,
  isGerant,
}) => {
  return (
    <Box display="flex" gap={2} mb={3}>
      <TextField
        label="Rechercher"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
      />
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Port d'attache</InputLabel>
        <Select
          value={portFilter}
          label="Port d'attache"
          onChange={(e) => onPortFilterChange(e.target.value)}
        >
          <MenuItem value="">Tous</MenuItem>
          {ports.map((port) => (
            <MenuItem key={port} value={port}>
              {port}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Statut</InputLabel>
        <Select
          value={statusFilter}
          label="Statut"
          onChange={(e) => onStatusFilter(e.target.value)}
        >
          <MenuItem value="">Tous</MenuItem>
          <MenuItem value="active">Actif</MenuItem>
          <MenuItem value="inactive">Inactif</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
