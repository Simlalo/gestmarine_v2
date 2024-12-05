import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Barque } from '../../types/Barque';

interface BarqueListProps {
  barques: Barque[];
  onDeleteBarque: (id: string) => void;
}

export const BarqueList: React.FC<BarqueListProps> = ({ barques, onDeleteBarque }) => {
  if (barques.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography>Aucune barque enregistrée</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ mt: 2 }}>
      <List>
        {barques.map((barque) => (
          <ListItem
            key={barque.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => {
                if (barque.id !== undefined) {
                  onDeleteBarque(barque.id);
                }
              }}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={barque.nomBarque ?? 'Unknown'}
              secondary={`Affiliation: ${barque.affiliation ?? 'N/A'} | Immatriculation: ${barque.immatriculation ?? 'N/A'} | Port d'attache: ${barque.portAttache ?? 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
