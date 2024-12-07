import { Box, Typography, IconButton, Button, Alert, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Barque } from '@/types/Barque';
import { BarqueImportRow, validateBarqueData, ExcelValidationError } from '@/types/BarqueImport';

interface BulkBarqueImportProps {
  onImport: (barques: Partial<Barque>[]) => Promise<void>;
  onClose?: () => void;
}

export const BulkBarqueImport: React.FC<BulkBarqueImportProps> = ({
  onImport,
  onClose
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    setSuccess(false);
    
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        handleFileUpload(selectedFile);
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
        setFile(null);
      }
    }
  };

  const processExcelData = (worksheet: XLSX.WorkSheet): BarqueImportRow[] => {
    const data = XLSX.utils.sheet_to_json<any>(worksheet);
    const errors: string[] = [];
    
    // Validate column headers
    const requiredColumns = ['affiliation', 'immatriculation', 'Nom de la barque', "Port d'attache"];
    const headers = Object.keys(data[0] || {});
    const missingColumns = requiredColumns.filter(col => 
      !headers.some(h => h.toLowerCase() === col.toLowerCase())
    );

    if (missingColumns.length > 0) {
      throw new ExcelValidationError(
        `Colonnes manquantes: ${missingColumns.join(', ')}\n` +
        'Format attendu: A: affiliation, B: immatriculation, C: nom de barque, D: port d\'attache'
      );
    }

    // Validate each row
    data.forEach((row, index) => {
      const rowErrors = validateBarqueData(row);
      if (rowErrors.length > 0) {
        errors.push(`Ligne ${index + 2}: ${rowErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      throw new ExcelValidationError(`Erreurs de validation:\n${errors.join('\n')}`);
    }

    return data as BarqueImportRow[];
  };

  const handleFileUpload = async (selectedFile: File) => {
    if (!onImport) {
      setError('Configuration d\'importation non valide');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const importData = processExcelData(worksheet);
          
          const barques: Partial<Barque>[] = importData.map(row => ({
            nomBarque: row['Nom de la barque'],
            immatriculation: row.immatriculation,
            portAttache: row["Port d'attache"],
            affiliation: row.affiliation,
            isActive: true,
          }));

          await onImport(barques);
          setSuccess(true);
          
          // Close dialog after successful import
          if (onClose) {
            setTimeout(onClose, 1500);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          if (error instanceof ExcelValidationError) {
            setError(error.message);
          } else {
            setError('Erreur lors du traitement du fichier');
          }
        }
        setLoading(false);
      };

      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier');
        setLoading(false);
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      setError('Erreur lors de la lecture du fichier');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {onClose && (
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <Typography variant="h6" gutterBottom>
        Import en Masse des Barques
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Import réussi
        </Alert>
      )}

      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={loading}
        />

        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <CircularProgress size={20} />
            <Typography>Traitement en cours...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Glissez-déposez votre fichier Excel ici
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              ou cliquez pour sélectionner
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block">
              Format attendu: A: affiliation, B: immatriculation, C: nom de barque, D: port d'attache
            </Typography>
          </>
        )}

        {file && !loading && (
          <Typography color="primary" sx={{ mt: 2 }}>
            Fichier sélectionné : {file.name}
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => document.getElementById('file-upload')?.click()}
        sx={{ mt: 2 }}
      >
        Importer
      </Button>
    </Box>
  );
};
