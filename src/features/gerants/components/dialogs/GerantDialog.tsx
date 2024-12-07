import React, { useState } from 'react';
import {
  Button,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Gerant } from '../../../../types/User';
import { BaseDialog } from '../../../../components/ui/Dialog/BaseDialog';
import { FormField } from '../../../../components/ui/Form/FormField';

interface GerantDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (gerant: Partial<Gerant>) => void;
  gerant?: Gerant;
  isNew?: boolean;
}

export const GerantDialog: React.FC<GerantDialogProps> = ({
  open,
  onClose,
  onSave,
  gerant,
  isNew = false,
}) => {
  const [formData, setFormData] = useState<Partial<Gerant>>(
    gerant || {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
    }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom?.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.prenom?.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    if (!formData.telephone?.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }
    if (isNew && !formData.password?.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof Gerant) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const dialogActions = (
    <>
      <Button onClick={onClose}>Annuler</Button>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        {isNew ? 'Créer' : 'Modifier'}
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={isNew ? 'Nouveau gérant' : 'Modifier le gérant'}
      actions={dialogActions}
      maxWidth="sm"
      fullWidth
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <FormField
          label="Nom"
          value={formData.nom || ''}
          onChange={handleChange('nom')}
          error={errors.nom}
          required
          fullWidth
        />
        <FormField
          label="Prénom"
          value={formData.prenom || ''}
          onChange={handleChange('prenom')}
          error={errors.prenom}
          required
          fullWidth
        />
        <FormField
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange('email')}
          error={errors.email}
          required
          fullWidth
        />
        <FormField
          label="Téléphone"
          value={formData.telephone || ''}
          onChange={handleChange('telephone')}
          error={errors.telephone}
          required
          fullWidth
        />
        {isNew && (
          <FormField
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={formData.password || ''}
            onChange={handleChange('password')}
            error={errors.password}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Box>
    </BaseDialog>
  );
};
