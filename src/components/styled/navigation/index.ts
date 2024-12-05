import { styled } from '@mui/material/styles';
import { Box, IconButton, ListItemButton, ListItemText, Typography } from '@mui/material';

interface SidebarProps {
  isCollapsed: boolean;
}

interface MenuItemProps {
  isActive: boolean;
  isCollapsed: boolean;
}

export const StyledSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})<SidebarProps>(({ theme, isCollapsed }) => ({
  width: isCollapsed ? `${theme.custom.layout.sidebarCollapsedWidth}px` : `${theme.custom.layout.sidebarWidth}px`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: theme.zIndex.drawer,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  [`@media (max-width: 900px)`]: {
    transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
    transition: theme.transitions.create(['transform', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: isCollapsed ? '0' : '240px',
    zIndex: theme.zIndex.drawer + 2
  }
}));

export const SidebarContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius
  }
}));

export const MenuItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => !['isActive', 'isCollapsed'].includes(prop as string),
})<MenuItemProps>(({ theme, isActive, isCollapsed }) => ({
  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 0),
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  minHeight: 48,
  justifyContent: isCollapsed ? 'center' : 'flex-start',
}));

export const MenuIcon = styled(Box)(({ theme }) => ({
  minWidth: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: 24,
  },
}));

export const MenuText = styled(ListItemText)(({ theme }) => ({
  margin: 0,
  marginLeft: theme.spacing(1),
  '& .MuiTypography-root': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  whiteSpace: 'nowrap',
  opacity: 1,
  transition: theme.transitions.create('opacity'),
}));

export const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: '-12px',
  top: '72px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  width: '24px',
  height: '24px',
  padding: 0,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem'
  }
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: '64px',
}));

export const BrandContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
}));

export const BrandIcon = styled(Box)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    fontSize: 32,
    color: 'var(--accent-color)',
    marginRight: theme.spacing(1),
  }
}));

export const BrandText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: 'var(--text-primary)',
  fontSize: '1.25rem',
  letterSpacing: '-0.025em',
  whiteSpace: 'nowrap',
}));

export const HeaderToggle = styled(IconButton)(({ theme }) => ({
  marginLeft: 'auto',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.primary,
  }
}));

export const SidebarLinkContainer = styled('div')<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
  transition: theme.transitions.create(['background-color', 'color']),
  borderRadius: theme.shape.borderRadius,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

export const SidebarIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 40,
  marginRight: theme.spacing(1),
}));

export const SidebarText = styled('span')(({ theme }) => ({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export * from './Navigation';
