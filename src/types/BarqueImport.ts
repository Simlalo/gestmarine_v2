export interface BarqueImportRow {
  affiliation: string;
  immatriculation: string;
  'Nom de la barque': string;
  "Port d'attache": string;
}

export class ExcelValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelValidationError';
  }
}

export const validateBarqueData = (row: any): string[] => {
  const errors: string[] = [];

  // Required field validation
  if (!row['Nom de la barque'] && !row.nomBarque) {
    errors.push('Le nom de la barque est obligatoire');
  }

  if (!row.affiliation) {
    errors.push("L'affiliation est obligatoire");
  }

  if (!row.immatriculation) {
    errors.push("L'immatriculation est obligatoire");
  }

  // Format validation for immatriculation
  const immatriculation = row.immatriculation;
  if (immatriculation && !immatriculation.match(/^10\/[1-4]-\d+$/)) {
    errors.push("Format d'immatriculation invalide (doit être de la forme 10/X-XXX)");
  }

  return errors;
};
