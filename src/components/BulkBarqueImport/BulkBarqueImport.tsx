import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Alert,
  AlertTitle,
  styled,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { barqueApi } from '../../api/barqueApi';
import { Barque } from '../../types/Barque';

const StyledInput = styled('input')({
  display: 'none',
});

const UploadBox = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

interface BulkBarqueImportProps {
  onImportSuccess: () => void;
}

const BulkBarqueImport: React.FC<BulkBarqueImportProps> = ({ onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [stats, setStats] = useState<{ total: number; imported: number; duplicates: number } | null>(null);
  const theme = useTheme();

  const determinePortAttache = (immatriculation: string): string => {
    if (immatriculation.startsWith('10/1')) return 'Boujdour';
    if (immatriculation.startsWith('10/2')) return 'Aghti El Ghazi';
    if (immatriculation.startsWith('10/3')) return 'Aftissat';
    if (immatriculation.startsWith('10/4')) return 'Lakraa';
    return '';
  };

  const processExcel = (data: ArrayBuffer): Omit<Barque, 'id'>[] => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    // Debug log the raw data
    console.log('Raw Excel data:', rows);

    const barques: Omit<Barque, 'id'>[] = [];
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (!row || row.length === 0) {
        console.log(`Skipping empty row ${i}`);
        continue;
      }

      // Convert all values to strings and trim
      const affiliation = String(row[0] || '').trim();
      const immatriculation = String(row[1] || '').trim();
      const nomBarque = String(row[2] || '').trim();

      // Skip if any required field is empty
      if (!affiliation || !immatriculation || !nomBarque) {
        console.warn(`Row ${i} skipped - missing required fields:`, { affiliation, immatriculation, nomBarque });
        continue;
      }

      // Clean and validate immatriculation
      let cleanedImmatriculation = immatriculation;
      if (!immatriculation.startsWith('10/')) {
        cleanedImmatriculation = `10/1-${immatriculation}`;
      }

      const portAttache = determinePortAttache(cleanedImmatriculation);

      if (!portAttache) {
        console.warn(`Row ${i}: Port d'attache non déterminé pour l'immatriculation: ${cleanedImmatriculation}`);
        continue;
      }

      const barque = {
        affiliation,
        immatriculation: cleanedImmatriculation,
        nomBarque,
        portAttache,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`Processing row ${i}:`, barque);
      barques.push(barque);
    }

    if (barques.length === 0) {
      throw new Error('Aucune barque valide trouvée dans le fichier. Vérifiez le format du fichier et les données.');
    }

    console.log('Processed barques:', barques);
    return barques;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExt || '')) {
      setError('Format de fichier non supporté. Utilisez .xlsx ou .xls');
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess(false);
    setStats(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result as ArrayBuffer;
          if (!data) {
            throw new Error('Erreur lors de la lecture du fichier');
          }

          const barques = processExcel(data);
          console.log('Processed barques:', barques);

          if (barques.length === 0) {
            throw new Error('Aucune barque valide trouvée dans le fichier');
          }

          const importedBarques = await barqueApi.importBarques(barques);
          console.log('Successfully imported barques:', importedBarques);
          
          setSuccess(true);
          setStats({
            total: barques.length,
            imported: importedBarques.length,
            duplicates: barques.length - importedBarques.length
          });
          
          setSelectedFile(null);
          if (event.target) {
            event.target.value = ''; // Reset file input
          }
          onImportSuccess(); // Call this after successful import
        } catch (err) {
          console.error('Import error:', err);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Une erreur inattendue s\'est produite lors du traitement du fichier');
          }
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('Erreur lors de la lecture du fichier');
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('File handling error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Import en masse
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Importez plusieurs barques à partir d'un fichier Excel (.xlsx, .xls).
          Le fichier doit contenir les colonnes suivantes: Affiliation, Immatriculation, Nom de la barque.
        </Typography>
        <Box 
          component="ul" 
          sx={{ 
            pl: 2, 
            mt: 1, 
            mb: 3,
            listStyle: 'none',
            '& li': {
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '"•"',
                color: 'primary.main',
                fontWeight: 'bold',
                mr: 1
              }
            }
          }}
        >
          <Typography component="li" variant="body2" color="text.secondary">
            10/1: Boujdour
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            10/2: Aghti El Ghazi
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            10/3: Aftissat
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            10/4: Lakraa
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Erreur</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <AlertTitle>Succès</AlertTitle>
          {stats && (
            <>
              Les barques ont été importées avec succès.
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                <li>Total barques dans le fichier: {stats.total}</li>
                <li>Barques importées: {stats.imported}</li>
                {stats.duplicates > 0 && (
                  <li>Barques ignorées (doublons): {stats.duplicates}</li>
                )}
              </Box>
            </>
          )}
        </Alert>
      )}

      <label htmlFor="file-upload">
        <StyledInput
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls"
        />
        <UploadBox>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="body1">
              {selectedFile ? selectedFile.name : 'Cliquez ou glissez-déposez un fichier Excel'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Formats acceptés: .xlsx, .xls
            </Typography>
          </Box>
        </UploadBox>
      </label>
    </Box>
  );
};

export default BulkBarqueImport;
