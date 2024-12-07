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
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../../contexts/AuthContext';
import { Barque } from '../../../types/Barque';
import {
  TableWrapper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../../../components/ui/Table';

interface BarqueTableProps {
  barques: Barque[];
  onDeleteBarque: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onImportSuccess?: () => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onUpdateBarque?: (barque: Barque) => Promise<void>;
  onUpdate?: (barque: Barque) => Promise<void>;
  selectable?: boolean;
  selectedBarques?: string[];
  isGerant: boolean;
  loading?: boolean;
}

export const BarqueTable: React.FC<BarqueTableProps> = React.memo(
  ({
    barques = [],
    onDeleteBarque,
    onToggleActive,
    selectable = false,
    selectedBarques = [],
    onSelectionChange,
    onUpdateBarque,
    onUpdate,
    isGerant,
    loading,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleToggleSelect = useCallback((id: string) => {
      if (!onSelectionChange) return;
      
      const newSelection = selectedBarques.includes(id)
        ? selectedBarques.filter(barqueId => barqueId !== id)
        : [...selectedBarques, id];
      
      onSelectionChange(newSelection);
    }, [selectedBarques, onSelectionChange]);

    const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onSelectionChange) return;
      
      if (event.target.checked) {
        const newSelecteds = barques.map((barque) => barque.id);
        onSelectionChange(newSelecteds);
        return;
      }
      onSelectionChange([]);
    }, [barques, onSelectionChange]);

    if (loading) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
          Chargement...
        </Typography>
      );
    }

    const displayedBarques = useMemo(() => {
      return barques.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [barques, page, rowsPerPage]);

    if (!Array.isArray(barques) || barques.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
          Aucune barque trouvée
        </Typography>
      );
    }

    return (
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedBarques.length > 0 && selectedBarques.length < barques.length
                      }
                      checked={barques.length > 0 && selectedBarques.length === barques.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                <TableCell>Nom</TableCell>
                {!isMobile && <TableCell>Immatriculation</TableCell>}
                <TableCell>Port d'attache</TableCell>
                {!isMobile && <TableCell>Affiliation</TableCell>}
                <TableCell align="center">Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBarques.map((barque) => (
                <TableRow key={barque.id}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedBarques.includes(barque.id)}
                        onChange={() => handleToggleSelect(barque.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{barque.nomBarque}</TableCell>
                  {!isMobile && <TableCell>{barque.immatriculation}</TableCell>}
                  <TableCell>{barque.portAttache}</TableCell>
                  {!isMobile && <TableCell>{barque.affiliation}</TableCell>}
                  <TableCell align="center">
                    {onToggleActive && (
                      <Switch
                        checked={barque.isActive}
                        onChange={() => onToggleActive(barque.id, !barque.isActive)}
                        color="primary"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Supprimer">
                      <IconButton
                        onClick={() => onDeleteBarque(barque.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={barques.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </Box>
    );
  }
);
