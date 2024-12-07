# useForm Hook

## Overview
The `useForm` hook provides a comprehensive form management solution for React applications. It handles form state, validation, touched fields, and submission logic with TypeScript support.

- **Purpose**: Manage form state and validation
- **Key Features**:
  - Type-safe form handling
  - Field-level validation
  - Touched fields tracking
  - Dirty state management
  - Custom validation rules

## API Reference

### Input Parameters
```typescript
interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule[]>>;
  onSubmit?: (values: T) => Promise<void> | void;
}

interface ValidationRule {
  validate: (value: any, values: T) => boolean;
  message: string;
}
```

### Return Values
```typescript
interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
```

### Examples

```typescript
// Basic Usage
const MyForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: [
        {
          validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: 'Invalid email format',
        },
      ],
      password: [
        {
          validate: (value) => value.length >= 8,
          message: 'Password must be at least 8 characters',
        },
      ],
    },
    onSubmit: async (values) => {
      // Handle form submission
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        type="email"
        value={form.values.email}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
      
      <input
        type="password"
        value={form.values.password}
        onChange={form.handleChange('password')}
        onBlur={form.handleBlur('password')}
      />
      {form.touched.password && form.errors.password && (
        <span>{form.errors.password}</span>
      )}
      
      <button type="submit" disabled={!form.isValid}>
        Submit
      </button>
    </form>
  );
};
```

## Implementation Details

### Core Functionality
- Form state management using `useState`
- Field-level validation
- Touched fields tracking
- Form-level validation
- Submission handling

### State Management
- Values state for form fields
- Errors state for validation messages
- Touched state for field interactions
- Dirty state for form modifications

### Performance Considerations
- Memoized callbacks with `useCallback`
- Efficient validation handling
- Minimal re-renders
- Type-safe implementation

### Error Handling
- Field-level error messages
- Form-level validation
- Custom error setting
- Type-safe error handling

## Best Practices

### Recommended Usage
1. Initialize with proper types:
   ```typescript
   interface FormValues {
     email: string;
     password: string;
   }
   
   const form = useForm<FormValues>({
     initialValues: {
       email: '',
       password: '',
     },
   });
   ```

2. Implement validation rules:
   ```typescript
   const validationRules = {
     email: [
       {
         validate: (value) => Boolean(value),
         message: 'Email is required',
       },
     ],
   };
   ```

3. Handle form submission:
   ```typescript
   const onSubmit = async (values: FormValues) => {
     try {
       await submitToAPI(values);
     } catch (error) {
       form.setFieldError('submit', error.message);
     }
   };
   ```

### Common Pitfalls
- Not handling async validation properly
- Forgetting to clear errors on successful submission
- Not using proper TypeScript types
- Ignoring touched state for validation display

### Tips and Tricks
1. Custom validation rules:
   ```typescript
   const passwordMatch = {
     validate: (value, values) => value === values.password,
     message: 'Passwords must match',
   };
   ```

2. Dynamic field handling:
   ```typescript
   const handleDynamicChange = (field: string) => (value: any) => {
     form.setFieldValue(field, value);
   };
   ```

3. Form reset with confirmation:
   ```typescript
   const handleReset = () => {
     if (form.isDirty && window.confirm('Discard changes?')) {
       form.resetForm();
     }
   };
   ```
