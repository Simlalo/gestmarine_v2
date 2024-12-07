# Gerants Feature Hooks

This directory contains documentation for hooks specific to the manager (gerant) management feature in the GestMarine application.

## Available Hooks

### [useGerantManagement](./useGerantManagement.md)
Comprehensive hook for managing gerants, including CRUD operations, boat assignments, and table management.

## Feature Overview

The gerants feature provides functionality for:
- Managing manager information
- Assigning boats to managers
- User authentication and authorization
- Manager performance tracking
- Contact information management

## Integration Points

### With Redux Store
```typescript
// store/slices/gerants/slice.ts
export const gerantsSlice = createSlice({
  name: 'gerants',
  // slice implementation
});

// Component usage
const GerantsContainer = () => {
  const gerants = useSelector(selectGerants);
  return <GerantsManagement initialGerants={gerants} />;
};
```

### With API Layer
```typescript
// api/endpoints/gerants.ts
export const gerantsApi = {
  create: (data: CreateGerantDto) => 
    axios.post('/api/gerants', data),
  update: (id: string, data: UpdateGerantDto) => 
    axios.put(`/api/gerants/${id}`, data),
  // other endpoints
};
```

## Common Use Cases

1. **Manager Dashboard**
   ```typescript
   const GerantsDashboard = () => {
     const gerantManagement = useGerantManagement();
     return <GerantsTable {...gerantManagement} />;
   };
   ```

2. **Boat Assignment**
   ```typescript
   const AssignmentView = () => {
     const { handleAssignBarques } = useGerantManagement();
     return <AssignmentInterface onAssign={handleAssignBarques} />;
   };
   ```

3. **Manager Profile**
   ```typescript
   const GerantProfile = ({ gerantId }: { gerantId: string }) => {
     const { gerants, getGerantBarques } = useGerantManagement();
     const gerant = gerants.find(g => g.id === gerantId);
     return <ProfileDisplay gerant={gerant} />;
   };
   ```

## Best Practices

1. **State Management**
   - Maintain normalized gerant data
   - Use proper TypeScript interfaces
   - Handle loading and error states
   - Implement proper validation

2. **Performance**
   - Implement proper memoization
   - Use pagination for large datasets
   - Optimize data fetching
   - Cache manager data appropriately

3. **Security**
   - Implement proper authorization checks
   - Validate input data
   - Secure sensitive information
   - Handle authentication properly

4. **Error Handling**
   - Implement proper error boundaries
   - Provide user feedback
   - Log errors appropriately
   - Handle network failures gracefully

## Contributing

When adding new hooks to this feature:
1. Follow the established patterns
2. Document all interfaces
3. Include usage examples
4. Consider security implications
5. Test thoroughly
6. Update relevant documentation

## Related Components

- GerantDialog
- AssignBarquesDialog
- GerantProfile
- GerantsTable
- GerantFilters
