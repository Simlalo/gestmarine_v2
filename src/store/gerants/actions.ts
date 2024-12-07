import { createAsyncThunk } from '@reduxjs/toolkit';
import { Gerant } from '../../types/User';
import { RootState } from '../types';
import { 
  setLoading, 
  setError, 
  setGerants, 
  addGerant, 
  updateGerant, 
  deleteGerant, 
  assignBarques,
  removeBarqueAssignment 
} from './slice';

export const fetchGerants = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'gerants/fetchGerants',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/gerants');
      const data = await response.json();
      dispatch(setGerants(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch gerants'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createGerant = createAsyncThunk<
  void,
  Partial<Gerant>,
  { state: RootState }
>(
  'gerants/createGerant',
  async (gerantData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/gerants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gerantData),
      });
      const data = await response.json();
      dispatch(addGerant(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create gerant'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateGerantDetails = createAsyncThunk<
  void,
  { id: string; gerantData: Partial<Gerant> },
  { state: RootState }
>(
  'gerants/updateGerantDetails',
  async ({ id, gerantData }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch(`/api/gerants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gerantData),
      });
      const data = await response.json();
      dispatch(updateGerant(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update gerant'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const removeGerant = createAsyncThunk<
  void,
  string,
  { state: RootState }
>(
  'gerants/removeGerant',
  async (id, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      await fetch(`/api/gerants/${id}`, {
        method: 'DELETE',
      });
      dispatch(deleteGerant(id));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete gerant'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const assignBarquesToGerant = createAsyncThunk<
  void,
  { gerantId: string; barqueIds: string[] },
  { state: RootState }
>(
  'gerants/assignBarquesToGerant',
  async ({ gerantId, barqueIds }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      await fetch(`/api/gerants/${gerantId}/assign-barques`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barqueIds }),
      });
      dispatch(assignBarques({ gerantId, barqueIds }));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to assign barques'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const removeBarqueFromGerant = createAsyncThunk<
  void,
  { gerantId: string; barqueId: string },
  { state: RootState }
>(
  'gerants/removeBarqueFromGerant',
  async ({ gerantId, barqueId }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      await fetch(`/api/gerants/${gerantId}/remove-barque/${barqueId}`, {
        method: 'DELETE',
      });
      dispatch(removeBarqueAssignment({ gerantId, barqueId }));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to remove barque assignment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
