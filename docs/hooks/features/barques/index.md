# Barques Feature Hooks

This directory contains documentation for hooks specific to the boat (barque) management feature in the GestMarine application.

## Available Hooks

### [useBarqueManagement](./useBarqueManagement.md)
Comprehensive hook for managing boats, including CRUD operations, gerant assignments, and table management.

## Feature Overview

The barques feature provides functionality for:
- Managing boat information
- Assigning managers (gerants) to boats
- Tracking boat status and details
- Filtering and searching boats
- Bulk operations on boats

## Integration Points

### With Redux Store
```typescript
// store/slices/barques/slice.ts
export const barquesSlice = createSlice({
  name: 'barques',
  // slice implementation
});

// Component usage
const BarquesContainer = () => {
  const barques = useSelector(selectBarques);
  return <BarquesManagement initialBarques={barques} />;
};
```

### With API Layer
```typescript
// api/endpoints/barques.ts
export const barquesApi = {
  create: (data: CreateBarqueDto) => 
    axios.post('/api/barques', data),
  update: (id: string, data: UpdateBarqueDto) => 
    axios.put(`/api/barques/${id}`, data),
  // other endpoints
};
```

## Common Use Cases

1. **Boat Management Dashboard**
   ```typescript
   const BarquesDashboard = () => {
     const barqueManagement = useBarqueManagement();
     return <BarquesTable {...barqueManagement} />;
   };
   ```

2. **Boat Assignment**
   ```typescript
   const AssignmentView = () => {
     const { handleAssignGerant } = useBarqueManagement();
     return <AssignmentInterface onAssign={handleAssignGerant} />;
   };
   ```

3. **Boat Status Tracking**
   ```typescript
   const StatusTracker = () => {
     const { barques } = useBarqueManagement();
     return <StatusDisplay boats={barques} />;
   };
   ```

## Best Practices

1. **State Management**
   - Keep boat data normalized
   - Use proper TypeScript interfaces
   - Handle loading and error states

2. **Performance**
   - Implement proper memoization
   - Use pagination for large datasets
   - Optimize bulk operations

3. **Error Handling**
   - Implement proper error boundaries
   - Provide user feedback
   - Log errors appropriately

## Contributing

When adding new hooks to this feature:
1. Follow the established patterns
2. Document all interfaces
3. Include usage examples
4. Consider error cases
5. Test thoroughly
