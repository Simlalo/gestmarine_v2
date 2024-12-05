import React, { useCallback, useState, useMemo } from 'react';
import {
  useTheme,
  useMediaQuery,
  Typography,
  IconButton,
  Switch,
  Tooltip,
  TablePagination,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import { Barque } from '../../types/Barque';
import {
  TableWrapper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableActionCell,
} from '../styled/data';

interface BarqueTableProps {
  barques: Barque[];
  onDeleteBarque: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onImportSuccess?: () => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectable?: boolean;
  selectedBarques?: string[];
}

export const BarqueTable: React.FC<BarqueTableProps> = React.memo(
  ({
    barques = [],
    onDeleteBarque,
    onToggleActive,
    onImportSuccess,
    onSelectionChange,
    selectable = false,
    selectedBarques = [],
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const isAdmin = user?.role === 'administrateur';

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Calculate pagination
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedBarques = barques.slice(startIndex, endIndex);

    // Get IDs of currently displayed barques
    const displayedBarqueIds = useMemo(() => 
      displayedBarques.map(barque => barque.id).filter(id => id !== undefined && typeof id === 'string') as string[], 
      [displayedBarques]
    );

    // Check if all displayed barques are selected
    const isAllDisplayedSelected = useMemo(() => 
      displayedBarqueIds.length > 0 && 
      displayedBarqueIds.every(id => selectedBarques.includes(id)),
      [displayedBarqueIds, selectedBarques]
    );

    // Check if some displayed barques are selected
    const isSomeDisplayedSelected = useMemo(() =>
      displayedBarqueIds.some(id => selectedBarques.includes(id)) &&
      !isAllDisplayedSelected,
      [displayedBarqueIds, selectedBarques, isAllDisplayedSelected]
    );

    const handleDelete = useCallback((id: string) => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette barque ?')) {
        onDeleteBarque(id);
      }
    }, [onDeleteBarque]);

    const handleToggleActive = useCallback((id: string, currentState: boolean) => {
      onToggleActive?.(id, !currentState);
    }, [onToggleActive]);

    const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      if (onSelectionChange) {
        const newSelected = event.target.checked
          ? Array.from(new Set([...selectedBarques, ...displayedBarqueIds]))
          : selectedBarques.filter(id => !displayedBarqueIds.includes(id));
        onSelectionChange(newSelected);
      }
    }, [onSelectionChange, selectedBarques, displayedBarqueIds]);

    const handleSelect = useCallback((id: string) => {
      if (onSelectionChange) {
        const newSelected = selectedBarques.includes(id)
          ? selectedBarques.filter(barqueId => barqueId !== id)
          : [...selectedBarques, id];
        onSelectionChange(newSelected);
      }
    }, [onSelectionChange, selectedBarques]);

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    if (!Array.isArray(barques) || barques.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
          Aucune barque trouvée
        </Typography>
      );
    }

    return (
      <TableWrapper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    backgroundColor: '#90caf9',
                    color: 'black',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  },
                }}
              >
                {selectable && (
                  <TableHeaderCell padding="checkbox">
                    <Checkbox
                      indeterminate={isSomeDisplayedSelected}
                      checked={isAllDisplayedSelected}
                      onChange={handleSelectAll}
                    />
                  </TableHeaderCell>
                )}
                <TableHeaderCell>Affiliation</TableHeaderCell>
                <TableHeaderCell>Immatriculation</TableHeaderCell>
                {!isMobile && <TableHeaderCell>Nom de la barque</TableHeaderCell>}
                {!isMobile && <TableHeaderCell>Port d'attache</TableHeaderCell>}
                {isAdmin && onToggleActive && <TableHeaderCell>Actif</TableHeaderCell>}
                {isAdmin && <TableHeaderCell>Actions</TableHeaderCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBarques.map((barque) => (
                <TableRow key={barque.id}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedBarques.includes(barque.id)}
                        onChange={() => barque.id !== undefined ? handleSelect(barque.id) : null}
                      />
                    </TableCell>
                  )}
                  <TableCell>{barque.affiliation ?? 'N/A'}</TableCell>
                  <TableCell>{barque.immatriculation ?? 'N/A'}</TableCell>
                  {!isMobile && <TableCell>{barque.nomBarque ?? 'N/A'}</TableCell>}
                  {!isMobile && <TableCell>{barque.portAttache ?? 'N/A'}</TableCell>}
                  {isAdmin && onToggleActive && (
                    <TableCell>
                      <Switch
                        checked={barque.isActive ?? false}
                        onChange={() => handleToggleActive(barque.id!, barque.isActive ?? false)}
                      />
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableActionCell>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(barque.id!)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableActionCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 30]}
            component="div"
            count={barques.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </TableContainer>
      </TableWrapper>
    );
  }
);

BarqueTable.displayName = 'BarqueTable';
