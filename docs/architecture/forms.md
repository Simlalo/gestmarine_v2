# Form Handling and Validation

This guide outlines form handling and validation patterns used in the GestMarine application.

## Form Hook

### 1. Base Form Hook

```typescript
// hooks/common/useForm.ts
export interface FormConfig<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: Yup.ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: FormConfig<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = async (name: keyof T, value: any) => {
    if (!validationSchema) return;

    try {
      await validationSchema.validateAt(name as string, { [name]: value });
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof T, value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (validationSchema) {
        await validationSchema.validate(values, { abortEarly: false });
      }
      await onSubmit(values);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = err.inner.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path!]: curr.message
          }),
          {}
        );
        setErrors(validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue: (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };
};
```

## Form Components

### 1. Form Field Wrapper

```typescript
// components/common/FormField.tsx
interface FormFieldProps {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  children: React.ReactElement;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  error,
  touched,
  children
}) => {
  const showError = touched && error;
  
  return (
    <FormControl error={!!showError} fullWidth>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      {React.cloneElement(children, {
        id: name,
        'aria-describedby': showError ? `${name}-error` : undefined
      })}
      {showError && (
        <FormHelperText id={`${name}-error`}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};
```

### 2. Custom Form Controls

```typescript
// components/common/form/SelectField.tsx
interface SelectFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched
}) => {
  return (
    <FormField name={name} label={label} error={error} touched={touched}>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormField>
  );
};
```

## Validation Schemas

### 1. Validation Schema Definition

```typescript
// validation/schemas/barque.ts
import * as Yup from 'yup';

export const barqueSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  registrationNumber: Yup.string()
    .required('Registration number is required')
    .matches(
      /^[A-Z]{2}\d{6}$/,
      'Invalid registration number format'
    ),
  
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must not exceed 100'),
  
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'maintenance'])
});
```

## Form Implementation Examples

### 1. Create Form

```typescript
// features/barques/components/BarqueForm.tsx
interface BarqueFormProps {
  initialValues?: Partial<Barque>;
  onSubmit: (values: Barque) => Promise<void>;
}

export const BarqueForm: React.FC<BarqueFormProps> = ({
  initialValues,
  onSubmit
}) => {
  const form = useForm({
    initialValues: {
      name: '',
      registrationNumber: '',
      capacity: 0,
      status: 'active',
      ...initialValues
    },
    validationSchema: barqueSchema,
    onSubmit
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormField
            name="name"
            label="Name"
            error={form.errors.name}
            touched={form.touched.name}
          >
            <TextField
              name="name"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </FormField>
        </Grid>

        <Grid item xs={12}>
          <FormField
            name="registrationNumber"
            label="Registration Number"
            error={form.errors.registrationNumber}
            touched={form.touched.registrationNumber}
          >
            <TextField
              name="registrationNumber"
              value={form.values.registrationNumber}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </FormField>
        </Grid>

        <Grid item xs={12}>
          <FormField
            name="capacity"
            label="Capacity"
            error={form.errors.capacity}
            touched={form.touched.capacity}
          >
            <TextField
              type="number"
              name="capacity"
              value={form.values.capacity}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </FormField>
        </Grid>

        <Grid item xs={12}>
          <SelectField
            name="status"
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'maintenance', label: 'Maintenance' }
            ]}
            value={form.values.status}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.status}
            touched={form.touched.status}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
```

### 2. Form with Array Fields

```typescript
// components/common/form/ArrayField.tsx
interface ArrayFieldProps<T> {
  name: string;
  value: T[];
  onChange: (value: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export const ArrayField = <T,>({
  name,
  value,
  onChange,
  renderItem
}: ArrayFieldProps<T>) => {
  const handleAdd = () => {
    onChange([...value, {} as T]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      {value.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
          <IconButton onClick={() => handleRemove(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <Button onClick={handleAdd}>
        Add Item
      </Button>
    </div>
  );
};
```

## Best Practices

1. **Form Organization**
   - Use consistent validation schemas
   - Implement reusable form components
   - Handle form state properly

2. **Validation**
   - Validate on blur and submit
   - Show clear error messages
   - Handle async validation

3. **User Experience**
   - Show loading states
   - Disable submit while processing
   - Provide clear feedback

4. **Performance**
   - Debounce validation
   - Optimize re-renders
   - Handle large forms

Remember to:
- Validate inputs properly
- Handle form submission states
- Implement proper error handling
- Use TypeScript for type safety
- Test form validation
