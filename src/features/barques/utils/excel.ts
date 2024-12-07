import * as XLSX from 'xlsx';
import type { Barque } from '@/types/Barque';

interface ExcelBarque {
  Affiliation: string;
  Immatriculation: string;
  'Nom de Barque': string;
  [key: string]: string;
}

export class ExcelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelValidationError';
  }
}

export const validateExcelStructure = (worksheet: XLSX.WorkSheet): void => {
  const requiredColumns = ['Affiliation', 'Immatriculation', 'Nom de Barque'];
  const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];

  if (!headers || headers.length === 0) {
    throw new ExcelValidationError('Le fichier Excel est vide ou mal formaté');
  }

  for (const column of requiredColumns) {
    if (!headers.includes(column)) {
      throw new ExcelValidationError(
        `Colonne requise manquante: ${column}. Format attendu: Affiliation, Immatriculation, Nom de Barque`
      );
    }
  }
};

export const validateBarqueData = (data: ExcelBarque): string[] => {
  const errors: string[] = [];

  if (!data.Affiliation?.trim()) {
    errors.push('L\'affiliation est requise');
  }

  if (!data.Immatriculation?.trim()) {
    errors.push('L\'immatriculation est requise');
  } else if (!/^\d{2}\/\d{1,2}-\d{3}$/.test(data.Immatriculation.trim())) {
    errors.push('Format d\'immatriculation invalide (ex: 12/3-456)');
  }

  if (!data['Nom de Barque']?.trim()) {
    errors.push('Le nom de la barque est requis');
  }

  return errors;
};

export const processExcelFile = async (file: File): Promise<Partial<Barque>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Erreur lors de la lecture du fichier');
        }

        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Validate structure
        validateExcelStructure(worksheet);

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<ExcelBarque>(worksheet);

        if (jsonData.length === 0) {
          throw new Error('Aucune donnée trouvée dans le fichier');
        }

        // Validate and transform data
        const barques: Partial<Barque>[] = [];
        const errors: { row: number; errors: string[] }[] = [];

        jsonData.forEach((row, index) => {
          const rowErrors = validateBarqueData(row);
          if (rowErrors.length > 0) {
            errors.push({ row: index + 2, errors: rowErrors }); // +2 for Excel row number (1-based + header)
          } else {
            barques.push({
              nomBarque: row['Nom de Barque'].trim(),
              immatriculation: row.Immatriculation.trim(),
              portAttache: row.Affiliation.trim(),
              isActive: true
            });
          }
        });

        if (errors.length > 0) {
          const errorMessage = errors
            .map(({ row, errors }) => `Ligne ${row}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Erreurs de validation:\n${errorMessage}`);
        }

        resolve(barques);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsArrayBuffer(file);
  });
};
