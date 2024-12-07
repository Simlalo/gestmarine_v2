# Advanced Dialog Examples

## Multi-Step Dialog

### Step-Based Dialog Implementation
```tsx
interface StepDialogState {
  activeStep: number;
  data: {
    personalInfo?: { name: string; email: string };
    preferences?: { theme: string; notifications: boolean };
    confirmation?: boolean;
  };
}

const MultiStepDialog = () => {
  const dialog = useDialog();
  const [state, setState] = useState<StepDialogState>({
    activeStep: 0,
    data: {}
  });

  const steps = [
    {
      label: 'Personal Info',
      component: (
        <PersonalInfoStep
          data={state.data.personalInfo}
          onNext={(data) => {
            setState(prev => ({
              ...prev,
              activeStep: prev.activeStep + 1,
              data: { ...prev.data, personalInfo: data }
            }));
          }}
        />
      )
    },
    {
      label: 'Preferences',
      component: (
        <PreferencesStep
          data={state.data.preferences}
          onBack={() => setState(prev => ({ ...prev, activeStep: prev.activeStep - 1 }))}
          onNext={(data) => {
            setState(prev => ({
              ...prev,
              activeStep: prev.activeStep + 1,
              data: { ...prev.data, preferences: data }
            }));
          }}
        />
      )
    },
    {
      label: 'Confirmation',
      component: (
        <ConfirmationStep
          data={state.data}
          onBack={() => setState(prev => ({ ...prev, activeStep: prev.activeStep - 1 }))}
          onConfirm={async () => {
            await submitData(state.data);
            dialog.close();
          }}
        />
      )
    }
  ];

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stepper activeStep={state.activeStep}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>
        {steps[state.activeStep].component}
      </DialogContent>
    </Dialog>
  );
};
```

## Dynamic Content Dialog

### Lazy Loading Dialog Content
```tsx
const LazyLoadingDialog = () => {
  const dialog = useDialog();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dialog.isOpen && !content) {
      setLoading(true);
      fetchDialogContent()
        .then(setContent)
        .finally(() => setLoading(false));
    }
  }, [dialog.isOpen]);

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={() => {
        dialog.close();
        setContent(null);
      }}
    >
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : content ? (
          <DynamicContent data={content} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
```

## Context-Aware Dialog

### Dialog with Global State Integration
```tsx
const GlobalStateDialog = () => {
  const dialog = useDialog();
  const dispatch = useAppDispatch();
  const { theme, user } = useAppSelector(state => state.app);

  const handleAction = async () => {
    try {
      await dispatch(someAsyncAction()).unwrap();
      dialog.close();
    } catch (error) {
      dispatch(showError(error.message));
    }
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      theme={theme}
    >
      <DialogTitle>
        Welcome {user.name}
      </DialogTitle>
      <DialogContent>
        <ThemeAwareContent />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAction}>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

## Advanced Interaction Patterns

### Nested Dialogs
```tsx
const NestedDialogsExample = () => {
  const parentDialog = useDialog();
  const childDialog = useDialog();

  const handleParentAction = () => {
    childDialog.open();
  };

  return (
    <>
      <Dialog
        open={parentDialog.isOpen}
        onClose={parentDialog.close}
      >
        <DialogContent>
          <Button onClick={handleParentAction}>
            Open Child Dialog
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childDialog.isOpen}
        onClose={childDialog.close}
        // Prevent click outside from closing both dialogs
        onBackdropClick={(e) => e.stopPropagation()}
      >
        <DialogContent>
          Child Dialog Content
        </DialogContent>
      </Dialog>
    </>
  );
};
```

### Dialog with Complex State
```tsx
interface ComplexDialogState {
  mode: 'view' | 'edit';
  data: any;
  validation: Record<string, string>;
  dirty: boolean;
}

const ComplexStateDialog = () => {
  const dialog = useDialog();
  const [state, setState] = useState<ComplexDialogState>({
    mode: 'view',
    data: null,
    validation: {},
    dirty: false
  });

  // Prevent accidental closure when form is dirty
  const handleClose = () => {
    if (state.dirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        dialog.close();
      }
    } else {
      dialog.close();
    }
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle>
        {state.mode === 'view' ? 'View' : 'Edit'} Data
      </DialogTitle>
      <DialogContent>
        {state.mode === 'view' ? (
          <ViewMode
            data={state.data}
            onEdit={() => setState(prev => ({ ...prev, mode: 'edit' }))}
          />
        ) : (
          <EditMode
            data={state.data}
            validation={state.validation}
            onChange={(newData) => {
              setState(prev => ({
                ...prev,
                data: newData,
                dirty: true
              }));
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
```

## Advanced Animation and Transitions

### Custom Dialog Transitions
```tsx
const AnimatedDialog = () => {
  const dialog = useDialog();

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      TransitionComponent={Slide}
      TransitionProps={{
        direction: 'up',
        timeout: {
          enter: 300,
          exit: 200
        }
      }}
    >
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Animated Content
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
```

## Best Practices and Tips

### 1. State Management
- Keep complex state logic in custom hooks
- Use reducers for complex state
- Implement proper cleanup

### 2. Performance
- Lazy load heavy content
- Optimize animations
- Manage memory leaks

### 3. Accessibility
- Handle keyboard navigation
- Manage focus properly
- Provide ARIA labels

### 4. Error Handling
- Implement proper error boundaries
- Handle async operations
- Provide feedback

### 5. Testing
```tsx
describe('Advanced Dialog', () => {
  it('should handle multi-step navigation', async () => {
    const { getByText, getByRole } = render(<MultiStepDialog />);
    
    // Navigate through steps
    await userEvent.click(getByText('Next'));
    expect(getByText('Step 2')).toBeInTheDocument();
    
    // Verify form submission
    await userEvent.click(getByText('Submit'));
    expect(mockSubmit).toHaveBeenCalled();
  });
});
