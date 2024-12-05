import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';

export const ParametresPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ mb: 4 }}>
        Paramètres
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Apparence
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Thème :</Typography>
          <ThemeToggle />
        </Box>
      </Paper>
      
      {/* Add more settings sections as needed */}
    </Box>
  );
};
