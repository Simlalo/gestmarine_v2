import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

export const LoginLogout: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant="text"
      color={user ? "error" : "primary"}
      onClick={handleLogout}
      startIcon={user ? <LogoutIcon /> : <LoginIcon />}
      sx={{
        ml: 2,
        color: 'var(--text-primary)',
        '&:hover': {
          color: user ? 'var(--error-color)' : 'var(--accent-hover)',
          backgroundColor: 'var(--bg-hover)',
        },
      }}
    >
      {user ? 'Déconnexion' : 'Connexion'}
    </Button>
  );
};
