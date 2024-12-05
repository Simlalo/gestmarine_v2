import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { CreateGerantDTO } from '../../types/User';

interface GerantFormProps {
  onAddGerant: (gerant: CreateGerantDTO) => void;
}

const GerantForm: React.FC<GerantFormProps> = ({ onAddGerant }) => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGerant({
      prenom,
      nom,
      email,
      telephone,
      password,
    });
    // Reset form
    setPrenom('');
    setNom('');
    setEmail('');
    setTelephone('');
    setPassword('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Ajouter un Gérant
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GerantForm;
