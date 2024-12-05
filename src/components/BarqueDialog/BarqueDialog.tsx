import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { Barque } from '../../types/Barque';

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
  onImportBarques: (barques: Barque[]) => void;
  existingBarques?: Barque[];
}

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const BarqueDialog: React.FC<BarqueDialogProps> = ({ 
  open, 
  onClose, 
  onImportBarques, 
  existingBarques = []
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
    isActive: true
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
        setError('Please select an Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    try {
      const data = await readExcelFile(selectedFile);
      setImportedData(data);
      setError(null);
    } catch (err) {
      setError('Error reading file. Please make sure it\'s a valid Excel file.');
      console.error('Error reading file:', err);
    }
  };

  const readExcelFile = (file: File): Promise<ImportedBarqueRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ImportedBarqueRow[];
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsBinaryString(file);
    });
  };

  const validateBarque = (barque: Partial<Barque>): barque is Omit<Barque, 'id'> => {
    return !!(
      barque.affiliation &&
      barque.immatriculation &&
      barque.nomBarque &&
      barque.portAttache
    );
  };

  const mapImportedRowToBarque = (row: ImportedBarqueRow): Partial<Barque> => {
    return {
      affiliation: row.Affiliation || row.affiliation || '',
      immatriculation: row.Immatriculation || row.immatriculation || '',
      nomBarque: row['Nom de la barque'] || row.nomBarque || '',
      portAttache: row['Port d\'attache'] || row.portAttache || '',
      isActive: true
    };
  };

  const handleImport = () => {
    if (importedData.length === 0) {
      setError('No data to import');
      return;
    }

    const mappedBarques = importedData.map(mapImportedRowToBarque);
    const validBarques = mappedBarques.filter(validateBarque);

    if (validBarques.length === 0) {
      setError('No valid barques found in the imported data');
      return;
    }

    // Check for duplicates
    const duplicates = validBarques.filter(barque => 
      existingBarques.some(existing => 
        existing.affiliation === barque.affiliation ||
        existing.immatriculation === barque.immatriculation
      )
    );

    if (duplicates.length > 0) {
      setError('Some barques already exist in the system');
      return;
    }

    onImportBarques(validBarques);
    handleClose();
  };

  const handleManualAdd = () => {
    if (!validateBarque(manualBarque)) {
      setError('Please fill in all required fields');
      return;
    }

    // Check for duplicates
    const isDuplicate = existingBarques.some(
      existing =>
        existing.affiliation === manualBarque.affiliation ||
        existing.immatriculation === manualBarque.immatriculation
    );

    if (isDuplicate) {
      setError('A barque with this affiliation or immatriculation already exists');
      return;
    }

    onImportBarques([manualBarque]);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setImportedData([]);
    setManualBarque({
      affiliation: '',
      immatriculation: '',
      nomBarque: '',
      portAttache: '',
      isActive: true
    });
    onClose();
  };

  const handleManualInputChange = (field: keyof Omit<Barque, 'id' | 'isActive'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualBarque(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Barque</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Import from Excel" />
            <Tab label="Manual Entry" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={selectedTab} index={0}>
          <Box sx={{ mb: 2 }}>
            <input
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Choose Excel File
              </Button>
            </label>
            {file && <Typography sx={{ mt: 1 }}>Selected file: {file.name}</Typography>}
          </Box>

          {importedData.length > 0 && (
            <Typography>
              Found {importedData.length} barques in the file
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Affiliation"
              value={manualBarque.affiliation}
              onChange={handleManualInputChange('affiliation')}
              fullWidth
              required
            />
            <TextField
              label="Immatriculation"
              value={manualBarque.immatriculation}
              onChange={handleManualInputChange('immatriculation')}
              fullWidth
              required
            />
            <TextField
              label="Nom de la barque"
              value={manualBarque.nomBarque}
              onChange={handleManualInputChange('nomBarque')}
              fullWidth
              required
            />
            <TextField
              label="Port d'attache"
              value={manualBarque.portAttache}
              onChange={handleManualInputChange('portAttache')}
              fullWidth
              required
            />
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={selectedTab === 0 ? handleImport : handleManualAdd}
          variant="contained"
          color="primary"
        >
          {selectedTab === 0 ? 'Import' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
