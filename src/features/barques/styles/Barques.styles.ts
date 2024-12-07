import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

interface BarquesStyles {
  root: SxProps<Theme>;
  header: SxProps<Theme>;
  actions: SxProps<Theme>;
  content: SxProps<Theme>;
  searchBar: SxProps<Theme>;
  tableContainer: SxProps<Theme>;
  errorContainer: SxProps<Theme>;
  errorContainerAlt: SxProps<Theme>;
  container: SxProps<Theme>;
}

export const barquesStyles = (theme: Theme): BarquesStyles => ({
  root: {
    padding: theme.spacing(3),
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(3)
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      gap: theme.spacing(2)
    }
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const
    }
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(3)
  },
  searchBar: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  },
  tableContainer: {
    flexGrow: 1,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  },
  errorContainerAlt: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`
  },
  errorContainer: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
