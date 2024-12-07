# Project Architecture Overview

## Project Structure

The GestMarine application follows a feature-first architecture pattern, organizing code by business domain rather than technical concerns. This approach improves maintainability, scalability, and developer experience.

```typescript
/src/
├── components/           # Shared UI components
│   ├── common/          # Base components (Button, Input, etc.)
│   └── ui/              # Complex UI components (Dialog, Table, etc.)
├── features/            # Feature modules
│   ├── barques/         # Boat management feature
│   │   ├── api/        # Feature-specific API calls
│   │   ├── components/ # Feature-specific components
│   │   ├── hooks/      # Feature-specific hooks
│   │   └── store/      # Feature state management
│   └── gerants/         # Manager management feature
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── store/
├── hooks/               # Shared custom hooks
├── store/              # Global state management
│   ├── slices/        # Redux slices
│   └── middleware/    # Custom middleware
├── api/                # API client and utilities
│   ├── client.ts      # Base API client
│   ├── interceptors/  # Request/response interceptors
│   └── endpoints/     # API endpoint definitions
└── utils/             # Shared utilities and helpers
```

## Core Technologies

### 1. React (UI Framework)
- Version: 18.x
- Features utilized:
  - Concurrent Mode
  - Suspense for data fetching
  - Server Components (planned)
  - Strict Mode enabled

### 2. TypeScript (Language)
- Version: 4.x
- Configuration:
  - Strict mode enabled
  - Path aliases configured
  - ESLint integration
  - Custom type definitions

### 3. Redux Toolkit (State Management)
- Features utilized:
  - CreateSlice for reducer logic
  - RTK Query for data fetching
  - Middleware customization
  - DevTools integration

### 4. React Query (Data Fetching)
- Features utilized:
  - Automatic background updates
  - Cache invalidation
  - Optimistic updates
  - Infinite queries
  - Suspense integration

### 5. Material-UI (Component Library)
- Version: 5.x
- Features utilized:
  - Custom theme
  - Styled components
  - System props
  - Server-side rendering support

## Design Patterns

### 1. Feature-First Organization
- Each feature is a self-contained module
- Clear boundaries between features
- Shared code extracted to common locations
- Feature-specific state management

Example:
```typescript
// features/barques/api/queries.ts
export const useBarques = () => {
  return useQuery(['barques'], fetchBarques);
};

// features/barques/components/BarquesList.tsx
export const BarquesList = () => {
  const { data, isLoading } = useBarques();
  // Component implementation
};
```

### 2. Atomic Design Components
- Atoms: Basic UI elements
- Molecules: Simple component combinations
- Organisms: Complex UI sections
- Templates: Page layouts
- Pages: Complete views

Example:
```typescript
// components/common/Button.tsx (Atom)
export const Button = styled(MuiButton)(/* styles */);

// components/ui/Dialog.tsx (Molecule)
export const Dialog = ({ title, children }) => {
  // Dialog implementation
};

// features/barques/components/BarquesTable.tsx (Organism)
export const BarquesTable = () => {
  // Complex table implementation
};
```

### 3. Custom Hook Abstractions
- Business logic separation
- Reusable state management
- Consistent data fetching
- Side effect handling

Example:
```typescript
// hooks/useDialog.ts
export const useDialog = (initialState = false) => {
  const [open, setOpen] = useState(initialState);
  return {
    open,
    handleOpen: () => setOpen(true),
    handleClose: () => setOpen(false),
  };
};
```

### 4. Command Query Responsibility Segregation (CQRS)
- Separate read and write operations
- Optimized data fetching
- Clear state updates
- Improved performance

Example:
```typescript
// features/barques/api/commands.ts
export const useUpdateBarque = () => {
  return useMutation(updateBarque);
};

// features/barques/api/queries.ts
export const useBarqueDetails = (id: string) => {
  return useQuery(['barque', id], () => fetchBarque(id));
};
```

## Conventions and Standards

### 1. Code Style Guide
- ESLint configuration:
  - Airbnb base
  - TypeScript rules
  - React hooks rules
  - Import sorting
- Prettier configuration:
  - Single quotes
  - No semicolons
  - 2 space indentation
  - 80 character line limit

### 2. Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Files: kebab-case
- Types/Interfaces: PascalCase with prefix
- Constants: SCREAMING_SNAKE_CASE

Example:
```typescript
// Types
interface IBarque {
  id: string;
  name: string;
}

// Components
export const BarqueDialog = () => {};

// Functions
const handleSubmit = () => {};

// Constants
const API_BASE_URL = '/api';
```

### 3. File Organization
- Index files for exports
- Feature-based folders
- Consistent file naming
- Clear import paths

Example:
```typescript
// features/barques/index.ts
export * from './components';
export * from './api';
export * from './hooks';
export * from './store';

// features/barques/components/index.ts
export * from './BarquesList';
export * from './BarquesTable';
export * from './BarqueDialog';
```

### 4. Testing Practices
- Jest for unit testing
- React Testing Library for components
- MSW for API mocking
- Cypress for E2E testing

Example:
```typescript
// __tests__/components/Button.test.tsx
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Performance Considerations

### 1. Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports
- Prefetching strategies

### 2. State Management
- Normalized store structure
- Selective rerendering
- Memoization
- State updates batching

### 3. Data Fetching
- Caching strategies
- Background updates
- Optimistic updates
- Error boundaries

### 4. Build Optimization
- Tree shaking
- Bundle analysis
- Code minification
- Asset optimization
