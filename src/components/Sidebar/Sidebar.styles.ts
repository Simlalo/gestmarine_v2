import { SxProps, Theme } from '@mui/material';

interface StyleFunctions {
  root: (isCollapsed: boolean) => SxProps<Theme>;
  menuItem: (isActive: boolean) => SxProps<Theme>;
  menuText: (isCollapsed: boolean) => SxProps<Theme>;
}

interface StaticStyles {
  content: SxProps<Theme>;
  menuIcon: SxProps<Theme>;
  toggleButton: SxProps<Theme>;
}

export type SidebarStyles = StyleFunctions & StaticStyles;

export const styles: SidebarStyles = {
  root: (isCollapsed) => ({
    width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.6, 1)',
    bgcolor: 'background.paper',
    borderRight: 1,
    borderColor: 'divider',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: 1,
    '@media (max-width: 900px)': {
      transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
      width: 'var(--sidebar-width)',
    }
  }),

  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    p: 1,
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      bgcolor: 'divider',
      borderRadius: 1
    }
  },

  menuItem: (isActive) => ({
    color: isActive ? 'primary.main' : 'text.primary',
    bgcolor: isActive ? 'action.selected' : 'transparent',
    borderRadius: 1,
    mb: 0.5,
    '&:hover': {
      bgcolor: 'action.hover',
    },
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  }),

  menuIcon: {
    minWidth: '40px',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  menuText: (isCollapsed) => ({
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  toggleButton: {
    position: 'absolute',
    right: '-12px',
    top: '72px',
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    boxShadow: 1,
    '&:hover': {
      bgcolor: 'background.paper',
    },
    '@media (max-width: 900px)': {
      display: 'none',
    }
  }
};