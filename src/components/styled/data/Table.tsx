import { styled } from '@mui/material/styles';
import {
  Table as MuiTable,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  Paper,
} from '@mui/material';

export const TableWrapper = styled(Paper)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(['box-shadow']),
  margin: theme.spacing(2, 0),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  maxHeight: '70vh',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const Table = styled(MuiTable)(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
}));

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: '#64b5f6',
  '& th': {
    fontWeight: 600,
    color: theme.palette.common.white,
    fontSize: '0.95rem',
    padding: theme.spacing(2),
  },
}));

export const TableBody = styled(MuiTableBody)(({ theme }) => ({
  '& tr:last-child td': {
    borderBottom: 'none',
  },
}));

export const TableRow = styled(MuiTableRow)<{ selected?: boolean }>(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
    paddingLeft: theme.spacing(3),
  },
  '&:last-of-type': {
    paddingRight: theme.spacing(3),
  },
}));

export const TableHeaderCell = styled(MuiTableCell)(({ theme }) => ({
  backgroundColor: 'inherit',
  color: 'inherit',
  fontWeight: 'inherit',
  borderBottom: `1px solid #42a5f5`,
  whiteSpace: 'nowrap',
  '&:first-of-type': {
    paddingLeft: theme.spacing(3),
  },
  '&:last-of-type': {
    paddingRight: theme.spacing(3),
  },
}));

export const TableActionCell = styled(TableCell)({
  width: '1%',
  whiteSpace: 'nowrap',
});
