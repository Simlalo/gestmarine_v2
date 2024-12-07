# Form Component Examples

## Basic Implementation

### Simple Form
```tsx
import { useForm } from '@/hooks/common/useForm';
import { TextField, Button } from '@mui/material';

interface LoginForm {
  email: string;
  password: string;
}

const SimpleForm = () => {
  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        name="email"
        label="Email"
        value={form.values.email}
        onChange={form.handleChange}
        error={!!form.errors.email}
        helperText={form.errors.email}
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        value={form.values.password}
        onChange={form.handleChange}
        error={!!form.errors.password}
        helperText={form.errors.password}
      />
      <Button type="submit" disabled={form.isSubmitting}>
        Submit
      </Button>
    </form>
  );
};
```

### Form with Validation
```tsx
interface UserForm {
  username: string;
  email: string;
  age: number;
}

const ValidatedForm = () => {
  const form = useForm<UserForm>({
    initialValues: {
      username: '',
      email: '',
      age: 0
    },
    validate: (values) => {
      const errors: Partial<UserForm> = {};
      
      if (!values.username) {
        errors.username = 'Username is required';
      }
      
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      
      if (values.age < 18) {
        errors.age = 'Must be at least 18 years old';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      await submitToAPI(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        name="username"
        label="Username"
        value={form.values.username}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.username && !!form.errors.username}
        helperText={form.touched.username && form.errors.username}
      />
      {/* Other fields */}
    </form>
  );
};
```

### Dynamic Form Fields
```tsx
interface DynamicForm {
  title: string;
  items: Array<{ name: string; quantity: number }>;
}

const DynamicFieldsForm = () => {
  const form = useForm<DynamicForm>({
    initialValues: {
      title: '',
      items: [{ name: '', quantity: 0 }]
    }
  });

  const addItem = () => {
    form.setFieldValue('items', [
      ...form.values.items,
      { name: '', quantity: 0 }
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = form.values.items.filter((_, i) => i !== index);
    form.setFieldValue('items', newItems);
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        name="title"
        label="Title"
        value={form.values.title}
        onChange={form.handleChange}
      />
      
      {form.values.items.map((item, index) => (
        <div key={index}>
          <TextField
            name={`items.${index}.name`}
            label="Item Name"
            value={item.name}
            onChange={form.handleChange}
          />
          <TextField
            name={`items.${index}.quantity`}
            label="Quantity"
            type="number"
            value={item.quantity}
            onChange={form.handleChange}
          />
          <Button onClick={() => removeItem(index)}>
            Remove
          </Button>
        </div>
      ))}
      
      <Button onClick={addItem}>
        Add Item
      </Button>
    </form>
  );
};
```

## Common Use Cases

### Form with File Upload
```tsx
const FileUploadForm = () => {
  const form = useForm({
    initialValues: {
      title: '',
      file: null as File | null
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    form.setFieldValue('file', file);
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
        onChange={handleFileChange}
        accept="image/*"
      />
      {form.values.file && (
        <img
          src={URL.createObjectURL(form.values.file)}
          alt="Preview"
          style={{ maxWidth: 200 }}
        />
      )}
    </form>
  );
};
```

### Form with Async Validation
```tsx
const AsyncValidationForm = () => {
  const form = useForm({
    initialValues: {
      username: ''
    },
    validate: async (values) => {
      const errors: any = {};
      
      try {
        const isUsernameTaken = await checkUsername(values.username);
        if (isUsernameTaken) {
          errors.username = 'Username is already taken';
        }
      } catch (error) {
        errors.username = 'Failed to validate username';
      }
      
      return errors;
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        name="username"
        label="Username"
        value={form.values.username}
        onChange={form.handleChange}
        error={!!form.errors.username}
        helperText={form.errors.username}
      />
    </form>
  );
};
```

## Tips and Best Practices

### 1. Form State Management
- Use form state management hooks for complex forms
- Keep form state local unless needed globally
- Handle validation separately from form state

### 2. Performance Optimization
```tsx
// Good Practice
const OptimizedForm = () => {
  const form = useForm({
    initialValues: {
      // ...
    }
  });

  // Memoize handlers for complex forms
  const handleSpecialField = useCallback((event) => {
    // Complex handling logic
  }, [/* dependencies */]);

  return (
    <form>
      {/* Form fields */}
    </form>
  );
};
```

### 3. Error Handling
```tsx
const FormWithErrorHandling = () => {
  const form = useForm({
    onSubmit: async (values) => {
      try {
        await submitForm(values);
      } catch (error) {
        form.setStatus({
          error: 'Failed to submit form. Please try again.'
        });
      }
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {form.status?.error && (
        <Alert severity="error">
          {form.status.error}
        </Alert>
      )}
      {/* Form fields */}
    </form>
  );
};
```

### 4. Common Pitfalls to Avoid
- Don't mutate form values directly
- Avoid unnecessary re-renders
- Handle all possible form states
- Implement proper validation
- Clean up resources (e.g., file URLs)

### 5. Testing Considerations
```tsx
describe('Form Component', () => {
  it('should handle submission correctly', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(
      <MyForm onSubmit={onSubmit} />
    );
    
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    
    fireEvent.submit(getByRole('form'));
    
    expect(onSubmit).toHaveBeenCalledWith({
      username: 'testuser'
    });
  });
});
