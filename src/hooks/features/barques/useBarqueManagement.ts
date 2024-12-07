import { useState, useCallback } from 'react';
import { Barque } from '../../../types/Barque';
import { useDialog, useTable } from '../../common';

interface UseBarqueManagementOptions {
  initialBarques?: Barque[];
  onCreateBarque?: (barque: Partial<Barque>) => Promise<void>;
  onUpdateBarque?: (id: string, barque: Partial<Barque>) => Promise<void>;
  onDeleteBarque?: (id: string) => Promise<void>;
  onAssignGerant?: (barqueId: string, gerantId: string) => Promise<void>;
}

export const useBarqueManagement = ({
  initialBarques = [],
  onCreateBarque,
  onUpdateBarque,
  onDeleteBarque,
  onAssignGerant,
}: UseBarqueManagementOptions = {}) => {
  const [barques, setBarques] = useState<Barque[]>(initialBarques);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const createDialog = useDialog();
  const editDialog = useDialog();
  const deleteDialog = useDialog();
  const assignGerantDialog = useDialog();

  // Table management
  const table = useTable({
    data: barques,
    getRowId: (row) => row.id,
  });

  // CRUD operations
  const handleCreateBarque = useCallback(async (barqueData: Partial<Barque>) => {
    setLoading(true);
    setError(null);
    try {
      if (onCreateBarque) {
        await onCreateBarque(barqueData);
      }
      createDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create barque');
    } finally {
      setLoading(false);
    }
  }, [onCreateBarque, createDialog]);

  const handleUpdateBarque = useCallback(async (id: string, barqueData: Partial<Barque>) => {
    setLoading(true);
    setError(null);
    try {
      if (onUpdateBarque) {
        await onUpdateBarque(id, barqueData);
      }
      editDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update barque');
    } finally {
      setLoading(false);
    }
  }, [onUpdateBarque, editDialog]);

  const handleDeleteBarque = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (onDeleteBarque) {
        await onDeleteBarque(id);
      }
      deleteDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete barque');
    } finally {
      setLoading(false);
    }
  }, [onDeleteBarque, deleteDialog]);

  const handleAssignGerant = useCallback(async (barqueId: string, gerantId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (onAssignGerant) {
        await onAssignGerant(barqueId, gerantId);
      }
      assignGerantDialog.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign gerant');
    } finally {
      setLoading(false);
    }
  }, [onAssignGerant, assignGerantDialog]);

  return {
    // State
    barques,
    loading,
    error,
    
    // Dialog states
    createDialog,
    editDialog,
    deleteDialog,
    assignGerantDialog,
    
    // Table management
    table,
    
    // CRUD operations
    handleCreateBarque,
    handleUpdateBarque,
    handleDeleteBarque,
    handleAssignGerant,
  };
};
