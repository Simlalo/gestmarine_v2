import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GerantTable, GerantForm } from '../components';
import type { Gerant } from '..';
import type { Barque } from '../../barques';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '../../../components/ui/Dialog';

const GerantsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGerant, setEditingGerant] = useState<Gerant | null>(null);
  const queryClient = useQueryClient();

  // Fetch gerants
  const { data: gerants = [] } = useQuery<Gerant[]>({
    queryKey: ['gerants'],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await fetch('/api/gerants');
      return response.json();
    },
  });

  // Fetch barques
  const { data: barques = [] } = useQuery<Barque[]>({
    queryKey: ['barques'],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await fetch('/api/barques');
      return response.json();
    },
  });

  // Mutations
  const createGerantMutation = useMutation({
    mutationFn: async (newGerant: Omit<Gerant, 'id'>) => {
      const response = await fetch('/api/gerants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGerant),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gerants'] });
      setIsCreateDialogOpen(false);
    },
  });

  const updateGerantMutation = useMutation({
    mutationFn: async (updatedGerant: Gerant) => {
      const response = await fetch(`/api/gerants/${updatedGerant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGerant),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gerants'] });
      setEditingGerant(null);
    },
  });

  const deleteGerantMutation = useMutation({
    mutationFn: async (gerantId: string) => {
      await fetch(`/api/gerants/${gerantId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gerants'] });
    },
  });

  const handleCreateGerant = (gerantData: Omit<Gerant, 'id'>) => {
    createGerantMutation.mutate(gerantData);
  };

  const handleUpdateGerant = (gerantData: Gerant) => {
    updateGerantMutation.mutate(gerantData);
  };

  const handleDeleteGerant = (gerantId: string) => {
    if (window.confirm('Are you sure you want to delete this gerant?')) {
      deleteGerantMutation.mutate(gerantId);
    }
  };

  const handleAssignBarques = async (gerantId: string, barqueIds: string[]) => {
    // Implement barque assignment logic
    await fetch(`/api/gerants/${gerantId}/barques`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barqueIds }),
    });
    queryClient.invalidateQueries({ queryKey: ['gerants'] });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Gerant
        </Button>
      </Box>

      <GerantTable
        gerants={gerants}
        barques={barques}
        onEditGerant={setEditingGerant}
        onDeleteGerant={handleDeleteGerant}
        onAssignBarques={handleAssignBarques}
      />

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Create New Gerant"
      >
        <GerantForm onSubmit={handleCreateGerant} />
      </Dialog>

      <Dialog
        open={!!editingGerant}
        onClose={() => setEditingGerant(null)}
        title="Edit Gerant"
      >
        {editingGerant && (
          <GerantForm
            initialData={editingGerant}
            onSubmit={handleUpdateGerant}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default GerantsPage;
