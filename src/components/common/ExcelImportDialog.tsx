import React, { useState, useRef } from 'react';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { BaseDialog } from '../ui/Dialog/BaseDialog';

interface ExcelImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  title?: string;
  acceptedFileTypes?: string;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  open,
  onClose,
  onImport,
  title = 'Importer un fichier Excel',
  acceptedFileTypes = '.xlsx,.xls',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (acceptedFileTypes.includes(`.${fileType}`)) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Type de fichier non supporté');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = async () => {
    if (selectedFile) {
      setIsUploading(true);
      setError('');
      try {
        await onImport(selectedFile);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const dialogActions = (
    <>
      <Button onClick={onClose}>Annuler</Button>
      <Button
        onClick={handleImport}
        variant="contained"
        color="primary"
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? 'Importation...' : 'Importer'}
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={dialogActions}
      maxWidth="sm"
      fullWidth
    >
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedFileTypes}
          style={{ display: 'none' }}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 2 }} />
        {isUploading ? (
          <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
            <CircularProgress size={20} />
            <Typography>Importation en cours...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Glissez-déposez votre fichier ici
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              ou cliquez pour sélectionner
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Formats acceptés : {acceptedFileTypes}
            </Typography>
          </>
        )}
        {selectedFile && !isUploading && (
          <Typography color="primary" sx={{ mt: 2 }}>
            Fichier sélectionné : {selectedFile.name}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </BaseDialog>
  );
};
