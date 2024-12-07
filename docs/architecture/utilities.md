# Utilities and Helpers

This guide outlines utility functions and helper methods used in the GestMarine application.

## Date Utilities

### 1. Date Formatting

```typescript
// utils/date/formatters.ts
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const dateUtils = {
  formatDate: (date: string | Date, formatStr = 'dd/MM/yyyy') => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr, { locale: fr });
  },

  formatDateTime: (date: string | Date) => {
    return dateUtils.formatDate(date, 'dd/MM/yyyy HH:mm');
  },

  formatRelative: (date: string | Date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInHours = differenceInHours(now, parsedDate);

    if (diffInHours < 24) {
      return format(parsedDate, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return format(parsedDate, 'dd/MM/yyyy');
    }
  }
};
```

### 2. Date Validation

```typescript
// utils/date/validators.ts
export const dateValidators = {
  isValidDate: (date: string): boolean => {
    const parsedDate = parseISO(date);
    return isValid(parsedDate);
  },

  isFutureDate: (date: string | Date): boolean => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isFuture(parsedDate);
  },

  isPastDate: (date: string | Date): boolean => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isPast(parsedDate);
  },

  isWithinRange: (date: string | Date, start: Date, end: Date): boolean => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isWithinInterval(parsedDate, { start, end });
  }
};
```

## Number Utilities

### 1. Number Formatting

```typescript
// utils/number/formatters.ts
export const numberUtils = {
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  },

  formatNumber: (value: number, decimals = 2): string => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },

  formatPercentage: (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  }
};
```

### 2. Number Validation

```typescript
// utils/number/validators.ts
export const numberValidators = {
  isNumeric: (value: any): boolean => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  isPositive: (value: number): boolean => {
    return value > 0;
  },

  isWithinRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  roundToDecimal: (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
};
```

## String Utilities

### 1. String Formatting

```typescript
// utils/string/formatters.ts
export const stringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  normalizeString: (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
};
```

### 2. String Validation

```typescript
// utils/string/validators.ts
export const stringValidators = {
  isEmail: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  isPhoneNumber: (value: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(value);
  },

  isPostalCode: (value: string): boolean => {
    const postalCodeRegex = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;
    return postalCodeRegex.test(value);
  },

  containsSpecialChars: (value: string): boolean => {
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharsRegex.test(value);
  }
};
```

## Array Utilities

### 1. Array Manipulation

```typescript
// utils/array/manipulators.ts
export const arrayUtils = {
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      return {
        ...result,
        [groupKey]: [...(result[groupKey] || []), item]
      };
    }, {} as Record<string, T[]>);
  },

  sortBy: <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  },

  uniqueBy: <T>(array: T[], key: keyof T): T[] => {
    return Array.from(
      new Map(array.map(item => [item[key], item])).values()
    );
  },

  chunk: <T>(array: T[], size: number): T[][] => {
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = [];
      }
      chunks[chunkIndex].push(item);
      return chunks;
    }, [] as T[][]);
  }
};
```

### 2. Array Validation

```typescript
// utils/array/validators.ts
export const arrayValidators = {
  hasLength: <T>(array: T[], length: number): boolean => {
    return array.length === length;
  },

  isEmpty: <T>(array: T[]): boolean => {
    return array.length === 0;
  },

  containsValue: <T>(array: T[], value: T): boolean => {
    return array.includes(value);
  },

  allMatch: <T>(array: T[], predicate: (item: T) => boolean): boolean => {
    return array.every(predicate);
  }
};
```

## Object Utilities

### 1. Object Manipulation

```typescript
// utils/object/manipulators.ts
export const objectUtils = {
  pick: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    return keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: obj[key]
      }),
      {} as Pick<T, K>
    );
  },

  omit: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },

  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  flatten: (obj: object, prefix = ''): Record<string, any> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        return { ...acc, ...objectUtils.flatten(value, newKey) };
      }
      return { ...acc, [newKey]: value };
    }, {});
  }
};
```

## Best Practices

1. **Type Safety**
   - Use TypeScript generics
   - Define proper interfaces
   - Handle edge cases
   - Validate inputs

2. **Performance**
   - Optimize algorithms
   - Cache results
   - Use memoization
   - Handle large datasets

3. **Maintainability**
   - Write clear documentation
   - Use descriptive names
   - Follow single responsibility
   - Write unit tests

4. **Error Handling**
   - Validate inputs
   - Handle edge cases
   - Provide clear error messages
   - Use proper error types

Remember to:
- Write comprehensive tests
- Document edge cases
- Handle errors gracefully
- Use TypeScript features
- Follow consistent patterns
