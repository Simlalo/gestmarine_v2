# Styling and Theming

This guide outlines styling and theming patterns used in the GestMarine application.

## Theme Configuration

### 1. Theme Definition

```typescript
// styles/theme/theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff'
    },
    neutral: {
      main: '#64748B',
      light: '#94A3B8',
      dark: '#475569',
      contrastText: '#fff'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    // ... other shadow definitions
  ]
});
```

### 2. Theme Provider Setup

```typescript
// App.tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};
```

## Styled Components

### 1. Component Styles

```typescript
// components/common/Button/Button.styles.ts
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

export const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  '&.size-small': {
    padding: theme.spacing(0.5, 2),
    fontSize: '0.875rem'
  },
  '&.size-large': {
    padding: theme.spacing(1.5, 4),
    fontSize: '1.125rem'
  },
  '&.variant-outlined': {
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2
    }
  }
}));
```

### 2. Layout Components

```typescript
// components/layout/Page/Page.styles.ts
import { styled } from '@mui/material/styles';

export const PageRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

export const PageHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2)
  }
}));

export const PageContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1]
}));
```

## Custom Components

### 1. Data Display Components

```typescript
// components/data-display/Card/Card.tsx
import { styled } from '@mui/material/styles';

const CardRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  transition: theme.transitions.create(['box-shadow']),
  '&:hover': {
    boxShadow: theme.shadows[2]
  }
}));

const CardHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const CardTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.h6.fontWeight
}));

const CardContent = styled('div')({
  position: 'relative'
});

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent
};
```

### 2. Form Components

```typescript
// components/inputs/TextField/TextField.tsx
import { styled } from '@mui/material/styles';
import MuiTextField from '@mui/material/TextField';

export const TextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    '& fieldset': {
      borderColor: theme.palette.divider
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2
    }
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main
    }
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2)
  }
}));
```

## Utility Styles

### 1. Spacing Utils

```typescript
// styles/utils/spacing.ts
import { css } from '@mui/material/styles';

export const spacingUtils = {
  mt: (value: number) => css`
    margin-top: ${theme => theme.spacing(value)};
  `,
  mb: (value: number) => css`
    margin-bottom: ${theme => theme.spacing(value)};
  `,
  mx: (value: number) => css`
    margin-left: ${theme => theme.spacing(value)};
    margin-right: ${theme => theme.spacing(value)};
  `,
  my: (value: number) => css`
    margin-top: ${theme => theme.spacing(value)};
    margin-bottom: ${theme => theme.spacing(value)};
  `,
  p: (value: number) => css`
    padding: ${theme => theme.spacing(value)};
  `
};
```

### 2. Typography Utils

```typescript
// styles/utils/typography.ts
import { css } from '@mui/material/styles';

export const typographyUtils = {
  truncate: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  multiLineEllipsis: (lines: number) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `
};
```

## Best Practices

1. **Theme Configuration**
   - Define consistent color palette
   - Use typography scale
   - Define spacing units
   - Configure breakpoints

2. **Component Styling**
   - Use styled components
   - Follow component structure
   - Implement responsive design
   - Use theme values

3. **Performance**
   - Minimize CSS-in-JS overhead
   - Use proper selectors
   - Implement code splitting
   - Optimize bundle size

4. **Maintainability**
   - Follow naming conventions
   - Document styles
   - Use consistent patterns
   - Implement theme tokens

Remember to:
- Use theme values consistently
- Implement responsive design
- Follow accessibility guidelines
- Document style patterns
- Test across browsers
