# GestMarine Hooks Documentation

## Overview
This directory contains comprehensive documentation for all hooks used in the GestMarine application. The hooks are organized into two main categories:

1. [Common Hooks](./common/index.md)
   - Reusable utility hooks
   - UI state management
   - Generic functionality

2. [Feature Hooks](./features/index.md)
   - Business logic hooks
   - Feature-specific functionality
   - Complex state management

## Hook Categories

### Common Hooks
- [useDialog](./common/useDialog.md): Dialog/modal state management
- [useForm](./common/useForm.md): Form handling and validation
- [useTable](./common/useTable.md): Table state and operations

### Feature Hooks
- [Barques Management](./features/barques/index.md)
  - useBarqueManagement: Comprehensive boat management
  
- [Gerants Management](./features/gerants/index.md)
  - useGerantManagement: Manager operations and assignments

## Development Guidelines

### Hook Creation
1. **Naming Convention**
   - Use camelCase
   - Start with 'use' prefix
   - Be descriptive and specific

2. **Type Safety**
   - Use TypeScript interfaces
   - Define proper generics
   - Document type constraints

3. **State Management**
   - Choose appropriate state solution
   - Consider performance implications
   - Handle side effects properly

### Code Organization
```typescript
// Hook structure
export const useFeature = (options: Options): Return => {
  // State declarations
  const [state, setState] = useState(initial);
  
  // Effects and callbacks
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Event handling
  }, [dependencies]);
  
  // Return interface
  return {
    state,
    handlers,
    utilities,
  };
};
```

## Best Practices

### 1. Performance Optimization
- Use memoization appropriately
- Minimize re-renders
- Optimize dependencies
- Handle cleanup properly

### 2. Error Handling
- Implement proper error boundaries
- Provide meaningful error messages
- Handle edge cases
- Document error scenarios

### 3. Testing
- Write comprehensive tests
- Cover edge cases
- Test error scenarios
- Verify performance

### 4. Documentation
- Document public interfaces
- Provide usage examples
- Include type definitions
- Explain complex logic

## Integration Examples

### With Components
```typescript
const MyComponent = () => {
  const dialog = useDialog();
  const form = useForm(options);
  const table = useTable(config);
  
  return (
    <>
      <Table {...table.props} />
      <Dialog {...dialog.props}>
        <Form {...form.props} />
      </Dialog>
    </>
  );
};
```

### With Redux
```typescript
const FeatureComponent = () => {
  const dispatch = useAppDispatch();
  const data = useSelector(selectData);
  
  const feature = useFeatureHook({
    initialData: data,
    onUpdate: (data) => dispatch(updateAction(data)),
  });
  
  return <UI {...feature} />;
};
```

## Contributing

### Adding New Hooks
1. Create hook file in appropriate directory
2. Write comprehensive documentation
3. Include usage examples
4. Add tests
5. Update index files

### Documentation Updates
1. Keep documentation current
2. Add new examples
3. Update integration patterns
4. Maintain consistency

### Code Review
1. Verify type safety
2. Check performance
3. Review error handling
4. Validate tests
5. Ensure documentation
