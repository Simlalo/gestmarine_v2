import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Gerant } from '../../types/User';
import { Boat } from '../../types/Boat';

interface AssignGerantDialogProps {
  open: boolean;
  onClose: () => void;
  boat: Boat;
  gerants: Gerant[];
  onAssign: (boatId: string, gerantId: string) => void;
}

export const AssignGerantDialog: React.FC<AssignGerantDialogProps> = ({
  open,
  onClose,
  boat,
  gerants,
  onAssign,
}) => {
  const [selectedGerant, setSelectedGerant] = useState<string>('');

  useEffect(() => {
    if (open) {
      setSelectedGerant('');
    }
  }, [open]);

  const handleAssign = () => {
    if (selectedGerant) {
      onAssign(boat.id, selectedGerant);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assigner un gérant à {boat.nomBarque}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Gérant</InputLabel>
          <Select
            value={selectedGerant}
            label="Gérant"
            onChange={(e) => setSelectedGerant(e.target.value)}
          >
            {gerants.map((gerant) => (
              <MenuItem key={gerant.id} value={gerant.id}>
                {gerant.nom} {gerant.prenom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          color="primary"
          disabled={!selectedGerant}
        >
          Assigner
        </Button>
      </DialogActions>
    </Dialog>
  );
};
