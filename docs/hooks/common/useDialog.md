# useDialog Hook

## Overview
The `useDialog` hook provides a simple and reusable way to manage dialog/modal state in React components. It handles opening, closing, and toggling dialogs, along with optional data management.

- **Purpose**: Manage dialog state and associated data
- **Key Features**: 
  - Open/Close/Toggle functionality
  - Data passing support
  - Type-safe implementation
  - Zero dependencies beyond React

## API Reference

### Input Parameters
```typescript
interface UseDialogParams {
  initialState?: boolean; // Optional initial open state
}
```

### Return Values
```typescript
interface UseDialogReturn {
  isOpen: boolean;        // Current dialog state
  data: any | undefined;  // Associated dialog data
  open: (data?: any) => void;    // Open dialog with optional data
  close: () => void;             // Close dialog
  toggle: () => void;            // Toggle dialog state
}
```

### Examples

```typescript
// Basic Usage
const MyComponent = () => {
  const dialog = useDialog();
  
  return (
    <>
      <Button onClick={dialog.open}>Open Dialog</Button>
      <Dialog open={dialog.isOpen} onClose={dialog.close}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    </>
  );
};

// With Data
const MyComponentWithData = () => {
  const dialog = useDialog();
  
  const handleEdit = (item: Item) => {
    dialog.open(item); // Pass data when opening
  };
  
  return (
    <>
      <Button onClick={() => handleEdit(item)}>Edit Item</Button>
      <Dialog open={dialog.isOpen} onClose={dialog.close}>
        <DialogContent>
          {dialog.data && <EditForm item={dialog.data} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
```

## Implementation Details

### Core Functionality
- Uses React's `useState` for state management
- Implements memoized callbacks with `useCallback`
- Maintains both open state and associated data
- Cleans up data on dialog close

### State Management
```typescript
interface DialogState {
  isOpen: boolean;
  data: any | undefined;
}
```

The hook maintains an internal state object combining both the dialog's open state and any associated data.

### Performance Considerations
- Memoized callbacks prevent unnecessary re-renders
- Minimal state updates
- Zero external dependencies
- Lightweight implementation

### Error Handling
- Type-safe implementation
- Graceful handling of undefined data
- Clean state management

## Best Practices

### Recommended Usage
1. Initialize at component level:
   ```typescript
   const dialog = useDialog();
   ```

2. Use with Material-UI dialogs:
   ```typescript
   <Dialog 
     open={dialog.isOpen} 
     onClose={dialog.close}
   >
   ```

3. Pass data when opening:
   ```typescript
   dialog.open({ id: 1, name: 'Item' });
   ```

### Common Pitfalls
- Avoid multiple dialog instances for the same modal
- Don't destructure hook return values unnecessarily
- Remember to handle dialog data cleanup

### Tips and Tricks
1. Use with TypeScript generics for type-safe data:
   ```typescript
   const dialog = useDialog<UserData>();
   ```

2. Combine with other hooks for complex scenarios:
   ```typescript
   const dialog = useDialog();
   const form = useForm();
   ```

3. Implement controlled closing behavior:
   ```typescript
   const handleClose = () => {
     if (!isDirty) {
       dialog.close();
     } else {
       // Show confirmation
     }
   };
   ```
