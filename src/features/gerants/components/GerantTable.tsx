import React from 'react';
import {
  TableCell,
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Gerant } from '..';
import type { Barque } from '../../barques';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '../../../components/ui/Table';

interface GerantTableProps {
  gerants: Gerant[];
  barques: Barque[];
  onAssignBarques: (gerantId: string, barqueIds: string[]) => void;
  onEditGerant: (gerant: Gerant) => void;
  onDeleteGerant: (gerantId: string) => void;
}

const GerantTable: React.FC<GerantTableProps> = ({
  gerants,
  barques,
  onAssignBarques,
  onEditGerant,
  onDeleteGerant,
}) => {
  const getGerantBarques = (gerantId: string): Barque[] => {
    return barques.filter(barque => barque.gerantId === gerantId);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Barques assignées</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gerants.map((gerant) => {
            const assignedBarques = getGerantBarques(gerant.id);
            return (
              <TableRow key={gerant.id}>
                <TableCell>{gerant.name}</TableCell>
                <TableCell>{gerant.prenom}</TableCell>
                <TableCell>{gerant.email}</TableCell>
                <TableCell>{gerant.telephone}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {assignedBarques.map((barque) => (
                      <Chip
                        key={barque.id}
                        label={barque.nomBarque}
                        size="small"
                        icon={<DirectionsBoatIcon />}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Tooltip title="Assigner des barques">
                      <IconButton
                        onClick={() => onAssignBarques(gerant.id, [])}
                        color="primary"
                        size="small"
                      >
                        <DirectionsBoatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        onClick={() => onEditGerant(gerant)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        onClick={() => onDeleteGerant(gerant.id)}
                        color="error"
                        size="small"
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

export default GerantTable;
