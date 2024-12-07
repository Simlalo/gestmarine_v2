import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { CreateGerantDTO } from '../../../types/User';
import { FormField } from '../../../components/ui/Form/FormField';

interface GerantFormProps {
  onAddGerant: (gerant: CreateGerantDTO) => void;
}

export const GerantForm: React.FC<GerantFormProps> = ({ onAddGerant }) => {
  const [formData, setFormData] = useState<CreateGerantDTO>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }
    if (!formData.password) {
      console.error('Password is required.');
      return; 
    } else if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddGerant(formData);
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        password: '',
      });
    }
  };

  const handleChange = (field: keyof CreateGerantDTO) => (
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      <FormField
        label="Prénom"
        value={formData.prenom}
        onChange={handleChange('prenom')}
        error={errors.prenom}
        required
        fullWidth
      />
      <FormField
        label="Nom"
        value={formData.nom}
        onChange={handleChange('nom')}
        error={errors.nom}
        required
        fullWidth
      />
      <FormField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
        fullWidth
      />
      <FormField
        label="Téléphone"
        value={formData.telephone}
        onChange={handleChange('telephone')}
        error={errors.telephone}
        required
        fullWidth
      />
      <FormField
        label="Mot de passe"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        required
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Ajouter le gérant
      </Button>
    </Box>
  );
};
