import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Gerant } from '../../types/User';
import { Barque } from '../../types/Barque';

interface GerantTableProps {
  gerants: Gerant[];
  barques: Barque[];
  onAssignBarques: (gerant: Gerant) => void;
  onEditGerant: (gerant: Gerant) => void;
  onDeleteGerant: (gerant: Gerant) => void;
}

export const GerantTable: React.FC<GerantTableProps> = ({
  gerants,
  barques,
  onAssignBarques,
  onEditGerant,
  onDeleteGerant,
}) => {
  const getGerantBarques = (gerant: Gerant): Barque[] => {
    return barques.filter((barque) => gerant.assignedBarques.includes(barque.id!));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Barques assignées</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gerants.map((gerant) => {
            const assignedBarques = getGerantBarques(gerant);
            return (
              <TableRow key={gerant.id}>
                <TableCell>{gerant.nom}</TableCell>
                <TableCell>{gerant.prenom}</TableCell>
                <TableCell>{gerant.email}</TableCell>
                <TableCell>{gerant.telephone}</TableCell>
                <TableCell>
                  <Chip
                    label={`${assignedBarques.length} barque${assignedBarques.length > 1 ? 's' : ''}`}
                    size="small"
                    icon={<DirectionsBoatIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Assigner des barques">
                      <IconButton
                        onClick={() => onAssignBarques(gerant)}
                        size="small"
                      >
                        <DirectionsBoatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        onClick={() => onEditGerant(gerant)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        onClick={() => onDeleteGerant(gerant)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
