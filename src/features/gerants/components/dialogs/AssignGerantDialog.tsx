import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Gerant } from '../../../../types/User';
import { Boat } from '../../../../types/Boat';
import { BaseDialog } from '../../../../components/ui/Dialog/BaseDialog';

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
  const [selectedGerantId, setSelectedGerantId] = useState<string>('');

  const handleAssign = () => {
    if (selectedGerantId) {
      onAssign(boat.id, selectedGerantId);
      onClose();
    }
  };

  const dialogActions = (
    <>
      <Button onClick={onClose}>Annuler</Button>
      <Button
        onClick={handleAssign}
        variant="contained"
        color="primary"
        disabled={!selectedGerantId}
      >
        Assigner
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`Assigner un gérant à ${boat.name}`}
      actions={dialogActions}
      maxWidth="sm"
      fullWidth
    >
      <FormControl fullWidth>
        <InputLabel id="gerant-select-label">Gérant</InputLabel>
        <Select
          labelId="gerant-select-label"
          value={selectedGerantId}
          label="Gérant"
          onChange={(e) => setSelectedGerantId(e.target.value)}
        >
          {gerants.map((gerant) => (
            <MenuItem key={gerant.id} value={gerant.id}>
              {`${gerant.nom} ${gerant.prenom}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </BaseDialog>
  );
};
