import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Alert,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { Barque } from '@/types/Barque';
import { CreateBarquePayload } from '@/types/Barque';
import { BaseDialog } from '@/components/ui/Dialog/BaseDialog';
import { FormField } from '@/components/ui/Form/FormField';
import { TabPanel } from '@/components/ui/Tabs/TabPanel';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library

interface ImportedBarqueRow {
  [key: string]: string | undefined;
  'Affiliation'?: string;
  'affiliation'?: string;
  'Immatriculation'?: string;
  'immatriculation'?: string;
  'Nom de la barque'?: string;
  'nomBarque'?: string;
  'Port d\'attache'?: string;
  'portAttache'?: string;
}

interface BarqueDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (barque: CreateBarquePayload) => Promise<void>;
  ports: string[];
}

export const BarqueDialog: React.FC<BarqueDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  ports
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ImportedBarqueRow[]>([]);
  const [manualBarque, setManualBarque] = useState<Omit<Barque, 'id'>>({
    affiliation: '',
    immatriculation: '',
    nomBarque: '',
    portAttache: '',
    isActive: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError(null);
        handleFileUpload(selectedFile);
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
        setFile(null);
      }
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ImportedBarqueRow>(worksheet);
        setImportedData(jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      setError('Erreur lors de la lecture du fichier');
      console.error('Error reading file:', error);
    }
  };

  const handleManualInputChange = (field: keyof Omit<Barque, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualBarque((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImport = async () => {
    if (selectedTab === 0) {
      // Manual import
      const newBarque: CreateBarquePayload = {
        affiliation: manualBarque.affiliation,
        immatriculation: manualBarque.immatriculation,
        nomBarque: manualBarque.nomBarque,
        portAttache: manualBarque.portAttache,
        isActive: manualBarque.isActive,
        status: manualBarque.isActive ? 'active' : 'inactive',
      };
      await onSubmit(newBarque);
    } else {
      // File import
      const barques: Barque[] = importedData.map((row) => ({
        id: uuidv4(), // Generate unique ID
        affiliation: row.Affiliation || row.affiliation || '',
        immatriculation: row.Immatriculation || row.immatriculation || '',
        nomBarque: row['Nom de la barque'] || row.nomBarque || '',
        portAttache: row['Port d\'attache'] || row.portAttache || '',
        isActive: true,
        status: 'active', // Add 'status' property
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      await Promise.all(barques.map(onSubmit));
    }
    onClose();
  };

  const dialogActions = (
    <>
      <Button onClick={onClose}>Annuler</Button>
      <Button 
        onClick={handleImport} 
        variant="contained" 
        disabled={selectedTab === 1 && importedData.length === 0}
      >
        Importer
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Ajouter une barque"
      actions={dialogActions}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Saisie manuelle" />
          <Tab label="Import Excel" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <TabPanel value={selectedTab} index={0}>
        <Box display="flex" flexDirection="column" gap={2}>
          <FormField
            label="Affiliation"
            value={manualBarque.affiliation}
            onChange={handleManualInputChange('affiliation')}
            fullWidth
            required
          />
          <FormField
            label="Immatriculation"
            value={manualBarque.immatriculation}
            onChange={handleManualInputChange('immatriculation')}
            fullWidth
            required
          />
          <FormField
            label="Nom de la barque"
            value={manualBarque.nomBarque}
            onChange={handleManualInputChange('nomBarque')}
            fullWidth
            required
          />
          <FormField
            label="Port d'attache"
            value={manualBarque.portAttache}
            onChange={handleManualInputChange('portAttache')}
            fullWidth
            required
            select
          >
            {ports.map((port) => (
              <MenuItem key={port} value={port}>
                {port}
              </MenuItem>
            ))}
          </FormField>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 3,
          }}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="file-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Sélectionner un fichier
            </Button>
          </label>
          {file && (
            <Typography variant="body2" color="text.secondary">
              Fichier sélectionné: {file.name}
            </Typography>
          )}
          {importedData.length > 0 && (
            <Typography>
              {importedData.length} barque(s) trouvée(s) dans le fichier
            </Typography>
          )}
        </Box>
      </TabPanel>
    </BaseDialog>
  );
};
