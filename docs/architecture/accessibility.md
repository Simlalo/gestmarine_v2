# Accessibility Guidelines

This guide outlines accessibility patterns and best practices used in the GestMarine application to ensure WCAG 2.1 compliance.

## Core Principles

1. Perceivable
2. Operable
3. Understandable
4. Robust

## Semantic HTML

### 1. Document Structure

```tsx
// components/layout/PageLayout.tsx
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div role="main">
      <header>
        <nav aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
      </header>
      
      <main id="main-content">
        {children}
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};
```

### 2. Landmarks and Regions

```tsx
// components/features/barques/BarqueManagement.tsx
const BarqueManagement = () => {
  return (
    <section aria-labelledby="barque-title">
      <h1 id="barque-title">Boat Management</h1>
      
      <nav aria-label="Boat filters">
        {/* Filter controls */}
      </nav>
      
      <section aria-label="Boat list">
        {/* Boat list content */}
      </section>
    </section>
  );
};
```

## Keyboard Navigation

### 1. Focus Management

```tsx
// hooks/common/useFocusManagement.ts
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = focusRef.current;
    if (element) {
      element.focus();
    }
    
    return () => {
      // Restore focus when component unmounts
      element?.blur();
    };
  }, []);
  
  return focusRef;
};
```

### 2. Focus Trap

```tsx
// components/common/Dialog.tsx
const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {children}
    </div>
  );
};
```

## ARIA Attributes

### 1. Live Regions

```tsx
// components/common/Notifications.tsx
const Notifications: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="notification"
    >
      {message}
    </div>
  );
};
```

### 2. Form Labels and Descriptions

```tsx
// components/common/FormField.tsx
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  description,
  children
}) => {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': `${descriptionId} ${errorId}`,
        'aria-invalid': !!error
      })}
      {description && (
        <div id={descriptionId} className="field-description">
          {description}
        </div>
      )}
      {error && (
        <div id={errorId} className="field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

## Color and Contrast

```tsx
// theme/colors.ts
export const colors = {
  primary: {
    main: '#1976d2', // WCAG AAA compliant
    contrast: '#ffffff'
  },
  error: {
    main: '#d32f2f', // WCAG AAA compliant
    contrast: '#ffffff'
  },
  text: {
    primary: '#000000', // High contrast for readability
    secondary: '#555555' // WCAG AA compliant
  }
};
```

## Screen Reader Support

### 1. Hidden Content

```tsx
// components/common/ScreenReaderOnly.tsx
const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

// Usage
const TableActions = () => (
  <button onClick={handleEdit}>
    <EditIcon />
    <ScreenReaderOnly>Edit user details</ScreenReaderOnly>
  </button>
);
```

### 2. Status Updates

```tsx
// components/common/LoadingState.tsx
const LoadingState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return isLoading ? (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CircularProgress />
      <ScreenReaderOnly>Loading content</ScreenReaderOnly>
    </div>
  ) : null;
};
```

## Testing Accessibility

### 1. Automated Testing

```typescript
// __tests__/accessibility/index.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Keyboard Testing

```typescript
// __tests__/accessibility/keyboard.test.tsx
describe('Keyboard Navigation', () => {
  it('should handle keyboard navigation', async () => {
    render(<MyComponent />);
    
    // Tab to first focusable element
    userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    
    // Tab to next element
    userEvent.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});
```

## Best Practices

1. **Semantic HTML**
   - Use proper heading hierarchy
   - Use semantic elements (nav, main, article, etc.)
   - Provide proper ARIA labels

2. **Keyboard Navigation**
   - Ensure all interactive elements are focusable
   - Implement logical tab order
   - Provide keyboard shortcuts where appropriate

3. **Forms**
   - Label all form controls
   - Provide error messages
   - Use fieldset and legend for groups

4. **Images and Media**
   - Provide alt text for images
   - Provide captions for videos
   - Ensure media controls are accessible

5. **Dynamic Content**
   - Update screen readers on content changes
   - Manage focus when content updates
   - Provide loading states

Remember to:
- Test with screen readers
- Ensure keyboard accessibility
- Maintain color contrast
- Provide text alternatives
- Test with accessibility tools
