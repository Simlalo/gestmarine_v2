# Common Hooks

This directory contains documentation for common, reusable hooks used throughout the GestMarine application.

## Available Hooks

### [useDialog](./useDialog.md)
Manages dialog/modal state and associated data. Provides a simple interface for opening, closing, and toggling dialogs with optional data passing.

### [useForm](./useForm.md)
Comprehensive form management hook that handles form state, validation, touched fields, and submission logic with TypeScript support.

### [useTable](./useTable.md)
Table management hook that provides functionality for sorting, filtering, pagination, and row selection in data tables.

## Usage Guidelines

1. **Importing Hooks**
   ```typescript
   import { useDialog, useForm, useTable } from '@/hooks/common';
   ```

2. **Combining Hooks**
   ```typescript
   const MyComponent = () => {
     const dialog = useDialog();
     const form = useForm({...});
     const table = useTable({...});
     
     // Component implementation
   };
   ```

3. **Type Safety**
   - All hooks are fully typed
   - Use TypeScript generics for better type inference
   - Provide proper interfaces for data structures

## Best Practices

1. **State Management**
   - Use hooks at the appropriate component level
   - Avoid prop drilling by using hooks closer to where they're needed
   - Consider using context for deeply nested components

2. **Performance**
   - Memoize callbacks and computed values
   - Use proper dependency arrays in effects
   - Avoid unnecessary re-renders

3. **Error Handling**
   - Implement proper error boundaries
   - Handle edge cases gracefully
   - Provide meaningful error messages

## Contributing

When adding new common hooks:
1. Follow the established documentation pattern
2. Include comprehensive examples
3. Document type definitions
4. Add proper error handling
5. Consider performance implications
