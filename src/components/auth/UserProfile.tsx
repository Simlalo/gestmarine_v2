import React, { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implémenter le changement de mot de passe
    setPasswordDialogOpen(false);
    setPasswords({ old: '', new: '', confirm: '' });
  };

  if (!user) return null;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        className="profile-button"
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          {user.email[0].toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <PersonIcon sx={{ mr: 1 }} fontSize="small" />
          Mon Profil
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          setPasswordDialogOpen(true);
        }}>
          <LockIcon sx={{ mr: 1 }} fontSize="small" />
          Changer mot de passe
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          logout();
        }}>
          <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
          Déconnexion
        </MenuItem>
      </Menu>

      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handlePasswordSubmit}>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="old"
              label="Ancien mot de passe"
              type="password"
              fullWidth
              variant="outlined"
              value={passwords.old}
              onChange={handlePasswordChange}
            />
            <TextField
              margin="dense"
              name="new"
              label="Nouveau mot de passe"
              type="password"
              fullWidth
              variant="outlined"
              value={passwords.new}
              onChange={handlePasswordChange}
            />
            <TextField
              margin="dense"
              name="confirm"
              label="Confirmer le mot de passe"
              type="password"
              fullWidth
              variant="outlined"
              value={passwords.confirm}
              onChange={handlePasswordChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>Annuler</Button>
            <Button type="submit" variant="contained">Changer</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
