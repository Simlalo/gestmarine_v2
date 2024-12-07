import { SxProps, Theme } from '@mui/material';

interface StyleFunctions {
  root: (isSidebarCollapsed: boolean) => SxProps<Theme>;
  mainContainer: (isSidebarCollapsed: boolean) => SxProps<Theme>;
}

interface StaticStyles {
  content: SxProps<Theme>;
  tableContainer: SxProps<Theme>;
}

export type MainLayoutStyles = StyleFunctions & StaticStyles;

export const styles: MainLayoutStyles = {
  root: (isSidebarCollapsed) => ({
    minHeight: '100vh',
    bgcolor: 'background.default',
    display: 'flex',
  }),

  mainContainer: (isSidebarCollapsed) => ({
    marginLeft: isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
    minHeight: '100vh',
    transition: 'margin-left var(--transition-normal)',
    flex: 1,
    bgcolor: 'background.default',
  }),

  content: {
    padding: (theme) => theme.spacing(8, 4, 4),
    maxWidth: 'var(--content-max-width)',
    margin: '0 auto',
  },

  tableContainer: {
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1,
    overflow: 'hidden',
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
    },
    '& th': {
      bgcolor: 'background.paper',
      color: 'text.secondary',
      fontWeight: 600,
      textAlign: 'left',
      p: 2,
      borderBottom: 1,
      borderColor: 'divider',
    },
    '& td': {
      p: 2,
      borderBottom: 1,
      borderColor: 'divider',
      color: 'text.primary',
    },
    '& tr:nth-of-type(even)': {
      bgcolor: 'action.hover',
    },
  },
};
