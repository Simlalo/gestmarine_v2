import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { Barque } from '../../types/Barque';
import { FormContainer, FormContent, StyledTextField, FormActions } from '../styled/form';

interface BarqueFormProps {
  onAddBarque: (barque: Omit<Barque, 'id'>) => void;
}

const BarqueForm: React.FC<BarqueFormProps> = ({ onAddBarque }) => {
  const [affiliation, setAffiliation] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [nomBarque, setNomBarque] = useState('');
  const [portAttache, setPortAttache] = useState('');

  const determinePortAttache = (immatriculation: string): string => {
    if (immatriculation.startsWith('10/1')) return 'Boujdour';
    if (immatriculation.startsWith('10/2')) return 'Aghti El Ghazi';
    if (immatriculation.startsWith('10/3')) return 'Aftissat';
    if (immatriculation.startsWith('10/4')) return 'Lakraa';
    return '';
  };

  useEffect(() => {
    const newPortAttache = determinePortAttache(immatriculation);
    setPortAttache(newPortAttache);
  }, [immatriculation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!portAttache) {
      alert('Immatriculation invalide. Le préfixe doit être 10/1, 10/2, 10/3 ou 10/4');
      return;
    }

    onAddBarque({
      affiliation,
      immatriculation,
      nomBarque,
      portAttache,
      isActive: true
    });
    
    // Reset form
    setAffiliation('');
    setImmatriculation('');
    setNomBarque('');
    setPortAttache('');
  };

  return (
    <FormContainer>
      <Typography variant="h6" gutterBottom>
        Ajouter une nouvelle barque
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormContent>
          <StyledTextField
            label="Affiliation"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            required
          />
          <StyledTextField
            label="Immatriculation"
            value={immatriculation}
            onChange={(e) => setImmatriculation(e.target.value)}
            required
            helperText="Format: 10/X-... où X est 1, 2, 3 ou 4"
          />
          <StyledTextField
            label="Nom de la barque"
            value={nomBarque}
            onChange={(e) => setNomBarque(e.target.value)}
            required
          />
          <StyledTextField
            label="Port d'attache"
            value={portAttache}
            disabled
            helperText="Déterminé automatiquement par l'immatriculation"
          />
        </FormContent>
        <FormActions>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </FormActions>
      </form>
    </FormContainer>
  );
};

export default BarqueForm;
