import { ApiError } from '@/api/errors';
import type { Barque } from '@/types/Barque';

interface UploadResponse {
  barques: Barque[];
  errors?: string[];
}

export const validateBarqueData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.nomBarque) errors.push('Nom de barque est requis');
  if (!data.immatriculation) errors.push('Immatriculation est requise');
  if (!data.portAttache) errors.push('Port d\'attache est requis');
  
  return errors;
};

export const processBarqueFile = async (file: File): Promise<UploadResponse> => {
  if (!file) {
    throw new ApiError('No file provided', 400);
  }

  // Validate file type
  if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
    throw new ApiError('Invalid file format. Only CSV and XLSX files are supported.', 400);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/barques/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message || 'Upload failed', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to process file', 500);
  }
};

export const validateAndUploadBarques = async (file: File): Promise<UploadResponse> => {
  try {
    // Process the file
    const result = await processBarqueFile(file);
    
    // Validate each barque
    const errors: string[] = [];
    result.barques.forEach((barque, index) => {
      const barqueErrors = validateBarqueData(barque);
      if (barqueErrors.length > 0) {
        errors.push(`Row ${index + 1}: ${barqueErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      return { barques: [], errors };
    }

    return result;
  } catch (error) {
    throw error instanceof ApiError 
      ? error 
      : new ApiError('Failed to validate and upload barques', 500);
  }
};
