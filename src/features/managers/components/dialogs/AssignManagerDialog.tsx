import React from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Manager } from '../../../../types/User';
import { BaseDialog } from '../../../../components/ui/Dialog/BaseDialog';

interface AssignManagerDialogProps {
  open: boolean;
  onClose: () => void;
  managers: Manager[];
  onAssign: (managerId: string) => void;
  boatName: string;
}

export const AssignManagerDialog: React.FC<AssignManagerDialogProps> = ({
  open,
  onClose,
  managers,
  onAssign,
  boatName,
}) => {
  const handleAssign = (managerId: string) => {
    onAssign(managerId);
    onClose();
  };

  const dialogActions = (
    <Button onClick={onClose} color="primary">
      Fermer
    </Button>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`Assigner un manager à ${boatName}`}
      actions={dialogActions}
      maxWidth="sm"
      fullWidth
    >
      <List>
        {managers.map((manager) => (
          <ListItem
            button
            key={manager.id}
            onClick={() => handleAssign(manager.id)}
          >
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${manager.nom} ${manager.prenom}`}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {manager.email}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </BaseDialog>
  );
};
