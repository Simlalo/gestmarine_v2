import { useState, useCallback } from 'react';
import { Gerant } from '../../../types/User';
import { Barque } from '../../../types/Barque';
import { useDialog, useTable } from '../../common';

interface UseGerantManagementOptions {
  initialGerants?: Gerant[];
  onCreateGerant?: (gerant: Partial<Gerant>) => Promise<void>;
  onUpdateGerant?: (id: string, gerant: Partial<Gerant>) => Promise<void>;
  onDeleteGerant?: (id: string) => Promise<void>;
  onAssignBarques?: (gerantId: string, barqueIds: string[]) => Promise<void>;
}

export const useGerantManagement = ({
  initialGerants = [],
  onCreateGerant,
  onUpdateGerant,
  onDeleteGerant,
  onAssignBarques,
}: UseGerantManagementOptions = {}) => {
  const [gerants, setGerants] = useState<Gerant[]>(initialGerants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const createDialog = useDialog();
  const editDialog = useDialog();
  const deleteDialog = useDialog();
  const assignBarquesDialog = useDialog();

  // Table management
  const table = useTable({
    data: gerants,
    getRowId: (row) => row.id,
  });

  // CRUD operations
  const handleCreateGerant = useCallback(async (gerantData: Partial<Gerant>) => {
    setLoading(true);
    setError(null);
    try {
      if (onCreateGerant) {
        await onCreateGerant(gerantData);
      }
      createDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gerant');
    } finally {
      setLoading(false);
    }
  }, [onCreateGerant, createDialog]);

  const handleUpdateGerant = useCallback(async (id: string, gerantData: Partial<Gerant>) => {
    setLoading(true);
    setError(null);
    try {
      if (onUpdateGerant) {
        await onUpdateGerant(id, gerantData);
      }
      editDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update gerant');
    } finally {
      setLoading(false);
    }
  }, [onUpdateGerant, editDialog]);

  const handleDeleteGerant = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (onDeleteGerant) {
        await onDeleteGerant(id);
      }
      deleteDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete gerant');
    } finally {
      setLoading(false);
    }
  }, [onDeleteGerant, deleteDialog]);

  const handleAssignBarques = useCallback(async (gerantId: string, barqueIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      if (onAssignBarques) {
        await onAssignBarques(gerantId, barqueIds);
      }
      assignBarquesDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign barques');
    } finally {
      setLoading(false);
    }
  }, [onAssignBarques, assignBarquesDialog]);

  // Utility functions
  const getGerantBarques = useCallback((gerantId: string, barques: Barque[]): Barque[] => {
    return barques.filter(barque => barque.gerantId === gerantId);
  }, []);

  const updateGerantsList = useCallback((newGerants: Gerant[]) => {
    setGerants(newGerants);
  }, []);

  return {
    // State
    gerants,
    loading,
    error,
    
    // Dialog states
    createDialog,
    editDialog,
    deleteDialog,
    assignBarquesDialog,
    
    // Table management
    table,
    
    // CRUD operations
    handleCreateGerant,
    handleUpdateGerant,
    handleDeleteGerant,
    handleAssignBarques,
    
    // Utility functions
    getGerantBarques,
    updateGerantsList,
  };
};
