import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Manager } from '../../types/User';

interface GerantDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (gerant: Manager, newPassword?: string) => Promise<void>;
  gerant?: Manager;
  isNew?: boolean;
}

export const GerantDialog: React.FC<GerantDialogProps> = ({
  open,
  onClose,
  onSave,
  gerant,
  isNew = false,
}) => {
  const [formData, setFormData] = useState<Manager>({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'gerant',
    assignedBarques: [],
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (gerant) {
      setFormData(gerant);
    } else {
      setFormData({
        id: '',
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: 'gerant',
        assignedBarques: [],
      });
    }
    setPassword('');
    setErrors({});
  }, [gerant]);

  const handleChange = (field: keyof Manager) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }
    if (isNew && !password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password && password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSave(formData, password || undefined);
        onClose();
      } catch (error) {
        console.error('Error saving gérant:', error);
        setErrors((prev) => ({
          ...prev,
          submit: 'Erreur lors de la sauvegarde',
        }));
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isNew ? 'Nouveau Gérant' : 'Modifier le Gérant'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nom"
            value={formData.nom}
            onChange={handleChange('nom')}
            error={!!errors.nom}
            helperText={errors.nom}
            fullWidth
            required
          />
          <TextField
            label="Prénom"
            value={formData.prenom}
            onChange={handleChange('prenom')}
            error={!!errors.prenom}
            helperText={errors.prenom}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
          <TextField
            label="Téléphone"
            value={formData.telephone}
            onChange={handleChange('telephone')}
            error={!!errors.telephone}
            helperText={errors.telephone}
            fullWidth
            required
          />
          <FormControl variant="outlined" error={!!errors.password}>
            <InputLabel htmlFor="password">
              {isNew ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}
            </InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: '',
                  }));
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={isNew ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}
              required={isNew}
            />
            {errors.password && (
              <FormHelperText>{errors.password}</FormHelperText>
            )}
          </FormControl>
          {errors.submit && (
            <FormHelperText error>{errors.submit}</FormHelperText>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isNew ? 'Créer' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
