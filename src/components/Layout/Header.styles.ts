import { styled } from '@mui/material/styles';
import { AppBar, Box } from '@mui/material';

export const StyledHeader = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  backgroundColor: 'var(--color-header-background)',
  color: 'var(--color-text-primary)',
  boxShadow: '0 1px 2px var(--shadow-color)',
  borderBottom: '1px solid var(--color-border-primary)',
  zIndex: theme.zIndex.drawer + 1,
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 2),
  minHeight: 64,
  gap: theme.spacing(2),
}));
