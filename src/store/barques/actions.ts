import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Barque, CreateBarquePayload, UpdateBarquePayload, BarqueStatus } from '@/types/Barque';
import { apiClient } from '@/api/client';
import { ApiError } from '@/api/errors';

// Action Types
export const FETCH_BARQUES = 'barques/fetchBarques';
export const CREATE_BARQUE = 'barques/createBarque';
export const UPDATE_BARQUE = 'barques/updateBarque';
export const REMOVE_BARQUE = 'barques/removeBarque';
export const ASSIGN_GERANT_TO_BARQUE = 'barques/assignGerantToBarque';
export const UPDATE_BARQUE_STATUS = 'barques/updateStatus';
export const BULK_IMPORT = 'barques/bulkImport';

// Async Thunks
export const fetchBarques = createAsyncThunk(
  FETCH_BARQUES,
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Barque[]>('/barques');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch barques');
    }
  }
);

export const createBarque = createAsyncThunk(
  CREATE_BARQUE,
  async (barque: CreateBarquePayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Barque>('/barques', barque);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create barque');
    }
  }
);

export const updateBarque = createAsyncThunk(
  UPDATE_BARQUE,
  async ({ id, updates }: { id: string; updates: UpdateBarquePayload }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Barque>(`/barques/${id}`, updates);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update barque');
    }
  }
);

export const updateBarqueStatus = createAsyncThunk(
  UPDATE_BARQUE_STATUS,
  async ({ id, status }: { id: string; status: BarqueStatus }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Barque>(`/barques/${id}/status`, { status });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update barque status');
    }
  }
);

export const removeBarque = createAsyncThunk(
  REMOVE_BARQUE,
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/barques/${id}`);
      return id;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete barque');
    }
  }
);

export const assignGerantToBarque = createAsyncThunk(
  ASSIGN_GERANT_TO_BARQUE,
  async ({ id, gerantId }: { id: string; gerantId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Barque>(`/barques/${id}/gerant`, { gerantId });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to assign gérant to barque');
    }
  }
);

export const bulkImportBarques = createAsyncThunk(
  BULK_IMPORT,
  async (barques: CreateBarquePayload[], { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Barque[]>('/barques/bulk', { barques });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to bulk import barques');
    }
  }
);
