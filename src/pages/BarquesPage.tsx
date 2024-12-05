import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BarqueTable } from '../components/BarqueTable/BarqueTable';
import { barqueApi } from '../api/barqueApi';
import { Barque } from '../types/Barque';
import BulkBarqueImport from '../components/BulkBarqueImport/BulkBarqueImport';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`barque-tabpanel-${index}`}
      aria-labelledby={`barque-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const BarquesPage = () => {
  const { user } = useAuth();
  const [barques, setBarques] = useState<Barque[]>([]);
  const [filteredBarques, setFilteredBarques] = useState<Barque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [portFilter, setPortFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newBarque, setNewBarque] = useState({
    affiliation: '',
    immatriculation: '',
    portAttache: '',
    nomBarque: '',
    isActive: true
  });
  const [selectedBarques, setSelectedBarques] = useState<string[]>([]);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedGerant, setSelectedGerant] = useState<string>('');
  const [gerants, setGerants] = useState<Gerant[]>([]);

  useEffect(() => {
    loadBarques();
  }, [user]);

  useEffect(() => {
    if (user?.role === 'administrateur') {
      loadGerants();
    }
  }, [user]);

  useEffect(() => {
    filterBarques();
  }, [barques, searchTerm, statusFilter, portFilter]);

  const ports = useMemo(() => {
    return Array.from(new Set(barques.map(barque => barque.portAttache))).sort();
  }, [barques]);

  const loadBarques = async () => {
    try {
      setLoading(true);
      const fetchedBarques = await barqueApi.getBarques();
      
      // Filter barques based on user role and assignments
      const filteredBarques = user?.role === 'gérant'
        ? fetchedBarques.filter(barque => user.assignedBarques?.includes(barque.id))
        : fetchedBarques;
        
      setBarques(filteredBarques);
      setError(null);
    } catch (error) {
      console.error('Error loading barques:', error);
      setError('Erreur lors du chargement des barques');
    } finally {
      setLoading(false);
    }
  };

  const loadGerants = async () => {
    try {
      setLoading(true);
      const fetchedGerants = await barqueApi.getGerants();
      console.log('Loaded gérants:', fetchedGerants); // Debug log
      setGerants(fetchedGerants);
      setError(null);
    } catch (error) {
      console.error('Error loading gérants:', error);
      setError('Erreur lors du chargement des gérants');
    } finally {
      setLoading(false);
    }
  };

  const filterBarques = () => {
    let filtered = [...barques];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(barque => 
        barque.nomBarque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barque.immatriculation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(barque => 
        statusFilter === 'active' ? barque.isActive : !barque.isActive
      );
    }

    // Apply port filter
    if (portFilter !== 'all') {
      filtered = filtered.filter(barque => barque.portAttache === portFilter);
    }

    setFilteredBarques(filtered);
  };

  const handleAddBarque = async () => {
    if (!newBarque.affiliation || !newBarque.immatriculation || !newBarque.portAttache || !newBarque.nomBarque) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const addedBarque = await barqueApi.addBarque({
        ...newBarque,
        isActive: true
      });

      // If user is gérant, automatically assign the new barque
      if (user?.role === 'gérant') {
        await barqueApi.assignBarqueToGerant(addedBarque.id, user.id);
      }

      setBarques(prevBarques => [...prevBarques, addedBarque]);
      setOpenAddDialog(false);
      setNewBarque({
        affiliation: '',
        immatriculation: '',
        portAttache: '',
        nomBarque: '',
        isActive: true
      });
      setError(null);
    } catch (error) {
      console.error('Error adding barque:', error);
      setError('Erreur lors de l\'ajout de la barque');
    }
  };

  const handleDeleteBarque = async (id: string) => {
    // Check if user has permission to delete this barque
    if (user?.role === 'gérant' && !user.assignedBarques?.includes(id)) {
      setError('Vous n\'avez pas la permission de supprimer cette barque');
      return;
    }

    try {
      await barqueApi.deleteBarque(id);
      setBarques(prevBarques => prevBarques.filter(barque => barque.id !== id));
    } catch (error) {
      console.error('Error deleting barque:', error);
      setError('Erreur lors de la suppression de la barque');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    // Check if user has permission to update this barque
    if (user?.role === 'gérant' && !user.assignedBarques?.includes(id)) {
      setError('Vous n\'avez pas la permission de modifier cette barque');
      return;
    }

    try {
      await barqueApi.updateBarque(id, { isActive });
      setBarques(prevBarques =>
        prevBarques.map(barque =>
          barque.id === id ? { ...barque, isActive } : barque
        )
      );
    } catch (error) {
      console.error('Error updating barque:', error);
      setError('Erreur lors de la mise à jour de la barque');
    }
  };

  const determinePortAttache = (immatriculation: string): string => {
    if (immatriculation.startsWith('10/1')) return 'Boujdour';
    if (immatriculation.startsWith('10/2')) return 'Aghti El Ghazi';
    if (immatriculation.startsWith('10/3')) return 'Aftissat';
    if (immatriculation.startsWith('10/4')) return 'Lakraa';
    return '';
  };

  const handleImmatriculationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const immatriculation = event.target.value;
    const portAttache = determinePortAttache(immatriculation);
    setNewBarque(prev => ({
      ...prev,
      immatriculation,
      portAttache
    }));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAssignBarques = async () => {
    if (!selectedGerant || selectedBarques.length === 0) {
      setError('Veuillez sélectionner un gérant et au moins une barque');
      return;
    }

    try {
      await Promise.all(
        selectedBarques.map(barqueId =>
          barqueApi.assignBarqueToGerant(barqueId, selectedGerant)
        )
      );
      
      setOpenAssignDialog(false);
      setSelectedBarques([]);
      setSelectedGerant('');
      setError(null);
      
      // Reload barques to update the assignments
      await loadBarques();
    } catch (error) {
      console.error('Error assigning barques:', error);
      setError('Erreur lors de l\'assignation des barques');
    }
  };

  const renderAssignDialog = () => (
    <Dialog 
      open={openAssignDialog} 
      onClose={() => setOpenAssignDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Assigner les barques à un gérant</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="gerant-select-label">Gérant</InputLabel>
          <Select
            labelId="gerant-select-label"
            value={selectedGerant}
            onChange={(e) => setSelectedGerant(e.target.value)}
            label="Gérant"
          >
            {gerants.map((gerant) => (
              <MenuItem key={gerant.id} value={gerant.id}>
                {`${gerant.prenom} ${gerant.nom} (${gerant.email})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {selectedBarques.length} barque(s) sélectionnée(s)
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenAssignDialog(false);
          setSelectedGerant('');
        }}>
          Annuler
        </Button>
        <Button 
          onClick={handleAssignBarques} 
          variant="contained" 
          color="primary"
          disabled={!selectedGerant || selectedBarques.length === 0}
        >
          Assigner
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestion des Barques
          </Typography>
          {user?.role === 'administrateur' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => setOpenAddDialog(true)}
                startIcon={<AddIcon />}
              >
                Ajouter
              </Button>
              {selectedBarques.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenAssignDialog(true)}
                >
                  Assigner à un gérant ({selectedBarques.length})
                </Button>
              )}
            </Box>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Search and filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Container maxWidth={false} disableGutters>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rechercher"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par nom ou immatriculation..."
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Port d'attache</InputLabel>
                  <Select
                    value={portFilter}
                    label="Port d'attache"
                    onChange={(e) => setPortFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tous les ports</MenuItem>
                    <MenuItem value="Boujdour">Boujdour</MenuItem>
                    <MenuItem value="Aghti El Ghazi">Aghti El Ghazi</MenuItem>
                    <MenuItem value="Aftissat">Aftissat</MenuItem>
                    <MenuItem value="Lakraa">Lakraa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Statut"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="active">Actif</MenuItem>
                    <MenuItem value="inactive">Inactif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <BarqueTable
            barques={filteredBarques}
            onDeleteBarque={handleDeleteBarque}
            onToggleActive={handleToggleActive}
            selectable={user?.role === 'administrateur'}
            selectedBarques={selectedBarques}
            onSelectionChange={setSelectedBarques}
          />
        )}

        {/* Add Barque Dialog */}
        <Dialog 
          open={openAddDialog} 
          onClose={() => setOpenAddDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            pb: 1
          }}>
            <Typography variant="h6" component="div">
              Ajouter une barque
            </Typography>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="barque tabs"
              sx={{
                mt: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48
                }
              }}
            >
              <Tab label="Ajout manuel" />
              <Tab label="Import Excel" />
            </Tabs>
          </DialogTitle>
          <DialogContent>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Affiliation"
                      value={newBarque.affiliation}
                      onChange={(e) => setNewBarque(prev => ({ ...prev, affiliation: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Immatriculation"
                      value={newBarque.immatriculation}
                      onChange={handleImmatriculationChange}
                      required
                      helperText="Format: 10/X-... où X est 1, 2, 3 ou 4"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nom de la barque"
                      value={newBarque.nomBarque}
                      onChange={(e) => setNewBarque(prev => ({ ...prev, nomBarque: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Port d'attache"
                      value={newBarque.portAttache}
                      disabled
                      helperText="Déterminé automatiquement par l'immatriculation"
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <BulkBarqueImport />
            </TabPanel>
          </DialogContent>
          <DialogActions sx={{ 
            px: 3, 
            py: 2,
            borderTop: 1,
            borderColor: 'divider'
          }}>
            <Button 
              onClick={() => setOpenAddDialog(false)}
              variant="outlined"
              sx={{ 
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {tabValue === 0 ? 'Annuler' : 'Fermer'}
            </Button>
            {tabValue === 0 && (
              <Button 
                onClick={handleAddBarque} 
                variant="contained" 
                color="primary"
                disabled={!newBarque.affiliation || !newBarque.immatriculation || !newBarque.portAttache || !newBarque.nomBarque}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Ajouter
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {renderAssignDialog()}
      </Box>
    </Container>
  );
};

export default BarquesPage;
