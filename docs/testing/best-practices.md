# Testing Best Practices

This guide outlines the testing patterns and best practices for the GestMarine application.

## Testing Stack

- Jest: Testing framework
- React Testing Library: Component testing
- MSW (Mock Service Worker): API mocking
- Testing Library User Event: User interaction simulation

## Test Organization

### Directory Structure
```
src/
├── __tests__/
│   ├── components/
│   │   ├── ui/
│   │   └── features/
│   ├── hooks/
│   │   ├── common/
│   │   └── features/
│   ├── utils/
│   └── integration/
└── __mocks__/
```

## Testing Patterns

### 1. Component Testing

```tsx
// Example of a component test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BarqueTable } from '@/components/features/barques';

describe('BarqueTable', () => {
  const mockData = [
    { id: '1', name: 'Boat 1', status: 'active' },
    { id: '2', name: 'Boat 2', status: 'inactive' }
  ];

  it('renders table with data', () => {
    render(<BarqueTable data={mockData} />);
    
    expect(screen.getByText('Boat 1')).toBeInTheDocument();
    expect(screen.getByText('Boat 2')).toBeInTheDocument();
  });

  it('handles row selection', async () => {
    const onSelect = jest.fn();
    render(<BarqueTable data={mockData} onSelect={onSelect} />);
    
    await userEvent.click(screen.getByRole('checkbox', { name: /select row/i }));
    expect(onSelect).toHaveBeenCalledWith(['1']);
  });
});
```

### 2. Hook Testing

```tsx
// Example of a custom hook test
import { renderHook, act } from '@testing-library/react';
import { useBarqueManagement } from '@/hooks/features/barques';

describe('useBarqueManagement', () => {
  it('manages barque state', async () => {
    const { result } = renderHook(() => useBarqueManagement());
    
    // Test initial state
    expect(result.current.barques).toEqual([]);
    
    // Test adding a barque
    await act(async () => {
      await result.current.addBarque({
        name: 'New Boat',
        status: 'active'
      });
    });
    
    expect(result.current.barques).toHaveLength(1);
  });
});
```

### 3. API Mocking

```tsx
// Example of API mocking with MSW
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/barques', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'Boat 1' },
        { id: '2', name: 'Boat 2' }
      ])
    );
  }),
  
  rest.post('/api/barques', (req, res, ctx) => {
    return res(
      ctx.json({ id: '3', ...req.body })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 4. Integration Testing

```tsx
// Example of an integration test
describe('Barque Management Flow', () => {
  it('completes full CRUD cycle', async () => {
    render(<BarqueManagement />);
    
    // Create
    await userEvent.click(screen.getByText('Add Boat'));
    await userEvent.type(screen.getByLabelText('Name'), 'New Boat');
    await userEvent.click(screen.getByText('Save'));
    
    // Verify creation
    expect(screen.getByText('New Boat')).toBeInTheDocument();
    
    // Update
    await userEvent.click(screen.getByTestId('edit-button'));
    await userEvent.clear(screen.getByLabelText('Name'));
    await userEvent.type(screen.getByLabelText('Name'), 'Updated Boat');
    await userEvent.click(screen.getByText('Save'));
    
    // Verify update
    expect(screen.getByText('Updated Boat')).toBeInTheDocument();
    
    // Delete
    await userEvent.click(screen.getByTestId('delete-button'));
    await userEvent.click(screen.getByText('Confirm'));
    
    // Verify deletion
    expect(screen.queryByText('Updated Boat')).not.toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Test Organization

- Group related tests together
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Keep tests focused and concise

### 2. Test Coverage

- Aim for high coverage of business logic
- Test edge cases and error scenarios
- Focus on user-centric behavior
- Test accessibility requirements

### 3. Mocking

```tsx
// Example of proper mocking
const mockGerantService = {
  getGerants: jest.fn(),
  updateGerant: jest.fn(),
  deleteGerant: jest.fn()
};

jest.mock('@/services/gerant', () => ({
  GerantService: jest.fn(() => mockGerantService)
}));
```

### 4. Testing Utilities

```tsx
// Example of a test utility
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );
  
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
```

## Testing Guidelines

1. **Write Tests First**
   - Follow TDD when possible
   - Define expected behavior before implementation

2. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Avoid testing implementation details

3. **Maintain Test Quality**
   - Keep tests simple and readable
   - Avoid test duplication
   - Update tests when requirements change

4. **Handle Asynchronous Operations**
   ```tsx
   it('handles async operations', async () => {
     const { result } = renderHook(() => useAsyncOperation());
     
     await act(async () => {
       await result.current.fetchData();
     });
     
     expect(result.current.data).toBeDefined();
   });
   ```

5. **Test Error Scenarios**
   ```tsx
   it('handles errors gracefully', async () => {
     server.use(
       rest.get('/api/data', (req, res, ctx) =>
         res(ctx.status(500))
       )
     );
     
     render(<DataComponent />);
     
     expect(await screen.findByText(/error/i)).toBeInTheDocument();
   });
   ```

## Common Patterns

### 1. Setup and Cleanup

```tsx
describe('Component', () => {
  let mockProps;
  
  beforeEach(() => {
    mockProps = {
      data: [],
      onUpdate: jest.fn()
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

### 2. Snapshot Testing

```tsx
it('matches snapshot', () => {
  const { container } = render(<Component {...props} />);
  expect(container).toMatchSnapshot();
});
```

### 3. Custom Matchers

```tsx
expect.extend({
  toBeValidBarque(received) {
    return {
      pass: received.id && received.name && received.status,
      message: () => `expected ${received} to be a valid barque`
    };
  }
});
```

## Performance Testing

```tsx
describe('Performance', () => {
  it('renders large datasets efficiently', () => {
    const start = performance.now();
    render(<BarqueTable data={largeDataset} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });
});
```

## Accessibility Testing

```tsx
it('meets accessibility standards', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});
```

Remember to:
- Write tests that are maintainable and readable
- Focus on testing behavior and user interactions
- Keep tests independent and isolated
- Use appropriate mocking strategies
- Follow the testing pyramid (unit > integration > e2e)
