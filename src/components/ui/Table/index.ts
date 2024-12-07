import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TablePagination as MuiTablePagination,
  styled,
} from '@mui/material';

export const TableWrapper = styled('div')`
  width: 100%;
  overflow-x: auto;
`;

export const TableContainer = styled(MuiTableContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const Table = styled(MuiTable)`
  min-width: 650px;
`;

export const TableHead = styled(MuiTableHead)`
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export const TableBody = styled(MuiTableBody)``;

export const TableRow = styled(MuiTableRow)`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

export const TableCell = styled(MuiTableCell)`
  padding: ${({ theme }) => theme.spacing(1.5)};
`;

export const TablePagination = styled(MuiTablePagination)``;
