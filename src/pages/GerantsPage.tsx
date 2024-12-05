import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Gerant } from '../types/User';
import { Barque } from '../types/Barque';
import { gerantApi } from '../api/gerantApi';
import { barqueApi } from '../api/barqueApi';
import { AssignBarquesDialog } from '../components/AssignBarquesDialog/AssignBarquesDialog';
import { GerantDialog } from '../components/GerantDialog/GerantDialog';
import { GerantTable } from '../components/GerantTable/GerantTable';

export const GerantsPage: React.FC = () => {
  const [gerants, setGerants] = useState<Gerant[]>([]);
  const [barques, setBarques] = useState<Barque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGerant, setSelectedGerant] = useState<Gerant | null>(null);
  const [barqueDialogOpen, setBarqueDialogOpen] = useState(false);
  const [gerantDialogOpen, setGerantDialogOpen] = useState(false);
  const [editingGerant, setEditingGerant] = useState<Gerant | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gerantToDelete, setGerantToDelete] = useState<Gerant | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPort, setFilterPort] = useState<string[]>([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gerantsData, barquesData] = await Promise.all([
        gerantApi.getGerants(),
        barqueApi.getBarques()
      ]);
      setGerants(gerantsData);
      setBarques(barquesData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBarqueAssignment = async (gerantId: string, barqueIds: string[]) => {
    const selectedGerant = gerants.find(g => g.id === gerantId);
    if (!selectedGerant) return;

    try {
      await gerantApi.assignBarques(gerantId, barqueIds);
      await loadData();
      setBarqueDialogOpen(false);
      setSelectedGerant(null);
      setError(null);
    } catch (error) {
      console.error('Error assigning barques:', error);
      setError('Erreur lors de l\'attribution des barques');
    }
  };

  const handleGerantSave = async (gerant: Gerant, newPassword?: string) => {
    try {
      // Check for unique email and telephone
      const existingGerants = gerants.filter(g => 
        (editingGerant ? g.id !== editingGerant.id : true) && // Exclude current gérant when editing
        (g.email === gerant.email || g.telephone === gerant.telephone)
      );

      if (existingGerants.length > 0) {
        const duplicateField = existingGerants[0].email === gerant.email ? 'email' : 'téléphone';
        setError(`Un gérant avec cet ${duplicateField} existe déjà`);
        return;
      }

      if (editingGerant) {
        await gerantApi.updateGerant(editingGerant.id, {
          ...gerant,
          password: newPassword,
          role: gerant.role || 'gerant'  // Preserve existing role or default to 'gerant'
        });
      } else {
        if (!newPassword) {
          setError('Le mot de passe est requis pour créer un nouveau gérant');
          return;
        }
        await gerantApi.createGerant({
          nom: gerant.nom,
          prenom: gerant.prenom,
          email: gerant.email,
          telephone: gerant.telephone,
        }, newPassword!);
      }
      
      // Refresh the data after creating/updating
      await loadData();
      
      // Reset the dialog state
      setGerantDialogOpen(false);
      setEditingGerant(undefined);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error saving gerant:', error);
      setError('Erreur lors de la sauvegarde du gérant');
    }
  };

  const handleDeleteConfirmation = (gerant: Gerant) => {
    setGerantToDelete(gerant);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setGerantToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!gerantToDelete) return;

    try {
      await gerantApi.deleteGerant(gerantToDelete.id);
      await loadData(); // Refresh the data
      setError(null);
      setDeleteDialogOpen(false);
      setGerantToDelete(null);
    } catch (error) {
      console.error('Error deleting gerant:', error);
      setError('Erreur lors de la suppression du gérant');
    }
  };

  const handleEditGerant = (gerant: Gerant) => {
    setEditingGerant(gerant);
    setGerantDialogOpen(true);
  };

  const handleAddGerant = () => {
    setEditingGerant(undefined);
    setGerantDialogOpen(true);
  };

  const getAvailableBarques = (currentGerant: Gerant): Barque[] => {
    const assignedToOthers = new Set(
      gerants
        .filter(g => g.id !== currentGerant.id)
        .flatMap(g => g.assignedBarques)
    );

    return barques.filter(barque => 
      !assignedToOthers.has(barque.id!) || 
      currentGerant.assignedBarques.includes(barque.id!)
    );
  };

  // Filter and search logic
  const filteredGerants = useMemo(() => {
    return gerants.filter(gerant => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        gerant.nom.toLowerCase().includes(searchLower) ||
        gerant.prenom.toLowerCase().includes(searchLower) ||
        gerant.email.toLowerCase().includes(searchLower);

      if (filterPort.length) {
        const gerantBarques = barques.filter(barque => 
          gerant.assignedBarques.includes(barque.id!)
        );
        return matchesSearch && gerantBarques.some(barque => filterPort.includes(barque.portAttache));
      }

      return matchesSearch;
    });
  }, [gerants, searchQuery, filterPort, barques]);

  // Pagination logic
  const paginatedGerants = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredGerants.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredGerants, page, rowsPerPage]);

  const uniquePorts = useMemo(() => {
    return Array.from(new Set(barques.map(barque => barque.portAttache))).sort();
  }, [barques]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des Gérants</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddGerant}
        >
          Nouveau Gérant
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Rechercher un gérant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par port</InputLabel>
          <Select
            value={filterPort}
            onChange={(e) => setFilterPort([e.target.value as string])}
            label="Filtrer par port"
          >
            <MenuItem value="">Tous les ports</MenuItem>
            {uniquePorts.map((port) => (
              <MenuItem key={port} value={port}>
                {port}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <GerantTable
        gerants={paginatedGerants}
        barques={barques}
        onAssignBarques={(gerant) => {
          setSelectedGerant(gerant);
          setBarqueDialogOpen(true);
        }}
        onEditGerant={handleEditGerant}
        onDeleteGerant={handleDeleteConfirmation}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredGerants.length / rowsPerPage)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {selectedGerant && (
        <AssignBarquesDialog
          open={barqueDialogOpen}
          onClose={() => {
            setBarqueDialogOpen(false);
            setSelectedGerant(null);
          }}
          gerant={selectedGerant}
          onAssign={handleBarqueAssignment}
          availableBarques={getAvailableBarques(selectedGerant)}
        />
      )}

      <GerantDialog
        open={gerantDialogOpen}
        onClose={() => {
          setGerantDialogOpen(false);
          setEditingGerant(undefined);
        }}
        onSave={handleGerantSave}
        gerant={editingGerant}
        isNew={!editingGerant}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le gérant {gerantToDelete?.prenom} {gerantToDelete?.nom} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
