import React from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface BarquesHeaderProps {
  onAddClick: () => void;
  onImportClick: () => void;
  isGerant?: boolean;
  selectedCount: number;
}

export const BarquesHeader: React.FC<BarquesHeaderProps> = ({
  onAddClick,
  onImportClick,
  isGerant = false,
  selectedCount
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5">Barques</Typography>
        {selectedCount > 0 && (
          <Typography variant="subtitle1" color="primary">
            ({selectedCount} sélectionné{selectedCount > 1 ? 's' : ''})
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2 }}>
        {isGerant && (
          <>
            <Button
              variant="outlined"
              onClick={onImportClick}
              startIcon={<CloudUploadIcon />}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "Import" : "Importer"}
            </Button>
            <Button
              variant="contained"
              onClick={onAddClick}
              startIcon={<AddIcon />}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "+" : "Ajouter"}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
