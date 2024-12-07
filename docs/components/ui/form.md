# Form Components

## FormField

A flexible form field wrapper that provides consistent styling, validation, and error handling for form inputs.

### Props API Reference

```typescript
interface FormFieldProps {
  // Required Props
  name: string;                    // Field name for form state
  label: string;                   // Field label text
  
  // Optional Props
  required?: boolean;              // Whether field is required
  error?: string;                  // Error message
  helperText?: string;            // Helper text below field
  fullWidth?: boolean;            // Whether field takes full width
  disabled?: boolean;             // Disable field
  children?: ReactNode;           // Field input component
}
```

### Form Components

1. **FormInput**
```typescript
interface FormInputProps extends FormFieldProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  onChange?: (value: string) => void;
}
```

2. **FormSelect**
```typescript
interface FormSelectProps extends FormFieldProps {
  options: Array<{ value: string | number; label: string }>;
  multiple?: boolean;
  native?: boolean;
  onChange?: (value: string | string[]) => void;
}
```

3. **FormCheckbox**
```typescript
interface FormCheckboxProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
```

### Usage Examples

#### Basic Form
```tsx
import { Form, FormInput, FormSelect } from '@/components/ui/Form';

function BasicForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      type: '',
    },
  });

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        name="name"
        label="Name"
        required
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
      />
      <FormSelect
        name="type"
        label="Type"
        options={[
          { value: 'type1', label: 'Type 1' },
          { value: 'type2', label: 'Type 2' },
        ]}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

#### Form with Validation
```tsx
import { Form, FormInput } from '@/components/ui/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

function ValidatedForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        name="username"
        label="Username"
        error={form.formState.errors.username?.message}
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        error={form.formState.errors.email?.message}
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        error={form.formState.errors.password?.message}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Customization Options

#### Custom Form Field
```tsx
import { FormField } from '@/components/ui/Form';

function CustomFormField() {
  return (
    <FormField
      name="custom"
      label="Custom Input"
    >
      <div className="custom-input">
        {/* Custom input implementation */}
      </div>
    </FormField>
  );
}
```

#### Styled Form Components
```tsx
import { styled } from '@mui/material/styles';

const StyledFormInput = styled(FormInput)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius * 2,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 'bold',
  },
}));
```

### Best Practices

1. **Form Organization**
```tsx
function OrganizedForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormInput name="firstName" label="First Name" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormInput name="lastName" label="Last Name" />
        </Grid>
        {/* Group related fields */}
        <Grid item xs={12}>
          <Typography variant="h6">Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormInput name="email" label="Email" type="email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormInput name="phone" label="Phone" type="tel" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
}
```

2. **Error Handling**
```tsx
function ErrorHandlingForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    try {
      await submitForm(data);
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {serverError && (
        <Alert severity="error">{serverError}</Alert>
      )}
      {/* Form fields */}
    </Form>
  );
}
```

3. **Performance Optimization**
```tsx
function OptimizedForm() {
  const form = useForm({
    mode: 'onBlur', // Validate on blur instead of onChange
  });

  // Memoize expensive computations
  const computedValue = useMemo(() => {
    return expensiveComputation(form.watch('field'));
  }, [form.watch('field')]);

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </Form>
  );
}
```

### Common Pitfalls

1. **Validation Timing**
   - Consider when validation should occur (onChange, onBlur, onSubmit)
   - Handle async validation appropriately
   - Provide immediate feedback for critical fields

2. **Form State Management**
   - Clear form state when necessary
   - Handle form state dependencies correctly
   - Manage complex form state efficiently

3. **Performance**
   - Avoid unnecessary re-renders
   - Use appropriate validation modes
   - Optimize large forms with many fields

### Advanced Usage

#### Dynamic Form Fields
```tsx
function DynamicForm() {
  const { fields, append, remove } = useFieldArray({
    name: 'items',
  });

  return (
    <Form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <FormInput
            name={`items.${index}.name`}
            label={`Item ${index + 1}`}
          />
          <Button onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={() => append({ name: '' })}>
        Add Item
      </Button>
    </Form>
  );
}
```

#### Form with File Upload
```tsx
function FileUploadForm() {
  return (
    <Form>
      <FormField
        name="file"
        label="Upload File"
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
      </FormField>
      <FormField
        name="preview"
        label="Preview"
      >
        {file && <FilePreview file={file} />}
      </FormField>
    </Form>
  );
}
```

### Integration Examples

#### Form in Dialog
```tsx
function DialogForm() {
  const [open, setOpen] = useState(false);
  const form = useForm();

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title="Form Dialog"
    >
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Form>
    </BaseDialog>
  );
}
```

#### Form with Stepper
```tsx
function StepperForm() {
  const [activeStep, setActiveStep] = useState(0);
  const form = useForm();

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Basic Info</StepLabel>
        </Step>
        <Step>
          <StepLabel>Details</StepLabel>
        </Step>
      </Stepper>

      {activeStep === 0 && (
        <div>
          <FormInput name="name" label="Name" />
          <FormInput name="email" label="Email" />
        </div>
      )}

      {activeStep === 1 && (
        <div>
          <FormInput name="details" label="Details" />
        </div>
      )}

      <Button onClick={() => setActiveStep(prev => prev - 1)}>
        Back
      </Button>
      {activeStep === 1 ? (
        <Button type="submit">Submit</Button>
      ) : (
        <Button onClick={() => setActiveStep(prev => prev + 1)}>
          Next
        </Button>
      )}
    </Form>
  );
}
```
