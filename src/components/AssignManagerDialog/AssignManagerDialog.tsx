import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Manager } from '../../types/User';

interface AssignManagerDialogProps {
  open: boolean;
  onClose: () => void;
  managers: Manager[];
  onAssign: (managerId: string) => void;
  boatName: string;
}

const AssignManagerDialog: React.FC<AssignManagerDialogProps> = ({
  open,
  onClose,
  managers,
  onAssign,
  boatName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Assigner un Gérant à {boatName}
      </DialogTitle>
      <DialogContent>
        {managers.length === 0 ? (
          <Typography color="text.secondary">
            Aucun gérant disponible
          </Typography>
        ) : (
          <List>
            {managers
              .filter(manager => !manager.assignedBoatId)
              .map((manager) => (
                <ListItem
                  button
                  key={manager.id}
                  onClick={() => onAssign(manager.id)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={manager.name}
                    secondary={manager.email}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignManagerDialog;
