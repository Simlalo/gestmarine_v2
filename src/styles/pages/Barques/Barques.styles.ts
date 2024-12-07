import { styled } from '@mui/material/styles';
import { TableCell, TableHead, TableRow, Button } from '@mui/material';

// Container Components
export const BarquesContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

export const BarquesHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

export const BarquesTitle = styled('h1')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.fontWeightBold,
}));

export const BarquesActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

// Table Components
export const TableContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  '& .MuiTableCell-head': {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.background.default,
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Action Buttons
export const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: 'edit' | 'delete' }>(({ theme, variant }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(variant === 'delete' && {
    color: theme.palette.error.main,
  }),
  ...(variant === 'edit' && {
    color: theme.palette.warning.main,
  }),
}));

// State Components
export const EmptyState = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6),
  color: theme.palette.text.secondary,
}));

export const LoadingState = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
  '& .MuiCircularProgress-root': {
    color: theme.palette.primary.main,
  },
}));

export const ErrorState = styled('div')(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.error.main,
  padding: theme.spacing(4),
}));

// Export as a component object
export const Barques = {
  Container: BarquesContainer,
  Header: BarquesHeader,
  Title: BarquesTitle,
  Actions: BarquesActions,
  Table: {
    Container: TableContainer,
    Head: StyledTableHead,
    Cell: StyledTableCell,
    Row: StyledTableRow,
  },
  Action: {
    Button: ActionButton,
  },
  State: {
    Empty: EmptyState,
    Loading: LoadingState,
    Error: ErrorState,
  },
};
