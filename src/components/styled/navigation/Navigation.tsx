import { styled } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';

export const NavigationBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

export const NavigationContent = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  width: '100%',
}));

export const NavigationLogo = styled('a')(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const NavigationLinks = styled('nav')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

export const NavigationLink = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'color']),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
  },
}));

export const NavigationMenu = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

export const NavigationMobileLinks = styled('div')<{ open: boolean }>(({ theme, open }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    transform: open ? 'translateY(0)' : 'translateY(-100%)',
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    transition: theme.transitions.create(['transform', 'opacity', 'visibility']),
  },
}));

export const NavigationActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const NavigationDivider = styled('div')(({ theme }) => ({
  height: '24px',
  width: '1px',
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(0, 2),
}));
