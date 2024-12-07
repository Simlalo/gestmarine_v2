# Advanced Form Examples

## Dynamic Form Generation

### Schema-Based Form
```tsx
interface FormSchema {
  type: 'text' | 'number' | 'select' | 'date';
  name: string;
  label: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: Array<{ label: string; value: any }>;
}

const DynamicSchemaForm = ({ schema }: { schema: FormSchema[] }) => {
  const form = useForm({
    initialValues: schema.reduce((acc, field) => ({
      ...acc,
      [field.name]: ''
    }), {}),
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      schema.forEach(field => {
        const value = values[field.name];
        const validation = field.validation;
        
        if (validation?.required && !value) {
          errors[field.name] = `${field.label} is required`;
        }
        
        if (validation?.min && value < validation.min) {
          errors[field.name] = `Minimum value is ${validation.min}`;
        }
        
        if (validation?.pattern && !new RegExp(validation.pattern).test(value)) {
          errors[field.name] = `Invalid format`;
        }
      });
      
      return errors;
    }
  });

  const renderField = (field: FormSchema) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            name={field.name}
            label={field.label}
            value={form.values[field.name]}
            onChange={form.handleChange}
            error={!!form.errors[field.name]}
            helperText={form.errors[field.name]}
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
            name={field.name}
            label={field.label}
            value={form.values[field.name]}
            onChange={(date) => form.setFieldValue(field.name, date)}
            error={!!form.errors[field.name]}
            helperText={form.errors[field.name]}
          />
        );
      
      default:
        return (
          <TextField
            type={field.type}
            name={field.name}
            label={field.label}
            value={form.values[field.name]}
            onChange={form.handleChange}
            error={!!form.errors[field.name]}
            helperText={form.errors[field.name]}
          />
        );
    }
  };

  return (
    <form onSubmit={form.handleSubmit}>
      {schema.map(field => (
        <div key={field.name}>
          {renderField(field)}
        </div>
      ))}
    </form>
  );
};
```

## Form with Complex Validation

### Cross-Field Validation
```tsx
interface PasswordForm {
  password: string;
  confirmPassword: string;
  securityQuestions: Array<{
    question: string;
    answer: string;
  }>;
}

const PasswordChangeForm = () => {
  const form = useForm<PasswordForm>({
    initialValues: {
      password: '',
      confirmPassword: '',
      securityQuestions: [
        { question: '', answer: '' }
      ]
    },
    validate: (values) => {
      const errors: Record<string, any> = {};
      
      // Password validation
      if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!/[A-Z]/.test(values.password)) {
        errors.password = 'Password must contain uppercase letter';
      }
      
      // Cross-field validation
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      // Array field validation
      const questionErrors = values.securityQuestions.map(q => {
        const qErrors: Record<string, string> = {};
        if (!q.question) qErrors.question = 'Question is required';
        if (!q.answer) qErrors.answer = 'Answer is required';
        return qErrors;
      });
      
      if (questionErrors.some(e => Object.keys(e).length > 0)) {
        errors.securityQuestions = questionErrors;
      }
      
      return errors;
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <PasswordField
        name="password"
        label="Password"
        value={form.values.password}
        onChange={form.handleChange}
        error={!!form.errors.password}
        helperText={form.errors.password}
      />
      
      <PasswordField
        name="confirmPassword"
        label="Confirm Password"
        value={form.values.confirmPassword}
        onChange={form.handleChange}
        error={!!form.errors.confirmPassword}
        helperText={form.errors.confirmPassword}
      />
      
      {form.values.securityQuestions.map((_, index) => (
        <SecurityQuestionFields
          key={index}
          index={index}
          form={form}
        />
      ))}
    </form>
  );
};
```

## Form with Async Operations

### Auto-Save Form
```tsx
const AutoSaveForm = () => {
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const form = useForm({
    initialValues: {
      content: ''
    },
    onSubmit: async (values) => {
      try {
        setSaveStatus('saving');
        await saveContent(values);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
        throw error;
      }
    }
  });

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (form.dirty) {
      saveTimeoutRef.current = setTimeout(() => {
        form.submitForm();
      }, 1000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [form.values]);

  return (
    <form>
      <TextField
        multiline
        rows={4}
        name="content"
        value={form.values.content}
        onChange={form.handleChange}
      />
      
      <SaveStatus status={saveStatus} />
    </form>
  );
};
```

## Form with File Handling

### Multi-File Upload Form
```tsx
interface FileUploadForm {
  title: string;
  files: File[];
  uploadProgress: Record<string, number>;
}

const MultiFileUploadForm = () => {
  const form = useForm<FileUploadForm>({
    initialValues: {
      title: '',
      files: [],
      uploadProgress: {}
    },
    onSubmit: async (values) => {
      const uploads = values.files.map(file => {
        return uploadFile(file, (progress) => {
          form.setFieldValue('uploadProgress', {
            ...form.values.uploadProgress,
            [file.name]: progress
          });
        });
      });
      
      await Promise.all(uploads);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    form.setFieldValue('files', [...form.values.files, ...newFiles]);
  };

  const handleRemoveFile = (fileName: string) => {
    form.setFieldValue('files', 
      form.values.files.filter(f => f.name !== fileName)
    );
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        name="title"
        label="Title"
        value={form.values.title}
        onChange={form.handleChange}
      />
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*,.pdf"
      />
      
      <FileList
        files={form.values.files}
        progress={form.values.uploadProgress}
        onRemove={handleRemoveFile}
      />
    </form>
  );
};
```

## Best Practices and Tips

### 1. Form State Management
```tsx
// Use form context for deeply nested forms
const FormContext = createContext<ReturnType<typeof useForm> | null>(null);

const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const form = useForm({
    // form configuration
  });
  
  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  );
};

// Use in nested components
const NestedComponent = () => {
  const form = useContext(FormContext);
  if (!form) throw new Error('Must be used within FormProvider');
  
  return (
    <TextField
      value={form.values.fieldName}
      onChange={form.handleChange}
    />
  );
};
```

### 2. Performance Optimization
```tsx
// Memoize expensive validation
const validateForm = useCallback((values: FormValues) => {
  // Complex validation logic
}, [/* dependencies */]);

// Memoize form handlers
const handleSpecialField = useCallback((event) => {
  // Special handling logic
}, [/* dependencies */]);
```

### 3. Error Handling
```tsx
const FormWithErrorBoundary = () => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <FormErrorDisplay error={error} />
      )}
    >
      <ComplexForm />
    </ErrorBoundary>
  );
};
```

### 4. Testing Considerations
```tsx
describe('Advanced Form', () => {
  it('should handle file uploads', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const { getByLabelText, getByText } = render(<FileUploadForm />);
    
    const input = getByLabelText(/upload file/i);
    await userEvent.upload(input, file);
    
    expect(getByText('test.pdf')).toBeInTheDocument();
  });
  
  it('should validate cross-field dependencies', async () => {
    const { getByLabelText, getByText } = render(<PasswordForm />);
    
    await userEvent.type(getByLabelText(/password/i), 'password123');
    await userEvent.type(getByLabelText(/confirm/i), 'password124');
    
    expect(getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
