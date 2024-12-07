# Routing and Navigation

This guide outlines routing and navigation patterns used in the GestMarine application.

## Router Configuration

### 1. Route Definition

```typescript
// routes/routes.ts
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const BarqueManagement = lazy(() => import('@/features/barques'));
const GerantManagement = lazy(() => import('@/features/gerants'));
const Dashboard = lazy(() => import('@/features/dashboard'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'barques/*',
        element: <BarqueManagement />,
        loader: barquesLoader,
        errorElement: <ErrorBoundary />
      },
      {
        path: 'gerants/*',
        element: <GerantManagement />,
        loader: gerantsLoader,
        errorElement: <ErrorBoundary />
      }
    ]
  },
  {
    path: '/auth/*',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
```

### 2. Router Setup

```typescript
// App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export const App = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
```

## Route Guards

### 1. Authentication Guard

```typescript
// components/auth/AuthGuard.tsx
export const AuthGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login', {
        replace: true,
        state: { from: location }
      });
    }
  }, [isAuthenticated, isLoading, location]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <>{children}</> : null;
};
```

### 2. Permission Guard

```typescript
// components/auth/PermissionGuard.tsx
export const PermissionGuard: React.FC<{
  children: React.ReactNode;
  requiredPermissions: string[];
}> = ({ children, requiredPermissions }) => {
  const { permissions } = useAuth();
  const navigate = useNavigate();

  const hasRequiredPermissions = requiredPermissions.every(
    permission => permissions.includes(permission)
  );

  useEffect(() => {
    if (!hasRequiredPermissions) {
      navigate('/unauthorized');
    }
  }, [hasRequiredPermissions]);

  return hasRequiredPermissions ? <>{children}</> : null;
};
```

## Navigation Components

### 1. Navigation Menu

```typescript
// components/navigation/MainMenu.tsx
interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permissions?: string[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />
  },
  {
    label: 'Boats',
    path: '/barques',
    icon: <BoatIcon />,
    permissions: ['view:barques']
  },
  {
    label: 'Managers',
    path: '/gerants',
    icon: <PeopleIcon />,
    permissions: ['view:gerants']
  }
];

export const MainMenu = () => {
  const { permissions } = useAuth();
  const location = useLocation();

  const filteredItems = menuItems.filter(item => 
    !item.permissions || item.permissions.every(p => permissions.includes(p))
  );

  return (
    <List>
      {filteredItems.map(item => (
        <ListItem
          key={item.path}
          component={Link}
          to={item.path}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
};
```

### 2. Breadcrumbs

```typescript
// components/navigation/Breadcrumbs.tsx
export const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + array.slice(0, index + 1).join('/')
    }));

  return (
    <MuiBreadcrumbs>
      <Link component={RouterLink} to="/">
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        
        return isLast ? (
          <Typography key={segment.path} color="textPrimary">
            {segment.label}
          </Typography>
        ) : (
          <Link
            key={segment.path}
            component={RouterLink}
            to={segment.path}
          >
            {segment.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
```

## Route Loaders and Actions

### 1. Data Loading

```typescript
// features/barques/loaders.ts
export const barquesLoader = async () => {
  const barqueService = new BarqueService();
  
  try {
    const [barques, categories] = await Promise.all([
      barqueService.getBarques(),
      barqueService.getCategories()
    ]);

    return { barques, categories };
  } catch (error) {
    throw new Response('Failed to load barques', { status: 500 });
  }
};
```

### 2. Form Actions

```typescript
// features/barques/actions.ts
export const createBarqueAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const barqueService = new BarqueService();

  try {
    const barque = await barqueService.createBarque({
      name: formData.get('name') as string,
      registrationNumber: formData.get('registrationNumber') as string,
      capacity: Number(formData.get('capacity')),
      status: formData.get('status') as string
    });

    return redirect(`/barques/${barque.id}`);
  } catch (error) {
    return json(
      { error: 'Failed to create barque' },
      { status: 400 }
    );
  }
};
```

## Navigation Hooks

### 1. Route Params Hook

```typescript
// hooks/common/useRouteParams.ts
export const useRouteParams = <T extends Record<string, string>>() => {
  const { params } = useParams<T>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return {
    params,
    queryParams: Object.fromEntries(searchParams.entries()),
    setQueryParams: (newParams: Record<string, string>) => {
      const updatedParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          updatedParams.set(key, value);
        } else {
          updatedParams.delete(key);
        }
      });
      return `?${updatedParams.toString()}`;
    }
  };
};
```

### 2. Navigation History Hook

```typescript
// hooks/common/useNavigationHistory.ts
export const useNavigationHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [history, setHistory] = useState<string[]>([location.pathname]);

  useEffect(() => {
    setHistory(prev => [...prev, location.pathname]);
  }, [location]);

  const goBack = () => {
    const previousPath = history[history.length - 2];
    if (previousPath) {
      navigate(previousPath);
      setHistory(prev => prev.slice(0, -1));
    } else {
      navigate('/');
    }
  };

  return { history, goBack };
};
```

## Best Practices

1. **Route Organization**
   - Use lazy loading
   - Implement proper guards
   - Handle loading states

2. **Navigation**
   - Provide clear navigation paths
   - Handle unauthorized access
   - Show loading indicators

3. **Data Loading**
   - Use route loaders
   - Handle loading errors
   - Cache route data

4. **Type Safety**
   - Type route parameters
   - Type loader data
   - Type action data

Remember to:
- Handle loading states
- Implement error boundaries
- Use proper TypeScript types
- Document route structure
- Test navigation flows
