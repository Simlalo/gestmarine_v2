# Form and Dialog Integration Examples

## Basic Form Dialog

### Create/Edit Dialog
```tsx
interface UserFormData {
  name: string;
  email: string;
  role: string;
}

interface UserFormDialogProps {
  user?: User;
  onSave: (data: UserFormData) => Promise<void>;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ user, onSave }) => {
  const dialog = useDialog();
  const form = useForm<UserFormData>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'user'
    },
    validate: (values) => {
      const errors: Partial<UserFormData> = {};
      
      if (!values.name) errors.name = 'Name is required';
      if (!values.email) errors.email = 'Email is required';
      
      return errors;
    },
    onSubmit: async (values) => {
      await onSave(values);
      dialog.close();
    }
  });

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      title={user ? 'Edit User' : 'Create User'}
    >
      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={form.values.name}
            onChange={form.handleChange}
            error={!!form.errors.name}
            helperText={form.errors.name}
            fullWidth
            margin="normal"
          />
          
          <TextField
            name="email"
            label="Email"
            value={form.values.email}
            onChange={form.handleChange}
            error={!!form.errors.email}
            helperText={form.errors.email}
            fullWidth
            margin="normal"
          />
          
          <Select
            name="role"
            label="Role"
            value={form.values.role}
            onChange={form.handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={dialog.close}>
            Cancel
          </Button>
          <Button 
            type="submit"
            color="primary"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

## Multi-Step Form Dialog

### Wizard Dialog
```tsx
interface WizardStep {
  label: string;
  component: React.ComponentType<{
    onNext: (data: any) => void;
    onBack: () => void;
  }>;
  validate?: (data: any) => Promise<any>;
}

interface WizardDialogProps {
  steps: WizardStep[];
  onComplete: (data: any) => Promise<void>;
}

const WizardDialog: React.FC<WizardDialogProps> = ({ steps, onComplete }) => {
  const dialog = useDialog();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const handleNext = async (stepData: any) => {
    const updatedData = {
      ...formData,
      ...stepData
    };
    
    // Validate current step
    if (steps[activeStep].validate) {
      try {
        await steps[activeStep].validate(stepData);
      } catch (error) {
        // Handle validation error
        return;
      }
    }
    
    if (activeStep === steps.length - 1) {
      // Last step - complete the wizard
      await onComplete(updatedData);
      dialog.close();
    } else {
      setFormData(updatedData);
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stepper activeStep={activeStep}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      
      <DialogContent>
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
        />
      </DialogContent>
    </Dialog>
  );
};

// Example Usage
const RegistrationWizard = () => {
  const steps: WizardStep[] = [
    {
      label: 'Personal Info',
      component: PersonalInfoStep,
      validate: async (data) => {
        // Validation logic
      }
    },
    {
      label: 'Account Setup',
      component: AccountSetupStep,
      validate: async (data) => {
        // Validation logic
      }
    },
    {
      label: 'Preferences',
      component: PreferencesStep
    }
  ];

  return (
    <WizardDialog
      steps={steps}
      onComplete={async (data) => {
        await registerUser(data);
      }}
    />
  );
};
```

## Form Dialog with Dynamic Content

### Dynamic Form Dialog
```tsx
interface DynamicFormField {
  name: string;
  type: 'text' | 'select' | 'date';
  label: string;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    custom?: (value: any) => Promise<string | undefined>;
  };
}

interface DynamicFormDialogProps {
  title: string;
  fields: DynamicFormField[];
  onSubmit: (data: any) => Promise<void>;
}

const DynamicFormDialog: React.FC<DynamicFormDialogProps> = ({
  title,
  fields,
  onSubmit
}) => {
  const dialog = useDialog();
  const form = useForm({
    initialValues: fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: ''
    }), {}),
    validate: async (values) => {
      const errors: Record<string, string> = {};
      
      for (const field of fields) {
        const value = values[field.name];
        const validation = field.validation;
        
        if (validation?.required && !value) {
          errors[field.name] = `${field.label} is required`;
          continue;
        }
        
        if (validation?.pattern && !validation.pattern.test(value)) {
          errors[field.name] = `Invalid ${field.label.toLowerCase()} format`;
          continue;
        }
        
        if (validation?.custom) {
          const error = await validation.custom(value);
          if (error) {
            errors[field.name] = error;
          }
        }
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      await onSubmit(values);
      dialog.close();
    }
  });

  const renderField = (field: DynamicFormField) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            key={field.name}
            name={field.name}
            label={field.label}
            value={form.values[field.name]}
            onChange={form.handleChange}
            error={!!form.errors[field.name]}
            fullWidth
            margin="normal"
          >
            {field.options?.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      
      case 'date':
        return (
          <DatePicker
            key={field.name}
            name={field.name}
            label={field.label}
            value={form.values[field.name]}
            onChange={(date) => form.setFieldValue(field.name, date)}
            error={!!form.errors[field.name]}
            fullWidth
            margin="normal"
          />
        );
      
      default:
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={form.values[field.name]}
            onChange={form.handleChange}
            error={!!form.errors[field.name]}
            helperText={form.errors[field.name]}
            fullWidth
            margin="normal"
          />
        );
    }
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      title={title}
    >
      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          {fields.map(renderField)}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={dialog.close}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={form.isSubmitting}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

## Best Practices and Tips

### 1. Form State Management
- Keep form state separate from dialog state
- Handle form cleanup on dialog close
- Implement proper validation timing

### 2. Error Handling
```tsx
const FormDialogWithError = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const handleSubmit = async (data: any) => {
    try {
      await submitData(data);
    } catch (error) {
      setError(error);
      // Keep dialog open to show error
      return;
    }
    // Close dialog only on success
    dialog.close();
  };

  return (
    <Dialog>
      {error && (
        <Alert severity="error">
          {error.message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit} />
    </Dialog>
  );
};
```

### 3. Performance Considerations
- Memoize callbacks and handlers
- Optimize re-renders
- Handle large forms efficiently

### 4. Testing
```tsx
describe('Form Dialog Integration', () => {
  it('should handle form submission', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <FormDialog onSubmit={onSubmit} />
    );
    
    // Fill form
    await userEvent.type(getByLabelText(/name/i), 'John Doe');
    await userEvent.type(getByLabelText(/email/i), 'john@example.com');
    
    // Submit form
    await userEvent.click(getByText(/submit/i));
    
    // Verify submission
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    // Verify dialog closed
    expect(getByText(/submit/i)).not.toBeInTheDocument();
  });
});
