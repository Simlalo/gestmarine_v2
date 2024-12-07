import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@/features/theme/hooks/useTheme';
import { ThemeMode } from '@/features/theme/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === ThemeMode.DARK;

  return (
    <Tooltip title={isDark ? 'Mode clair' : 'Mode sombre'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: 'var(--text-primary)',
          '&:hover': {
            backgroundColor: 'var(--bg-hover)',
          },
        }}
      >
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};
